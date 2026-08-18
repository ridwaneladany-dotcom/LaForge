import { useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react';

import { KeyButton } from '../../components/KeyButton';
import { APP_STORAGE_KEY } from '../../data/localStore';
import { createInitialState, type AppState } from '../../domain/models';
import { ProgressPanel } from '../engagement/ProgressPanel';
import {
  downloadBackup,
  downloadProject,
  importTextIntoProject,
  type TextExportFormat,
} from './projectFiles';
import {
  createProject,
  getActiveProject,
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
  onExport,
  summary,
  updateState,
}: {
  active: boolean;
  onOpen: () => void;
  onExport: (format: TextExportFormat) => void;
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
      <div className="project-card-actions">
        <KeyButton
          variant={active ? 'primary' : 'default'}
          onClick={() => {
            updateState((state) => selectProject(state, summary.project.id));
            onOpen();
          }}
        >
          {active ? 'Reprendre ce projet' : 'Ouvrir l’atelier'}
        </KeyButton>
        <div aria-label={`Exporter ${summary.project.name}`}>
          <button type="button" onClick={() => onExport('text')}>
            TXT
          </button>
          <button type="button" onClick={() => onExport('markdown')}>
            MD
          </button>
        </div>
      </div>
    </article>
  );
}

export function ProjectsView({ onOpenProject, state, updateState }: ProjectsViewProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const projectNameId = useId();
  const importInputRef = useRef<HTMLInputElement>(null);
  const summaries = getProjectSummaries(state);
  const activeProject = getActiveProject(state);

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

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !activeProject) return;
    if (file.size > 2_000_000) {
      setImportStatus('Ce fichier dépasse la limite locale de 2 Mo.');
      return;
    }

    const content = await file.text();
    if (!content.trim()) {
      setImportStatus('Ce fichier ne contient aucun texte à importer.');
      return;
    }

    updateState((currentState) =>
      importTextIntoProject(
        currentState,
        activeProject.id,
        file.name,
        content,
        createId(),
        new Date().toISOString(),
      ),
    );
    setImportStatus(`« ${file.name} » est conservé dans ${activeProject.name}.`);
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
              onExport={(format) => downloadProject(state, summary.project, format)}
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

      <ProgressPanel practice={state.practice} />

      <section className="project-tools" aria-labelledby="project-tools-title">
        <div>
          <p className="eyebrow">Fichiers locaux</p>
          <h2 id="project-tools-title">Emportez votre matière.</h2>
          <p>
            Les imports et exports restent sur cet appareil. Aucun texte n’est envoyé à LaForge.
          </p>
        </div>
        <div className="project-tool-actions">
          <input
            ref={importInputRef}
            hidden
            type="file"
            accept=".txt,.md,.markdown,text/plain,text/markdown"
            onChange={(event) => void handleImport(event)}
          />
          <KeyButton disabled={!activeProject} onClick={() => importInputRef.current?.click()}>
            Importer dans le projet actif
          </KeyButton>
          <KeyButton onClick={() => downloadBackup(state)}>
            Sauvegarder toutes les données
          </KeyButton>
          <p className="import-status" role="status" aria-live="polite">
            {importStatus}
          </p>
        </div>
      </section>

      <section className="data-vault paper-panel" aria-labelledby="data-vault-title">
        <div>
          <p className="eyebrow">Maîtrise des données</p>
          <h2 id="data-vault-title">Vos textes restent les vôtres.</h2>
          <p>
            La sauvegarde JSON contient projets, tâches, jets et préférences. La suppression efface
            tout le contenu LaForge de ce navigateur.
          </p>
        </div>
        {confirmDelete ? (
          <div className="delete-confirm" role="alert">
            <strong>Cette action est définitive sur cet appareil.</strong>
            <div>
              <KeyButton onClick={() => setConfirmDelete(false)}>Conserver mes données</KeyButton>
              <KeyButton
                variant="primary"
                onClick={() => {
                  window.localStorage.removeItem(APP_STORAGE_KEY);
                  updateState(() => createInitialState());
                }}
              >
                Effacer définitivement
              </KeyButton>
            </div>
          </div>
        ) : (
          <button
            className="delete-data-button"
            type="button"
            onClick={() => setConfirmDelete(true)}
          >
            Supprimer toutes les données
          </button>
        )}
      </section>
    </section>
  );
}
