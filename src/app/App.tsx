import { useState } from 'react';

import { Onboarding } from '../features/onboarding/Onboarding';
import { PreparationView } from '../features/preparation/PreparationView';
import { SprintView } from '../features/sprint/SprintView';
import {
  completeSprint,
  exitSprint,
  startSprint,
  updateDraftContent,
} from '../features/sprint/sprintState';
import { AppShell, type AppView } from './AppShell';
import { usePersistentAppState } from './usePersistentAppState';

export function App() {
  const [activeView, setActiveView] = useState<AppView>('today');
  const [state, setState] = usePersistentAppState();
  const [viewedSprintId, setViewedSprintId] = useState<string | null>(null);

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

  const runningSprint = state.sprints.find((sprint) => sprint.status === 'running');
  const viewedSprint =
    state.sprints.find((sprint) => sprint.id === viewedSprintId) ?? runningSprint;

  if (viewedSprint) {
    const draft = state.drafts.find((candidate) => candidate.id === viewedSprint.draftId);
    const task = state.tasks.find((candidate) => candidate.id === viewedSprint.taskId);

    if (draft && task) {
      const persistDraft = (content: string) =>
        setState((currentState) =>
          updateDraftContent(currentState, draft.id, content, new Date().toISOString()),
        );

      return (
        <SprintView
          draft={draft}
          sprint={viewedSprint}
          task={task}
          onContentChange={persistDraft}
          onComplete={(content) =>
            setState((currentState) => {
              const timestamp = new Date().toISOString();
              return completeSprint(
                updateDraftContent(currentState, draft.id, content, timestamp),
                viewedSprint.id,
                timestamp,
              );
            })
          }
          onExit={(content) => {
            setState((currentState) => {
              const timestamp = new Date().toISOString();
              return exitSprint(
                updateDraftContent(currentState, draft.id, content, timestamp),
                viewedSprint.id,
                timestamp,
              );
            });
            setViewedSprintId(null);
          }}
          onReturn={() => setViewedSprintId(null)}
        />
      );
    }
  }

  function launchSprint(taskId: string) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setState((currentState) => startSprint(currentState, taskId, id, new Date().toISOString()));
    setViewedSprintId(`sprint-${id}`);
  }

  return (
    <AppShell activeView={activeView} onViewChange={setActiveView}>
      {activeView === 'today' ? (
        <PreparationView state={state} updateState={setState} onLaunch={launchSprint} />
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
