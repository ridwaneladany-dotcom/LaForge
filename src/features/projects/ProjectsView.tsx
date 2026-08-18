import { useId, useState, type FormEvent } from 'react';

import { KeyButton } from '../../components/KeyButton';
import type { AppState } from '../../domain/models';
import {
  createProject,
  getProjectSummaries,
  MAX_PROJECT_NAME_LENGTH,
  normalizeProjectName,
  renameProject,
  selectProject,
  validateProjectName,
  type ProjectSummary,
} from './projectState';

type ProjectsViewProps = {
  onOpenProject: () => void;
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatProjectDate(timestamp: string) {
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(timestamp));
}

function ProjectCard({
  active,
  onOpen,
  summary,
  updateState,
}: {
  active: boolean;
  onOpen: () => void;
  summary: ProjectSummary;
  updateState: ProjectsViewProps['updateState'];
}) {
  const [name, setName] = useState(summary.project.name);

  function saveName() {
    if (validateProjectName(name)) {
      setName(summary.project.name);
      return;
    }
    setName(normalizeProjectName(name));
    updateState((state) =>
      renameProject(state, summary.project.id, name, new Date().toISOString()),
    );
  }

  return (
    <article className="project-card paper-panel" data-active={active || undefined}>
      <div className="project-card-heading">
        <span>{active ? 'Projet actif' : 'Projet local'}</span>
        <span>Mis à jour le {formatProjectDate(summary.updatedAt)}</span>
      </div>
      <label className="visually-hidden" htmlFor={`project-${summary.project.id}`}>
        Nom du projet
      </label>
      <input
        id={`project-${summary.project.id}`}
        className="project-name-input"
        maxLength={MAX_PROJECT_NAME_LENGTH}
        value={name}
        onBlur={saveName}
        onChange={(event) => setName(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.currentTarget.blur();
          if (event.key === 'Escape') {
            setName(summary.project.name);
            event.currentTarget.blur();
          }
        }}
      />
      <dl className="project-stats">
        <div>
          <dt>Tâches ouvertes</dt>
          <dd>{summary.openTaskCount}</dd>
        </div>
        <div>
          <dt>Jets conservés</dt>
          <dd>{summary.draftCount}</dd>
        </div>
      </dl>
      <KeyButton
        variant={active ? 'primary' : 'default'}
        onClick={() => {
          updateState((state) => selectProject(state, summary.project.id));
          onOpen();
        }}
      >
        {active ? 'Reprendre ce projet' : 'Ouvrir l’atelier'}
      </KeyButton>
    </article>
  );
}

export function ProjectsView({ onOpenProject, state, updateState }: ProjectsViewProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const projectNameId = useId();
  const summaries = getProjectSummaries(state);

  function handleCreateProject(event: FormEvent) {
    event.preventDefault();
    const validationError = validateProjectName(name);
    if (validationError) {
      setError(validationError);
      return;
    }

    updateState((currentState) =>
      createProject(currentState, name, createId(), new Date().toISOString()),
    );
    setName('');
    setError(null);
  }

  return (
    <section className="projects-layout" aria-labelledby="projects-title">
      <header className="projects-heading">
        <div>
          <p className="eyebrow">Vos ateliers</p>
          <h1 id="projects-title" className="hero-title">
            Vos projets.
          </h1>
          <p className="hero-copy">
            Chaque projet garde sa propre file de trois tâches et l’historique de ses jets.
          </p>
        </div>

        <form className="project-create paper-panel" onSubmit={handleCreateProject}>
          <label htmlFor={projectNameId}>Nouveau projet</label>
          <input
            id={projectNameId}
            maxLength={MAX_PROJECT_NAME_LENGTH}
            placeholder="Ex. Mémoire de master"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError(null);
            }}
          />
          <p data-error={Boolean(error)}>{error ?? 'Un nom suffit. Vous pourrez le modifier.'}</p>
          <KeyButton variant="primary" type="submit">
            Créer le projet
          </KeyButton>
        </form>
      </header>

      {summaries.length > 0 ? (
        <div className="project-grid">
          {summaries.map((summary) => (
            <ProjectCard
              key={summary.project.id}
              active={summary.project.id === state.preferences.activeProjectId}
              onOpen={onOpenProject}
              summary={summary}
              updateState={updateState}
            />
          ))}
        </div>
      ) : (
        <div className="projects-empty paper-panel">
          <span aria-hidden="true">01</span>
          <h2>Votre premier atelier commence ici.</h2>
          <p>Créez un projet pour regrouper ses tâches, ses sprints et ses textes forgés.</p>
        </div>
      )}
    </section>
  );
}
