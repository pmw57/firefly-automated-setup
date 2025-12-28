/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LocalStorageService } from '../../../utils/storage';
// FIX: Changed import from '../../types' to '../../types/index' to fix module resolution ambiguity.
import { GameState } from '../../../types/index';

describe('utils/LocalStorageService', () => {
  const KEY = 'test-key';
  let storageService: LocalStorageService;
  beforeEach(() => {
    storageService = new LocalStorageService(KEY);
    localStorage.clear();
  });
  it('saves state to localStorage', () => {
    const state: GameState = { playerCount: 4 } as GameState;
    storageService.save(state);
    expect(localStorage.setItem).toHaveBeenCalledWith(KEY, JSON.stringify(state));
  });

  it('loads state from localStorage', () => {
    const state: GameState = { playerCount: 4 } as GameState;
    localStorage.setItem(KEY, JSON.stringify(state));
    const loadedState = storageService.load();
    expect(localStorage.getItem).toHaveBeenCalledWith(KEY);
    expect(loadedState).toEqual(state);
  });

  it('returns null if no state is in localStorage', () => {
    const loadedState = storageService.load();
    expect(loadedState).toBeNull();
  });

  it('returns null and logs error for invalid JSON in localStorage', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem(KEY, 'invalid json');
    const loadedState = storageService.load();
    expect(loadedState).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('clears state from localStorage', () => {
    storageService.clear();
    expect(localStorage.removeItem).toHaveBeenCalledWith(KEY);
  });
});