import { createInitialState, STORAGE_VERSION, type AppState } from '../domain/models';

export const APP_STORAGE_KEY = 'laforge:state';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface LoadResult {
  state: AppState;
  recovered: boolean;
}

function isAppState(value: unknown): value is AppState {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<AppState>;
  return (
    candidate.version === STORAGE_VERSION &&
    typeof candidate.preferences === 'object' &&
    Array.isArray(candidate.projects) &&
    Array.isArray(candidate.tasks) &&
    Array.isArray(candidate.drafts) &&
    Array.isArray(candidate.sprints) &&
    Array.isArray(candidate.practice)
  );
}

export function loadAppState(storage: StorageLike): LoadResult {
  const serializedState = storage.getItem(APP_STORAGE_KEY);
  if (!serializedState) return { state: createInitialState(), recovered: false };

  try {
    const parsedState: unknown = JSON.parse(serializedState);
    if (isAppState(parsedState)) return { state: parsedState, recovered: true };
  } catch {
    // La valeur d'origine reste intacte pour permettre une récupération manuelle.
  }

  return { state: createInitialState(), recovered: false };
}

export function saveAppState(storage: StorageLike, state: AppState): void {
  storage.setItem(APP_STORAGE_KEY, JSON.stringify(state));
}
