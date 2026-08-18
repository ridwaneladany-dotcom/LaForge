import { useEffect, useMemo, useRef, useState } from 'react';

import { KeyButton } from '../../components/KeyButton';
import type { WritingDraft, WritingSprint, WritingTask } from '../../domain/models';
import { ForwardEditor } from './ForwardEditor';
import { countWords } from './wordCount';

type SprintViewProps = {
  draft: WritingDraft;
  onComplete: (content: string) => void;
  onContentChange: (content: string) => void;
  onExit: (content: string) => void;
  onReturn: () => void;
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
  onReturn,
  sprint,
  task,
}: SprintViewProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    Math.max(0, Math.ceil((new Date(sprint.plannedEndAt).getTime() - Date.now()) / 1000)),
  );
  const [wordCount, setWordCount] = useState(() => countWords(draft.content));
  const [confirmExit, setConfirmExit] = useState(false);
  const latestContentRef = useRef(draft.content);
  const completedRef = useRef(sprint.status === 'completed');
  const isFinished = sprint.status === 'completed';

  const progress = useMemo(() => {
    const totalSeconds = Math.max(1, sprint.durationMinutes * 60);
    return Math.min(100, ((totalSeconds - remainingSeconds) / totalSeconds) * 100);
  }, [remainingSeconds, sprint.durationMinutes]);

  useEffect(() => {
    if (sprint.status !== 'running') return;

    const interval = window.setInterval(() => {
      const nextRemaining = Math.max(
        0,
        Math.ceil((new Date(sprint.plannedEndAt).getTime() - Date.now()) / 1000),
      );
      setRemainingSeconds(nextRemaining);
      if (nextRemaining === 0 && !completedRef.current) {
        completedRef.current = true;
        onComplete(latestContentRef.current);
      }
    }, 250);

    return () => window.clearInterval(interval);
  }, [onComplete, sprint.plannedEndAt, sprint.status]);

  function persistContent(content: string) {
    latestContentRef.current = content;
    onContentChange(content);
  }

  if (isFinished) {
    return (
      <main className="sprint-finished">
        <div className="finish-sheet paper-panel">
          <p className="eyebrow">Temps écoulé</p>
          <h1>La pièce existe.</h1>
          <p>Vous avez produit {wordCount} mots sans casser votre élan.</p>
          <KeyButton variant="primary" onClick={onReturn}>
            Voir le résultat
          </KeyButton>
        </div>
      </main>
    );
  }

  return (
    <main className="sprint-screen">
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
        <button className="exit-link" type="button" onClick={() => setConfirmExit(true)}>
          Sortir
        </button>
        <div className="sprint-progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
      </header>

      <section className="writing-desk" aria-label="Sprint d’écriture en cours">
        <ForwardEditor
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
            <p>Votre texte sera conservé, mais cette session sera marquée comme interrompue.</p>
            <div>
              <KeyButton onClick={() => setConfirmExit(false)}>Continuer d’écrire</KeyButton>
              <KeyButton variant="primary" onClick={() => onExit(latestContentRef.current)}>
                Quitter et conserver
              </KeyButton>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
