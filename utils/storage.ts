import { GameState } from '../types/index';

/**
 * An interface for a generic storage service.
 */
export interface StorageService<T> {
  save(state: T): void;
  load(): T | null;
  clear(): void;
}

/**
 * An implementation of StorageService using the browser's localStorage.
 */
export class LocalStorageService implements StorageService<GameState> {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  save(state: GameState): void {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(this.key, serializedState);
    } catch (e) {
      console.error("Could not save state to local storage", e);
    }
  }

  load(): GameState | null {
    try {
      const serializedState = localStorage.getItem(this.key);
      if (serializedState === null) {
        return null;
      }
      return JSON.parse(serializedState);
    } catch (e) {
      console.error("Could not load state from local storage", e);
      return null;
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(this.key);
    } catch (e) {
      console.error("Could not clear state from local storage", e);
    }
  }
}
