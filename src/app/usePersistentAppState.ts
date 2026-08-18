import { useEffect, useState } from 'react';

import { loadAppState, saveAppState } from '../data/localStore';
import type { AppState } from '../domain/models';

export function usePersistentAppState() {
  const [state, setState] = useState<AppState>(() => loadAppState(window.localStorage).state);

  useEffect(() => {
    saveAppState(window.localStorage, state);
  }, [state]);

  return [state, setState] as const;
}
