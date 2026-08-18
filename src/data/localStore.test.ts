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

  it('migrates version 3 data and keeps the most recent project active', () => {
    const storage = new MemoryStorage();
    const legacyState = {
      ...createInitialState(),
      version: 3,
      preferences: {
        defaultDuration: 15,
        hasCompletedOnboarding: true,
        soundEnabled: true,
      },
      projects: [
        {
          id: 'project-old',
          name: 'Ancien projet',
          createdAt: '2026-08-01T10:00:00.000Z',
          updatedAt: '2026-08-01T10:00:00.000Z',
        },
        {
          id: 'project-recent',
          name: 'Projet récent',
          createdAt: '2026-08-02T10:00:00.000Z',
          updatedAt: '2026-08-03T10:00:00.000Z',
        },
      ],
    };
    storage.setItem(APP_STORAGE_KEY, JSON.stringify(legacyState));

    const result = loadAppState(storage);

    expect(result.recovered).toBe(true);
    expect(result.state.version).toBe(4);
    expect(result.state.preferences.activeProjectId).toBe('project-recent');
  });
});
