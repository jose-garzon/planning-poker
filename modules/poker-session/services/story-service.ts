import type { DBStorage } from '@/shared/storage/db-storage';
import type { Session, Story } from './types';

export class StoryService {
  private readonly STORE = 'sessions';

  constructor(private readonly db: DBStorage) {}

  async addStory(sessionId: string, story: { id: string; title: string }): Promise<Story> {
    await this.db.open();

    const session = await this.db.get<Session>(this.STORE, sessionId);
    if (session === undefined) {
      throw new Error(`StoryService: Session "${sessionId}" not found.`);
    }

    const duplicate = session.stories.some((s) => s.id === story.id);
    if (duplicate) {
      throw new Error(
        `StoryService: Story ID "${story.id}" already exists in session "${sessionId}".`,
      );
    }

    const newStory: Story = {
      id: story.id,
      title: story.title,
      status: 'pending',
      score: null,
      votes: {},
      votingStartedAt: null,
      votingEndedAt: null,
    };

    session.stories.push(newStory);
    await this.db.set(this.STORE, session);

    return newStory;
  }

  async updateStory(
    sessionId: string,
    storyId: string,
    patch: { id?: string; title?: string },
  ): Promise<Story> {
    await this.db.open();

    const session = await this.db.get<Session>(this.STORE, sessionId);
    if (session === undefined) {
      throw new Error(`StoryService: Session "${sessionId}" not found.`);
    }

    const story = session.stories.find((s) => s.id === storyId);
    if (story === undefined) {
      throw new Error(`StoryService: Story "${storyId}" not found in session "${sessionId}".`);
    }

    if (patch.id !== undefined && patch.id !== storyId) {
      const idTaken = session.stories.some((s) => s.id === patch.id);
      if (idTaken) {
        throw new Error(
          `StoryService: Story ID "${patch.id}" already exists in session "${sessionId}".`,
        );
      }
      story.id = patch.id;

      if (session.currentStoryId === storyId) {
        session.currentStoryId = patch.id;
      }
    }

    if (patch.title !== undefined) {
      story.title = patch.title;
    }

    await this.db.set(this.STORE, session);

    return story;
  }

  async deleteStory(sessionId: string, storyId: string): Promise<void> {
    await this.db.open();

    const session = await this.db.get<Session>(this.STORE, sessionId);
    if (session === undefined) {
      throw new Error(`StoryService: Session "${sessionId}" not found.`);
    }

    const index = session.stories.findIndex((s) => s.id === storyId);
    if (index === -1) {
      throw new Error(`StoryService: Story "${storyId}" not found in session "${sessionId}".`);
    }

    session.stories.splice(index, 1);

    if (session.currentStoryId === storyId) {
      session.currentStoryId = null;
    }

    await this.db.set(this.STORE, session);
  }

  async getStory(sessionId: string, storyId: string): Promise<Story | undefined> {
    await this.db.open();

    const session = await this.db.get<Session>(this.STORE, sessionId);
    if (session === undefined) {
      return undefined;
    }

    return session.stories.find((s) => s.id === storyId) ?? undefined;
  }
}
