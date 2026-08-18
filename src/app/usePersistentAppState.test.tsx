import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { APP_STORAGE_KEY } from '../data/localStore';
import { usePersistentAppState } from './usePersistentAppState';

function PersistenceHarness() {
  const [state, setState, saveStatus] = usePersistentAppState();

  return (
    <>
      <span role="status">{saveStatus}</span>
      <button
        type="button"
        onClick={() =>
          setState((currentState) => ({
            ...currentState,
            preferences: { ...currentState.preferences, soundEnabled: false },
          }))
        }
      >
        Modifier
      </button>
      <span>{String(state.preferences.soundEnabled)}</span>
    </>
  );
}

describe('persistent app state', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('reports a save only after local storage has been updated', () => {
    render(<PersistenceHarness />);
    expect(screen.getByRole('status')).toHaveTextContent('saving');

    act(() => vi.advanceTimersByTime(250));
    expect(screen.getByRole('status')).toHaveTextContent('saved');

    fireEvent.click(screen.getByRole('button', { name: 'Modifier' }));
    expect(screen.getByRole('status')).toHaveTextContent('saving');

    act(() => vi.advanceTimersByTime(250));
    expect(screen.getByRole('status')).toHaveTextContent('saved');
    expect(JSON.parse(window.localStorage.getItem(APP_STORAGE_KEY) ?? '{}')).toMatchObject({
      preferences: { soundEnabled: false },
    });
  });

  it('surfaces a storage failure', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage full');
    });

    render(<PersistenceHarness />);
    act(() => vi.advanceTimersByTime(250));

    expect(screen.getByRole('status')).toHaveTextContent('error');
  });
});
