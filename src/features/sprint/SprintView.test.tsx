import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { WritingDraft, WritingSprint, WritingTask } from '../../domain/models';
import { SprintView, TIME_UP_HOLD_MS } from './SprintView';

const timestamp = '2026-08-18T12:00:00.000Z';

const draft: WritingDraft = {
  id: 'draft-1',
  taskId: 'task-1',
  kind: 'sprint',
  sourceDraftId: null,
  content: 'Une matière sauvegardée.',
  createdAt: timestamp,
  updatedAt: timestamp,
};

const sprint: WritingSprint = {
  id: 'sprint-1',
  taskId: 'task-1',
  draftId: 'draft-1',
  durationMinutes: 5,
  initialWordCount: 0,
  wordGoal: null,
  startedAt: '2026-08-18T11:55:00.000Z',
  plannedEndAt: timestamp,
  endedAt: null,
  status: 'running',
};

const task: WritingTask = {
  id: 'task-1',
  projectId: 'project-1',
  title: 'Rédiger une scène',
  seed: '',
  durationMinutes: 5,
  wordGoal: null,
  order: 0,
  status: 'active',
  createdAt: timestamp,
  updatedAt: timestamp,
};

afterEach(() => vi.useRealTimers());

describe('SprintView', () => {
  it('blocks writing at zero before completing the sprint', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(timestamp));
    const onComplete = vi.fn();

    render(
      <SprintView
        draft={draft}
        onComplete={onComplete}
        onContentChange={vi.fn()}
        onExit={vi.fn()}
        onFinishEarly={vi.fn()}
        onSoundToggle={vi.fn()}
        soundEnabled={false}
        sprint={sprint}
        task={task}
      />,
    );

    expect(screen.getByRole('alertdialog', { name: 'Le temps est écoulé.' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Zone d’écriture du sprint' })).toBeDisabled();
    expect(onComplete).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(TIME_UP_HOLD_MS));

    expect(onComplete).toHaveBeenCalledWith('Une matière sauvegardée.');
  });
});
