import { describe, expect, it } from 'vitest';

import { createInitialState } from '../domain/models';
import { APP_STORAGE_KEY, loadAppState, saveAppState, type StorageLike } from './localStore';

class MemoryStorage implements StorageLike {
  private values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

describe('local app state', () => {
  it('round-trips a versioned state', () => {
    const storage = new MemoryStorage();
    const state = createInitialState();
    state.preferences.hasCompletedOnboarding = true;

    saveAppState(storage, state);

    expect(loadAppState(storage)).toEqual({ state, recovered: true });
  });

  it('does not overwrite an unreadable source value', () => {
    const storage = new MemoryStorage();
    storage.setItem(APP_STORAGE_KEY, '{not-valid-json');

    expect(loadAppState(storage).recovered).toBe(false);
    expect(storage.getItem(APP_STORAGE_KEY)).toBe('{not-valid-json');
  });
});
