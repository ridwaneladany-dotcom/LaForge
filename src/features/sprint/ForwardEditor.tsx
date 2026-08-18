import {
  useEffect,
  useRef,
  useState,
  type CompositionEvent,
  type FormEvent,
  type KeyboardEvent,
  type SyntheticEvent,
} from 'react';

import { countWords } from './wordCount';

type ForwardEditorProps = {
  initialContent: string;
  onContentChange: (content: string) => void;
  onWordCountChange: (wordCount: number) => void;
};

const BLOCKED_KEYS = new Set(['ArrowLeft', 'ArrowUp', 'Backspace', 'Delete', 'Home', 'PageUp']);

export function ForwardEditor({
  initialContent,
  onContentChange,
  onWordCountChange,
}: ForwardEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const composingRef = useRef(false);
  const contentRef = useRef(initialContent);
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onContentChangeRef = useRef(onContentChange);
  const onWordCountChangeRef = useRef(onWordCountChange);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    onContentChangeRef.current = onContentChange;
    onWordCountChangeRef.current = onWordCountChange;
  });

  function moveCaretToEnd() {
    const editor = editorRef.current;
    if (!editor) return;
    const end = editor.value.length;
    editor.setSelectionRange(end, end);
  }

  function schedulePersistence(content: string) {
    contentRef.current = content;
    onWordCountChangeRef.current(countWords(content));
    if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
    persistTimerRef.current = setTimeout(() => onContentChangeRef.current(content), 250);
    requestAnimationFrame(updateOverflowState);
  }

  function updateOverflowState() {
    const editor = editorRef.current;
    const wrap = wrapRef.current;
    if (!editor || !wrap) return;
    wrap.toggleAttribute('data-overflowing', editor.scrollHeight > editor.clientHeight + 4);
  }

  useEffect(() => {
    editorRef.current?.focus();
    updateOverflowState();

    return () => {
      if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
      onContentChangeRef.current(contentRef.current);
    };
  }, []);

  function handleBeforeInput(event: FormEvent<HTMLTextAreaElement>) {
    if (composingRef.current) return;
    const inputType = (event.nativeEvent as InputEvent).inputType;
    if (inputType.startsWith('delete') || inputType.startsWith('history')) {
      event.preventDefault();
      setAnnouncement('Dans ce sprint, on avance sans effacer.');
      return;
    }

    moveCaretToEnd();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    const usesModifier = event.ctrlKey || event.metaKey;
    if (
      BLOCKED_KEYS.has(event.key) ||
      (usesModifier && ['a', 'x', 'z'].includes(event.key.toLowerCase()))
    ) {
      event.preventDefault();
      moveCaretToEnd();
      setAnnouncement('Le curseur reste au bout du texte jusqu’à la fin du sprint.');
    }
  }

  function handleSelect(event: SyntheticEvent<HTMLTextAreaElement>) {
    if (composingRef.current) return;
    const editor = event.currentTarget;
    if (
      editor.selectionStart !== editor.value.length ||
      editor.selectionEnd !== editor.value.length
    ) {
      requestAnimationFrame(moveCaretToEnd);
    }
  }

  function handleCompositionStart() {
    moveCaretToEnd();
    composingRef.current = true;
  }

  function handleCompositionEnd(event: CompositionEvent<HTMLTextAreaElement>) {
    composingRef.current = false;
    schedulePersistence(event.currentTarget.value);
    moveCaretToEnd();
  }

  function handleInput(event: FormEvent<HTMLTextAreaElement>) {
    schedulePersistence(event.currentTarget.value);
  }

  function addMarker() {
    const editor = editorRef.current;
    if (!editor) return;
    const separator = editor.value && !editor.value.endsWith(' ') ? ' ' : '';
    editor.value = `${editor.value}${separator}[À REVOIR] `;
    schedulePersistence(editor.value);
    moveCaretToEnd();
    editor.focus();
  }

  return (
    <div ref={wrapRef} className="editor-wrap">
      <textarea
        ref={editorRef}
        className="forward-editor"
        defaultValue={initialContent}
        aria-label="Zone d’écriture du sprint"
        autoCapitalize="sentences"
        autoCorrect="on"
        onBeforeInput={handleBeforeInput}
        onCompositionEnd={handleCompositionEnd}
        onCompositionStart={handleCompositionStart}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onSelect={handleSelect}
        placeholder="Frappez la première phrase…"
        spellCheck
      />
      <button className="marker-key" type="button" onClick={addMarker}>
        <kbd>⌘</kbd> Marquer [À REVOIR]
      </button>
      <p className="visually-hidden" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
