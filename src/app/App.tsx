import { useState } from 'react';

import { CompletionView } from '../features/completion/CompletionView';
import { RevisionView } from '../features/completion/RevisionView';
import {
  completeTask,
  continueSprint,
  createRevisionDraft,
} from '../features/completion/completionState';
import { Onboarding } from '../features/onboarding/Onboarding';
import { PreparationView } from '../features/preparation/PreparationView';
import { ProjectsView } from '../features/projects/ProjectsView';
import { SprintView } from '../features/sprint/SprintView';
import { unlockClockAudio } from '../features/sprint/clockAudio';
import {
  completeSprint,
  exitSprint,
  startSprint,
  updateDraftContent,
} from '../features/sprint/sprintState';
import { AppShell, type AppView } from './AppShell';
import { usePersistentAppState } from './usePersistentAppState';

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function App() {
  const [activeView, setActiveView] = useState<AppView>('today');
  const [state, setState, saveStatus] = usePersistentAppState();
  const [viewedSprintId, setViewedSprintId] = useState<string | null>(null);
  const [revisionDraftId, setRevisionDraftId] = useState<string | null>(null);

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
    const revisionDraft = state.drafts.find((candidate) => candidate.id === revisionDraftId);

    if (draft && task && revisionDraft) {
      return (
        <RevisionView
          draft={revisionDraft}
          saveStatus={saveStatus}
          task={task}
          onBack={() => setRevisionDraftId(null)}
          onContentChange={(content) =>
            setState((currentState) =>
              updateDraftContent(currentState, revisionDraft.id, content, new Date().toISOString()),
            )
          }
          onCompleteTask={() => {
            setState((currentState) =>
              completeTask(currentState, task.id, new Date().toISOString()),
            );
            setRevisionDraftId(null);
            setViewedSprintId(null);
          }}
        />
      );
    }

    if (draft && task && viewedSprint.status === 'completed') {
      return (
        <CompletionView
          draft={draft}
          practice={state.practice}
          sprint={viewedSprint}
          task={task}
          onRevise={() => {
            const id = createId();
            setState((currentState) =>
              createRevisionDraft(currentState, draft.id, id, new Date().toISOString()),
            );
            setRevisionDraftId(`draft-${id}`);
          }}
          onContinue={() => {
            const id = createId();
            setState((currentState) =>
              continueSprint(currentState, viewedSprint.id, id, new Date().toISOString()),
            );
            setViewedSprintId(`sprint-${id}`);
          }}
          onCompleteTask={() => {
            setState((currentState) =>
              completeTask(currentState, task.id, new Date().toISOString()),
            );
            setViewedSprintId(null);
          }}
          onReplan={() => setViewedSprintId(null)}
        />
      );
    }

    if (draft && task && viewedSprint.status === 'running') {
      const persistDraft = (content: string) =>
        setState((currentState) =>
          updateDraftContent(currentState, draft.id, content, new Date().toISOString()),
        );
      const finishSprint = (content: string) =>
        setState((currentState) => {
          const timestamp = new Date().toISOString();
          return completeSprint(
            updateDraftContent(currentState, draft.id, content, timestamp),
            viewedSprint.id,
            timestamp,
          );
        });

      return (
        <SprintView
          draft={draft}
          sprint={viewedSprint}
          task={task}
          onContentChange={persistDraft}
          onComplete={finishSprint}
          onFinishEarly={finishSprint}
          soundEnabled={state.preferences.soundEnabled}
          saveStatus={saveStatus}
          onSoundToggle={(soundEnabled) =>
            setState((currentState) => ({
              ...currentState,
              preferences: { ...currentState.preferences, soundEnabled },
            }))
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
        />
      );
    }
  }

  function launchSprint(taskId: string) {
    if (state.preferences.soundEnabled) void unlockClockAudio();
    const id = createId();
    setState((currentState) => startSprint(currentState, taskId, id, new Date().toISOString()));
    setViewedSprintId(`sprint-${id}`);
  }

  return (
    <AppShell activeView={activeView} onViewChange={setActiveView} saveStatus={saveStatus}>
      {activeView === 'today' ? (
        <PreparationView state={state} updateState={setState} onLaunch={launchSprint} />
      ) : (
        <ProjectsView
          state={state}
          updateState={setState}
          onOpenProject={() => setActiveView('today')}
        />
      )}
    </AppShell>
  );
}
