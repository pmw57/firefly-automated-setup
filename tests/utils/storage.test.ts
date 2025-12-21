import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LocalStorageService } from '../../utils/storage';
import { getDefaultGameState } from '../../state/reducer';
import { GameState } from '../../types';

describe('utils/storage', () => {
  const KEY = 'test_storage';
  let storageService: LocalStorageService;

  beforeEach(() => {
    storageService = new LocalStorageService(KEY);
    localStorage.clear();
    vi.clearAllMocks(); // Clear mocks for spyOn
  });

  it('saves state to localStorage', () => {
    const state: GameState = getDefaultGameState();
    storageService.save(state);
    expect(localStorage.setItem).toHaveBeenCalledWith(KEY, JSON.stringify(state));
  });

  it('loads state from localStorage', () => {
    const state: GameState = getDefaultGameState();
    localStorage.setItem(KEY, JSON.stringify(state));
    
    const loadedState = storageService.load();
    expect(localStorage.getItem).toHaveBeenCalledWith(KEY);
    expect(loadedState).toEqual(state);
  });

  it('returns null if no state is in localStorage', () => {
    const loadedState = storageService.load();
    expect(loadedState).toBeNull();
  });

  it('returns null and logs an error on JSON parse error', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem(KEY, 'invalid json');
    
    const loadedState = storageService.load();
    expect(loadedState).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('clears state from localStorage', () => {
    storageService.clear();
    expect(localStorage.removeItem).toHaveBeenCalledWith(KEY);
  });
});