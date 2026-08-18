import { useEffect, useMemo, useRef, useState } from 'react';

import { KeyButton } from '../../components/KeyButton';
import type { WritingDraft, WritingSprint, WritingTask } from '../../domain/models';
import { ForwardEditor } from './ForwardEditor';
import { playClockTick, startTimeUpAlarm, unlockClockAudio } from './clockAudio';
import { TimeUpOverlay } from './TimeUpOverlay';
import { countWords } from './wordCount';

export const TIME_UP_HOLD_MS = 4_200;

type SprintViewProps = {
  draft: WritingDraft;
  onComplete: (content: string) => void;
  onContentChange: (content: string) => void;
  onExit: (content: string) => void;
  onFinishEarly: (content: string) => void;
  onSoundToggle: (enabled: boolean) => void;
  soundEnabled: boolean;
  sprint: WritingSprint;
  task: WritingTask;
};

function formatRemaining(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function SprintView({
  draft,
  onComplete,
  onContentChange,
  onExit,
  onFinishEarly,
  onSoundToggle,
  soundEnabled,
  sprint,
  task,
}: SprintViewProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    Math.max(0, Math.ceil((new Date(sprint.plannedEndAt).getTime() - Date.now()) / 1000)),
  );
  const [wordCount, setWordCount] = useState(() => countWords(draft.content));
  const [confirmExit, setConfirmExit] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const latestContentRef = useRef(draft.content);
  const completedRef = useRef(false);
  const previousSecondRef = useRef(remainingSeconds);
  const completionTimerRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const progress = useMemo(() => {
    const totalSeconds = Math.max(1, sprint.durationMinutes * 60);
    return Math.min(100, ((totalSeconds - remainingSeconds) / totalSeconds) * 100);
  }, [remainingSeconds, sprint.durationMinutes]);

  useEffect(() => {
    if (sprint.status !== 'running') return;

    const updateTimer = () => {
      const nextRemaining = Math.max(
        0,
        Math.ceil((new Date(sprint.plannedEndAt).getTime() - Date.now()) / 1000),
      );
      setRemainingSeconds(nextRemaining);
      if (nextRemaining === 0 && !completedRef.current) {
        completedRef.current = true;
        setConfirmExit(false);
        setTimeUp(true);
        completionTimerRef.current = window.setTimeout(
          () => onCompleteRef.current(latestContentRef.current),
          TIME_UP_HOLD_MS,
        );
      }
    };

    updateTimer();
    const interval = window.setInterval(updateTimer, 250);

    return () => {
      window.clearInterval(interval);
      if (completionTimerRef.current) window.clearTimeout(completionTimerRef.current);
    };
  }, [sprint.plannedEndAt, sprint.status]);

  useEffect(() => {
    if (soundEnabled && remainingSeconds > 0 && previousSecondRef.current !== remainingSeconds) {
      playClockTick(remainingSeconds % 2 === 0);
    }
    previousSecondRef.current = remainingSeconds;
  }, [remainingSeconds, soundEnabled]);

  useEffect(() => {
    if (!timeUp || !soundEnabled) return;
    return startTimeUpAlarm();
  }, [soundEnabled, timeUp]);

  function toggleSound() {
    const nextEnabled = !soundEnabled;
    onSoundToggle(nextEnabled);
    if (nextEnabled) {
      void unlockClockAudio().then(() => playClockTick(false));
    }
  }

  function persistContent(content: string) {
    latestContentRef.current = content;
    onContentChange(content);
  }

  return (
    <main className="sprint-screen">
      <div className="sprint-content" inert={timeUp}>
        <header className="sprint-header">
          <div className="sprint-task">
            <span>Pièce active</span>
            <strong>{task.title}</strong>
          </div>
          <div
            className="sprint-timer"
            role="timer"
            aria-label={`${remainingSeconds} secondes restantes`}
          >
            {formatRemaining(remainingSeconds)}
          </div>
          <div className="sprint-controls">
            <button
              className="sound-key"
              type="button"
              aria-pressed={soundEnabled}
              onClick={toggleSound}
            >
              <span aria-hidden="true">{soundEnabled ? '◖' : '×'}</span>
              Tic-tac {soundEnabled ? 'actif' : 'coupé'}
            </button>
            <button className="exit-link" type="button" onClick={() => setConfirmExit(true)}>
              Sortir
            </button>
          </div>
          <div className="sprint-progress" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
        </header>

        <section className="writing-desk" aria-label="Sprint d’écriture en cours">
          <ForwardEditor
            disabled={timeUp}
            initialContent={draft.content}
            onContentChange={persistContent}
            onWordCountChange={setWordCount}
          />
          <footer className="writing-stats">
            <span>{wordCount} mots</span>
            <span>{sprint.wordGoal ? `objectif ${sprint.wordGoal}` : 'sans objectif de mots'}</span>
            <span>sauvegarde locale</span>
          </footer>
        </section>
      </div>

      {timeUp && <TimeUpOverlay soundEnabled={soundEnabled} />}

      {confirmExit && (
        <div className="exit-backdrop" role="presentation">
          <section
            className="exit-dialog paper-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-title"
          >
            <p className="eyebrow">Sortie anticipée</p>
            <h2 id="exit-title">Quitter le sprint&nbsp;?</h2>
            <p>
              Vous pouvez valider la matière déjà produite ou quitter sans compter cette session.
            </p>
            <div>
              <KeyButton onClick={() => setConfirmExit(false)}>Continuer d’écrire</KeyButton>
              <KeyButton onClick={() => onExit(latestContentRef.current)}>
                Quitter sans valider
              </KeyButton>
              <KeyButton variant="primary" onClick={() => onFinishEarly(latestContentRef.current)}>
                Terminer maintenant
              </KeyButton>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
