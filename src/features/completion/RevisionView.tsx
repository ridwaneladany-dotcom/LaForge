import { useEffect, useRef, useState, type FormEvent } from 'react';

import { KeyButton } from '../../components/KeyButton';
import type { SaveStatus } from '../../app/usePersistentAppState';
import type { WritingDraft, WritingTask } from '../../domain/models';
import { downloadDraft } from '../projects/projectFiles';
import { countWords } from '../sprint/wordCount';

type RevisionViewProps = {
  draft: WritingDraft;
  onBack: () => void;
  onCompleteTask: () => void;
  onContentChange: (content: string) => void;
  saveStatus: SaveStatus;
  task: WritingTask;
};

export function RevisionView({
  draft,
  onBack,
  onCompleteTask,
  onContentChange,
  saveStatus: persistenceStatus,
  task,
}: RevisionViewProps) {
  const contentRef = useRef(draft.content);
  const onContentChangeRef = useRef(onContentChange);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [wordCount, setWordCount] = useState(() => countWords(draft.content));
  const [markerCount, setMarkerCount] = useState(
    () => draft.content.match(/\[À REVOIR\]/gu)?.length ?? 0,
  );
  const [editSaveStatus, setEditSaveStatus] = useState<'saved' | 'saving'>('saved');

  useEffect(() => {
    onContentChangeRef.current = onContentChange;
  });

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      onContentChangeRef.current(contentRef.current);
    },
    [],
  );

  function handleInput(event: FormEvent<HTMLTextAreaElement>) {
    const content = event.currentTarget.value;
    contentRef.current = content;
    setWordCount(countWords(content));
    setMarkerCount(content.match(/\[À REVOIR\]/gu)?.length ?? 0);
    setEditSaveStatus('saving');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onContentChangeRef.current(content);
      setEditSaveStatus('saved');
    }, 300);
  }

  return (
    <main className="revision-screen">
      <header className="revision-header">
        <button className="revision-back" type="button" onClick={onBack}>
          ← Bilan
        </button>
        <div>
          <span>Révision libre</span>
          <strong>{task.title}</strong>
        </div>
        <KeyButton variant="primary" onClick={onCompleteTask}>
          Valider la tâche
        </KeyButton>
      </header>

      <section className="revision-desk" aria-label="Révision du jet">
        <div className="revision-note">
          <div>
            <span>Original préservé</span>
            <p>Vous pouvez maintenant déplacer, supprimer et réécrire librement.</p>
          </div>
          <div className="revision-export" aria-label="Exporter cette révision">
            <button type="button" onClick={() => downloadDraft(task, draft, 'text')}>
              TXT
            </button>
            <button type="button" onClick={() => downloadDraft(task, draft, 'markdown')}>
              MD
            </button>
          </div>
        </div>
        <textarea
          className="revision-editor"
          aria-label="Zone de révision libre"
          defaultValue={draft.content}
          onInput={handleInput}
          spellCheck
        />
        <footer className="revision-status">
          <span>{wordCount} mots</span>
          <span>
            {markerCount > 0 ? `${markerCount} marqueur(s) à revoir` : 'aucun marqueur restant'}
          </span>
          <span aria-live="polite">
            {persistenceStatus === 'error'
              ? 'sauvegarde impossible'
              : editSaveStatus === 'saving' || persistenceStatus === 'saving'
                ? 'sauvegarde…'
                : 'enregistré localement'}
          </span>
        </footer>
      </section>
    </main>
  );
}
