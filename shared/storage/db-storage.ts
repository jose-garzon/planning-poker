/**
 * DBStorage — promise-based IndexedDB wrapper.
 *
 * Usage:
 *   const db = new DBStorage('planning-poker', 1, [
 *     { name: 'sessions', keyPath: 'id' },
 *     { name: 'votes', keyPath: 'id', indexes: [{ name: 'by-session', keyPath: 'sessionId' }] },
 *   ]);
 *
 *   await db.open();
 *   await db.set('sessions', { id: 'abc', title: 'Sprint 1' });
 *   const session = await db.get<Session>('sessions', 'abc');
 */

export type IndexConfig = {
  name: string;
  keyPath: string;
  unique?: boolean;
};

export type StoreConfig = {
  name: string;
  keyPath: string;
  indexes?: IndexConfig[];
};

export class DBStorage {
  private readonly dbName: string;
  private readonly version: number;
  private readonly stores: StoreConfig[];
  private db: IDBDatabase | null = null;

  constructor(dbName: string, version: number, stores: StoreConfig[]) {
    this.dbName = dbName;
    this.version = version;
    this.stores = stores;
  }

  open(): Promise<void> {
    if (this.db !== null) {
      return Promise.resolve();
    }

    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return Promise.reject(
        new Error('DBStorage: IndexedDB is not available in this environment.'),
      );
    }

    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        for (const store of this.stores) {
          if (!db.objectStoreNames.contains(store.name)) {
            const objectStore = db.createObjectStore(store.name, { keyPath: store.keyPath });

            for (const index of store.indexes ?? []) {
              objectStore.createIndex(index.name, index.keyPath, {
                unique: index.unique ?? false,
              });
            }
          }
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = (event) => {
        const error = (event.target as IDBOpenDBRequest).error;
        reject(
          new Error(
            `DBStorage: Failed to open database "${this.dbName}": ${error?.message ?? 'unknown error'}`,
          ),
        );
      };
    });
  }

  get<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    return this.transaction<T | undefined>(storeName, 'readonly', (store) => store.get(key));
  }

  getAll<T>(storeName: string): Promise<T[]> {
    return this.transaction<T[]>(storeName, 'readonly', (store) => store.getAll());
  }

  set<T>(storeName: string, value: T): Promise<void> {
    return this.transaction<void>(storeName, 'readwrite', (store) => {
      store.put(value);
      // put() returns IDBRequest<IDBValidKey> but we resolve void after the transaction completes
      return null;
    });
  }

  delete(storeName: string, key: IDBValidKey): Promise<void> {
    return this.transaction<void>(storeName, 'readwrite', (store) => {
      store.delete(key);
      return null;
    });
  }
  clear(storeName: string): Promise<void> {
    return this.transaction<void>(storeName, 'readwrite', (store) => {
      store.clear();
      return null;
    });
  }

  private transaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    fn: (store: IDBObjectStore) => IDBRequest | null,
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const db = this.requireDB();
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);

      const request = fn(store);

      if (request !== null) {
        request.onsuccess = (event) => {
          resolve((event.target as IDBRequest<T>).result);
        };

        request.onerror = (event) => {
          const error = (event.target as IDBRequest).error;
          reject(
            new Error(
              `DBStorage: Operation on "${storeName}" failed: ${error?.message ?? 'unknown error'}`,
            ),
          );
        };
      }

      tx.oncomplete = () => {
        if (request === null) {
          // Write operations with no result — resolve void after commit
          resolve(undefined as T);
        }
      };

      tx.onerror = (event) => {
        const error = (event.target as IDBTransaction).error;
        reject(
          new Error(
            `DBStorage: Transaction on "${storeName}" failed: ${error?.message ?? 'unknown error'}`,
          ),
        );
      };

      tx.onabort = (event) => {
        const error = (event.target as IDBTransaction).error;
        reject(
          new Error(
            `DBStorage: Transaction on "${storeName}" was aborted: ${error?.message ?? 'unknown error'}`,
          ),
        );
      };
    });
  }

  private requireDB(): IDBDatabase {
    if (this.db === null) {
      throw new Error(
        'DBStorage: Database is not open. Call open() before any read/write operation.',
      );
    }
    return this.db;
  }
}
