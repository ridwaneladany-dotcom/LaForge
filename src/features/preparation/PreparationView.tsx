import { useId, useState, type FormEvent } from 'react';

import { KeyButton } from '../../components/KeyButton';
import { SPRINT_DURATIONS, type AppState, type WritingTask } from '../../domain/models';
import {
  getTaskGuidance,
  MAX_ACTIVE_TASKS,
  MAX_TASK_TITLE_LENGTH,
  normalizeTaskTitle,
  validateTaskTitle,
} from '../../domain/taskRules';
import {
  createTask,
  getPreparedTasks,
  moveTask,
  removeTask,
  selectTask,
  updateTask,
} from './taskState';
import { getActiveProject } from '../projects/projectState';

type PreparationViewProps = {
  onLaunch: (taskId: string) => void;
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function TaskCard({
  index,
  task,
  taskCount,
  updateState,
}: {
  index: number;
  task: WritingTask;
  taskCount: number;
  updateState: PreparationViewProps['updateState'];
}) {
  const guidance = getTaskGuidance(task.title);
  const timestamp = () => new Date().toISOString();

  return (
    <article className="task-card" data-active={task.status === 'active' || undefined}>
      <button
        className="task-select"
        type="button"
        aria-label={`Choisir la tâche ${index + 1}`}
        aria-pressed={task.status === 'active'}
        onClick={() => updateState((state) => selectTask(state, task.id))}
      >
        <span>{String(index + 1).padStart(2, '0')}</span>
      </button>

      <div className="task-body">
        <label className="visually-hidden" htmlFor={`task-${task.id}`}>
          Tâche {index + 1}
        </label>
        <input
          id={`task-${task.id}`}
          className="task-title-input"
          maxLength={MAX_TASK_TITLE_LENGTH}
          value={task.title}
          onChange={(event) =>
            updateState((state) =>
              updateTask(state, task.id, { title: event.target.value }, timestamp()),
            )
          }
          onBlur={() =>
            updateState((state) =>
              updateTask(state, task.id, { title: normalizeTaskTitle(task.title) }, timestamp()),
            )
          }
        />
        <p
          className="task-guidance"
          data-ready={!getTaskGuidance(task.title).startsWith('Précise')}
        >
          {guidance}
        </p>
      </div>

      <div className="task-actions" aria-label={`Actions pour la tâche ${index + 1}`}>
        <button
          type="button"
          aria-label="Monter la tâche"
          disabled={index === 0}
          onClick={() => updateState((state) => moveTask(state, task.id, -1))}
        >
          ↑
        </button>
        <button
          type="button"
          aria-label="Descendre la tâche"
          disabled={index === taskCount - 1}
          onClick={() => updateState((state) => moveTask(state, task.id, 1))}
        >
          ↓
        </button>
        <button
          type="button"
          aria-label="Supprimer la tâche"
          onClick={() => updateState((state) => removeTask(state, task.id))}
        >
          ×
        </button>
      </div>
    </article>
  );
}

export function PreparationView({ onLaunch, state, updateState }: PreparationViewProps) {
  const [newTitle, setNewTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showReview, setShowReview] = useState(false);
  const newTaskId = useId();
  const tasks = getPreparedTasks(state);
  const activeTask = tasks.find((task) => task.status === 'active') ?? tasks[0];
  const activeProject = getActiveProject(state);

  function handleAddTask(event: FormEvent) {
    event.preventDefault();
    const validationError = validateTaskTitle(newTitle);
    if (validationError) {
      setError(validationError);
      return;
    }

    updateState((currentState) =>
      createTask(currentState, newTitle, createId(), new Date().toISOString()),
    );
    setNewTitle('');
    setError(null);
  }

  if (showReview && activeTask) {
    return (
      <section className="review-layout" aria-labelledby="review-title">
        <div className="review-ticket paper-panel">
          <p className="eyebrow">Bon de lancement</p>
          <h1 id="review-title">Le métal est prêt.</h1>
          <dl className="review-details">
            <div>
              <dt>Tâche active</dt>
              <dd>{activeTask.title}</dd>
            </div>
            <div>
              <dt>Durée</dt>
              <dd>{activeTask.durationMinutes} minutes</dd>
            </div>
            <div>
              <dt>Objectif</dt>
              <dd>{activeTask.wordGoal ? `${activeTask.wordGoal} mots` : 'Écrire sans compter'}</dd>
            </div>
            <div>
              <dt>En attente</dt>
              <dd>{Math.max(0, tasks.length - 1)} tâche(s)</dd>
            </div>
          </dl>
          {activeTask.seed && (
            <blockquote>
              <span>Amorce</span>
              {activeTask.seed}
            </blockquote>
          )}
          <div className="review-actions">
            <KeyButton onClick={() => setShowReview(false)}>Ajuster</KeyButton>
            <KeyButton variant="primary" onClick={() => onLaunch(activeTask.id)}>
              Entrer dans la forge
            </KeyButton>
          </div>
          <p className="phase-note">Votre texte sera sauvegardé localement pendant le sprint.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="preparation-layout" aria-labelledby="preparation-title">
      <div className="preparation-main">
        <header className="preparation-heading">
          <div>
            <p className="eyebrow">
              Atelier du jour{activeProject ? ` · ${activeProject.name}` : ''}
            </p>
            <h1 id="preparation-title">Préparez vos pièces.</h1>
          </div>
          <p>
            {tasks.length}/{MAX_ACTIVE_TASKS} tâches
          </p>
        </header>

        <div className="task-stack">
          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              index={index}
              task={task}
              taskCount={tasks.length}
              updateState={updateState}
            />
          ))}
        </div>

        {tasks.length < MAX_ACTIVE_TASKS && (
          <form className="add-task-form paper-panel" onSubmit={handleAddTask}>
            <label htmlFor={newTaskId}>Quelle pièce voulez-vous produire&nbsp;?</label>
            <div className="add-task-row">
              <input
                id={newTaskId}
                autoFocus={tasks.length === 0}
                maxLength={MAX_TASK_TITLE_LENGTH}
                placeholder="Ex. Rédiger l’introduction en 300 mots"
                value={newTitle}
                onChange={(event) => {
                  setNewTitle(event.target.value);
                  setError(null);
                }}
              />
              <KeyButton variant="primary" type="submit">
                Ajouter
              </KeyButton>
            </div>
            <p className="form-help" data-error={Boolean(error)}>
              {error ?? getTaskGuidance(newTitle)}
            </p>
          </form>
        )}
      </div>

      <aside className="commitment-panel paper-panel" aria-label="Réglages du sprint">
        {activeTask ? (
          <>
            <div>
              <p className="eyebrow">Pièce active</p>
              <h2>{activeTask.title}</h2>
            </div>

            <fieldset>
              <legend>Temps de chauffe</legend>
              <div className="duration-keys">
                {SPRINT_DURATIONS.map((duration) => (
                  <KeyButton
                    key={duration}
                    active={activeTask.durationMinutes === duration}
                    onClick={() =>
                      updateState((currentState) =>
                        updateTask(
                          currentState,
                          activeTask.id,
                          { durationMinutes: duration },
                          new Date().toISOString(),
                        ),
                      )
                    }
                  >
                    {duration} min
                  </KeyButton>
                ))}
              </div>
              <label className="field-label" htmlFor="custom-duration">
                Ou une durée personnalisée
              </label>
              <input
                id="custom-duration"
                className="number-input"
                type="number"
                min="1"
                max="180"
                value={activeTask.durationMinutes}
                onChange={(event) =>
                  updateState((currentState) =>
                    updateTask(
                      currentState,
                      activeTask.id,
                      { durationMinutes: Math.min(180, Math.max(1, Number(event.target.value))) },
                      new Date().toISOString(),
                    ),
                  )
                }
              />
            </fieldset>

            <div className="field-group">
              <label htmlFor="word-goal">
                Objectif de mots <span>optionnel</span>
              </label>
              <input
                id="word-goal"
                className="number-input"
                type="number"
                min="1"
                max="10000"
                placeholder="Sans limite"
                value={activeTask.wordGoal ?? ''}
                onChange={(event) =>
                  updateState((currentState) =>
                    updateTask(
                      currentState,
                      activeTask.id,
                      { wordGoal: event.target.value ? Number(event.target.value) : null },
                      new Date().toISOString(),
                    ),
                  )
                }
              />
            </div>

            <div className="field-group">
              <label htmlFor="writing-seed">
                Amorce <span>optionnelle</span>
              </label>
              <textarea
                id="writing-seed"
                rows={4}
                placeholder="La première phrase, une idée, une question…"
                value={activeTask.seed}
                onChange={(event) =>
                  updateState((currentState) =>
                    updateTask(
                      currentState,
                      activeTask.id,
                      { seed: event.target.value },
                      new Date().toISOString(),
                    ),
                  )
                }
              />
            </div>

            <KeyButton
              className="review-button"
              variant="primary"
              onClick={() => setShowReview(true)}
            >
              Vérifier l’engagement
            </KeyButton>
          </>
        ) : (
          <div className="empty-settings">
            <span aria-hidden="true">⌁</span>
            <h2>Une tâche d’abord.</h2>
            <p>Ajoutez une pièce à forger pour régler votre première session.</p>
          </div>
        )}
      </aside>
    </section>
  );
}
