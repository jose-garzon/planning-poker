import { DBStorage } from './db-storage';

export const appDB = new DBStorage('planning-poker', 1, [{ name: 'sessions', keyPath: 'id' }]);
