import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

import { loadAppState, saveAppState } from '../data/localStore';
import type { AppState } from '../domain/models';

export type SaveStatus = 'error' | 'saved' | 'saving';

export function usePersistentAppState() {
  const [state, setState] = useState<AppState>(() => loadAppState(window.localStorage).state);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saving');
  const latestStateRef = useRef(state);
  const saveTimerRef = useRef<number | null>(null);

  const persistLatestState = useCallback((reportStatus: boolean) => {
    try {
      saveAppState(window.localStorage, latestStateRef.current);
      if (reportStatus) setSaveStatus('saved');
    } catch {
      if (reportStatus) setSaveStatus('error');
    }
  }, []);

  const updateState = useCallback<Dispatch<SetStateAction<AppState>>>((action) => {
    setSaveStatus('saving');
    setState(action);
  }, []);

  useEffect(() => {
    latestStateRef.current = state;
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => persistLatestState(true), 250);

    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, [persistLatestState, state]);

  useEffect(() => {
    const flushPendingSave = () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
      persistLatestState(false);
    };

    window.addEventListener('pagehide', flushPendingSave);
    return () => {
      window.removeEventListener('pagehide', flushPendingSave);
      flushPendingSave();
    };
  }, [persistLatestState]);

  return [state, updateState, saveStatus] as const;
}
