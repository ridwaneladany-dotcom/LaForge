import { act, fireEvent, render, screen } from '@testing-library/react';
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
  it('moves focus into the exit dialog and restores it when closing', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-18T11:55:00.000Z'));
    const futureSprint = { ...sprint, plannedEndAt: '2026-08-18T12:00:00.000Z' };

    render(
      <SprintView
        draft={draft}
        onComplete={vi.fn()}
        onContentChange={vi.fn()}
        onExit={vi.fn()}
        onFinishEarly={vi.fn()}
        onSoundToggle={vi.fn()}
        saveStatus="saved"
        soundEnabled={false}
        sprint={futureSprint}
        task={task}
      />,
    );

    const exitButton = screen.getByRole('button', { name: 'Sortir' });
    fireEvent.click(exitButton);

    const dialog = screen.getByRole('dialog', { name: /Quitter le sprint/ });
    expect(screen.getByRole('button', { name: 'Continuer d’écrire' })).toHaveFocus();

    fireEvent.keyDown(dialog, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(exitButton).toHaveFocus();
  });

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
        saveStatus="saved"
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
