import { useState } from 'react';

import { PreparationView } from '../features/preparation/PreparationView';
import { Onboarding } from '../features/onboarding/Onboarding';
import { AppShell, type AppView } from './AppShell';
import { usePersistentAppState } from './usePersistentAppState';

export function App() {
  const [activeView, setActiveView] = useState<AppView>('today');
  const [state, setState] = usePersistentAppState();

  if (!state.preferences.hasCompletedOnboarding) {
    return (
      <Onboarding
        onComplete={() =>
          setState((currentState) => ({
            ...currentState,
            preferences: { ...currentState.preferences, hasCompletedOnboarding: true },
          }))
        }
      />
    );
  }

  return (
    <AppShell activeView={activeView} onViewChange={setActiveView}>
      {activeView === 'today' ? (
        <PreparationView state={state} updateState={setState} />
      ) : (
        <section className="empty-layout" aria-labelledby="projects-title">
          <div className="empty-copy">
            <p className="eyebrow">Archives</p>
            <h1 id="projects-title" className="hero-title">
              Vos projets.
            </h1>
            <p className="hero-copy">Vos futurs projets et leurs sessions apparaîtront ici.</p>
          </div>
        </section>
      )}
    </AppShell>
  );
}
