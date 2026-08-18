import forgeMark from '../../../assets/laforge-mark.svg';
import { KeyButton } from '../../components/KeyButton';
import type { PracticeDay, WritingDraft, WritingSprint, WritingTask } from '../../domain/models';
import { downloadDraft } from '../projects/projectFiles';
import { getCurrentStreak, getSprintMetrics } from './completionState';

type CompletionViewProps = {
  draft: WritingDraft;
  onCompleteTask: () => void;
  onContinue: () => void;
  onReplan: () => void;
  onRevise: () => void;
  practice: PracticeDay[];
  sprint: WritingSprint;
  task: WritingTask;
};

function getHeatLevel(minutes: number) {
  if (minutes >= 60) return { label: 'Forge ardente', progress: 100 };
  if (minutes >= 30) return { label: 'Métal rouge', progress: 72 };
  if (minutes >= 15) return { label: 'Braise vive', progress: 46 };
  return { label: 'Étincelle', progress: Math.max(12, Math.round((minutes / 15) * 46)) };
}

export function CompletionView({
  draft,
  onCompleteTask,
  onContinue,
  onReplan,
  onRevise,
  practice,
  sprint,
  task,
}: CompletionViewProps) {
  const metrics = getSprintMetrics(sprint, draft);
  const completedDate = (sprint.endedAt ?? new Date().toISOString()).slice(0, 10);
  const streak = getCurrentStreak(practice, completedDate);
  const today = practice.find((day) => day.date === completedDate);
  const heat = getHeatLevel(today?.minutesWritten ?? metrics.minutes);

  return (
    <main className="completion-screen">
      <header className="completion-header">
        <div className="brand" aria-label="LaForge">
          <img src={forgeMark} alt="" />
          <span>LaForge</span>
        </div>
        <span>Session terminée</span>
      </header>

      <section className="completion-layout" aria-labelledby="completion-title">
        <div className="completion-copy">
          <div className="completion-mark" aria-hidden="true">
            <img src={forgeMark} alt="" />
          </div>
          <p className="eyebrow">La pièce existe</p>
          <h1 id="completion-title">
            Vous avez forgé
            <br />
            {metrics.words} mots.
          </h1>
          <p>
            Le premier jet n’a pas besoin d’être parfait. Il avait besoin d’exister — et maintenant,
            il existe.
          </p>
        </div>

        <aside className="result-ticket paper-panel" aria-label="Bilan du sprint">
          <p className="ticket-task">{task.title}</p>
          <dl className="result-stats">
            <div>
              <dt>Mots produits</dt>
              <dd>{metrics.words}</dd>
            </div>
            <div>
              <dt>Minutes</dt>
              <dd>{metrics.minutes}</dd>
            </div>
            <div>
              <dt>Série actuelle</dt>
              <dd>{streak} j</dd>
            </div>
          </dl>

          <div className="heat-progress">
            <div>
              <span>Chaleur du jour</span>
              <strong>{heat.label}</strong>
            </div>
            <div className="heat-track" aria-label={`Chaleur du jour : ${heat.label}`}>
              <span style={{ width: `${heat.progress}%` }} />
            </div>
            <small>{today?.minutesWritten ?? metrics.minutes} min investies aujourd’hui</small>
          </div>

          {metrics.reachedGoal !== null && (
            <p className="goal-result" data-reached={metrics.reachedGoal}>
              {metrics.reachedGoal
                ? 'Objectif de mots atteint.'
                : 'Objectif non atteint — le jet compte quand même.'}
            </p>
          )}

          <div className="completion-next-step">
            <span>Étape recommandée</span>
            <strong>Façonnez maintenant la matière.</strong>
            <p>Relisez librement, corrigez et retirez vos marqueurs.</p>
            <KeyButton variant="primary" onClick={onRevise}>
              Ouvrir la révision
            </KeyButton>
          </div>

          <div className="completion-continue">
            <div>
              <strong>Encore dans l’élan&nbsp;?</strong>
              <span>Prolongez ce même jet sans reconfigurer la tâche.</span>
            </div>
            <KeyButton onClick={onContinue}>Continuer 5 min</KeyButton>
          </div>

          <p className="completion-task-label">Que devient cette tâche&nbsp;?</p>
          <div className="completion-task-actions">
            <button type="button" onClick={onCompleteTask}>
              <strong>Terminer la tâche</strong>
              <span>La classer et revenir à l’atelier</span>
            </button>
            <button type="button" onClick={onReplan}>
              <strong>La garder à l’atelier</strong>
              <span>La reprendre lors d’un prochain sprint</span>
            </button>
          </div>

          <div className="draft-export-actions" aria-label="Exporter ce jet">
            <span>Emporter ce jet</span>
            <button type="button" onClick={() => downloadDraft(task, draft, 'text')}>
              Texte brut
            </button>
            <button type="button" onClick={() => downloadDraft(task, draft, 'markdown')}>
              Markdown
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}
