const STORAGE_KEY = "laforge-phase-zero-prototype";

const taskCards = [...document.querySelectorAll(".task-card")];
const durationButtons = [...document.querySelectorAll("[data-duration]")];
const taskNames = taskCards.map((card) => card.querySelector(".task-name").textContent.trim());
const body = document.body;
const editor = document.querySelector("#editor");
const timer = document.querySelector("#timer");
const timerProgress = document.querySelector("#timer-progress");
const startButton = document.querySelector("#start-sprint");
const startButtonLabel = startButton.querySelector("span");
const sprintTaskName = document.querySelector("#sprint-task-name");
const exitDialog = document.querySelector("#exit-dialog");
const toast = document.querySelector("#toast");

let state = loadState();
let timerHandle = null;
let toastHandle = null;
let persistenceHandle = null;
let isComposing = false;

function defaultState() {
  return {
    view: "prepare",
    selectedTask: 0,
    duration: 15,
    draft: "",
    startedAt: null,
    endsAt: null,
    reviewing: false,
  };
}

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...defaultState(), ...stored };
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function scheduleStateSave() {
  clearTimeout(persistenceHandle);
  persistenceHandle = window.setTimeout(saveState, 220);
}

function flushState() {
  clearTimeout(persistenceHandle);
  saveState();
}

function setView(view) {
  state.view = view;
  body.dataset.view = view;
  saveState();

  if (view === "sprint") {
    requestAnimationFrame(() => {
      placeCaretAtEnd(editor);
      editor.focus({ preventScroll: true });
    });
  }
}

function updateControls() {
  taskCards.forEach((card, index) => {
    const selected = index === state.selectedTask;
    card.classList.toggle("selected", selected);
    card.setAttribute("aria-checked", String(selected));
  });

  durationButtons.forEach((button) => {
    const selected = Number(button.dataset.duration) === state.duration;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-checked", String(selected));
  });

  startButtonLabel.textContent = `Forger ${state.duration} min`;
  sprintTaskName.textContent = taskNames[state.selectedTask];
  editor.textContent = state.draft;
  updateResult();
}

function startSprint() {
  const now = Date.now();
  state.startedAt = now;
  state.endsAt = now + state.duration * 60 * 1000;
  state.draft = "";
  state.reviewing = false;
  editor.textContent = "";
  enableForwardOnly();
  updateWritingMode();
  setView("sprint");
  startTimer();
}

function startTimer() {
  clearInterval(timerHandle);
  updateTimer();
  timerHandle = window.setInterval(updateTimer, 1000);
}

function updateTimer() {
  if (!state.endsAt) return;

  const remaining = Math.max(0, state.endsAt - Date.now());
  const total = state.duration * 60 * 1000;
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  timer.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  timerProgress.style.setProperty("--timer-progress", String(remaining / total));

  if (remaining <= 0) {
    finishSprint();
  }
}

function finishSprint() {
  clearInterval(timerHandle);
  state.draft = editor.textContent.trim();
  state.reviewing = false;
  updateResult();
  setView("result");
  document.querySelector("#result-title").focus?.();
}

function stopAndKeep() {
  state.draft = editor.textContent.trim();
  state.endsAt = null;
  state.startedAt = null;
  state.reviewing = false;
  clearInterval(timerHandle);
  exitDialog.close();
  setView("prepare");
  showToast("Jet interrompu · texte conservé");
}

function updateResult() {
  const words = countWords(state.draft);
  const elapsed = state.startedAt
    ? Math.max(1, Math.min(state.duration, Math.round((Date.now() - state.startedAt) / 60000)))
    : state.duration;

  document.querySelector("#result-words").textContent = String(words);
  document.querySelector("#result-minutes").textContent = String(elapsed);
}

function countWords(value) {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/u).length : 0;
}

function placeCaretAtEnd(element) {
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function selectionIsAtEnd() {
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount || !selection.isCollapsed) return false;

  const activeRange = selection.getRangeAt(0);
  if (activeRange.endContainer !== editor && !editor.contains(activeRange.endContainer)) return false;

  const contentAfterCaret = activeRange.cloneRange();
  contentAfterCaret.selectNodeContents(editor);
  contentAfterCaret.setStart(activeRange.endContainer, activeRange.endOffset);
  return contentAfterCaret.toString().length === 0;
}

function keepWritingForward(event) {
  if (isComposing || event.isComposing || event.inputType === "insertCompositionText") return;

  const isDeletion = event.inputType.startsWith("delete");
  const isHistory = event.inputType === "historyUndo" || event.inputType === "historyRedo";
  const isInsertionAwayFromEnd = event.inputType.startsWith("insert") && !selectionIsAtEnd();

  if (isDeletion || isHistory || isInsertionAwayFromEnd) {
    event.preventDefault();
    placeCaretAtEnd(editor);
    showToast(isDeletion || isHistory ? "Tu pourras corriger à la fin" : "Continue depuis la fin du texte");
  }
}

function handleEditorKeydown(event) {
  const blockedKeys = new Set([
    "ArrowLeft",
    "ArrowUp",
    "Home",
    "PageUp",
    "Backspace",
    "Delete",
  ]);

  const editingShortcut =
    (event.ctrlKey || event.metaKey) && ["a", "z", "y"].includes(event.key.toLowerCase());
  if (blockedKeys.has(event.key) || editingShortcut) {
    event.preventDefault();
    placeCaretAtEnd(editor);
    showToast("Tu pourras corriger à la fin");
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastHandle);
  toastHandle = window.setTimeout(() => toast.classList.remove("visible"), 1600);
}

function enableForwardOnly() {
  editor.addEventListener("beforeinput", keepWritingForward);
  editor.addEventListener("keydown", handleEditorKeydown);
}

function disableForwardOnly() {
  editor.removeEventListener("beforeinput", keepWritingForward);
  editor.removeEventListener("keydown", handleEditorKeydown);
}

function updateWritingMode() {
  const modeLabel = document.querySelector("#sprint-mode-label");
  const heading = document.querySelector("#writing-heading");
  const lockCopy = document.querySelector("#lock-copy");

  if (state.reviewing) {
    modeLabel.textContent = "Révision · édition libre";
    heading.innerHTML = "Façonne maintenant<br />la matière obtenue.";
    lockCopy.textContent = "Le texte est entièrement déverrouillé";
    editor.setAttribute("aria-label", "Zone de révision du texte déverrouillé");
  } else {
    modeLabel.textContent = "Premier jet · vers l'avant";
    heading.innerHTML = "Écris la première version.<br />Tu la façonneras ensuite.";
    lockCopy.textContent = "Les retours en arrière sont verrouillés";
    editor.setAttribute("aria-label", "Zone d'écriture du sprint, uniquement vers l'avant");
  }
}

function resetPrototype() {
  clearInterval(timerHandle);
  state = defaultState();
  localStorage.removeItem(STORAGE_KEY);
  updateControls();
  setView("prepare");
  showToast("Prototype réinitialisé");
}

taskCards.forEach((card, index) => {
  card.addEventListener("click", () => {
    state.selectedTask = index;
    updateControls();
    saveState();
  });
});

durationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.duration = Number(button.dataset.duration);
    updateControls();
    saveState();
  });
});

startButton.addEventListener("click", startSprint);
document.querySelector("#open-exit").addEventListener("click", () => exitDialog.showModal());
document.querySelector("#confirm-exit").addEventListener("click", stopAndKeep);
document.querySelector("#finish-demo").addEventListener("click", finishSprint);
document.querySelector("#reset-prototype").addEventListener("click", resetPrototype);
document.querySelector("#review-text").addEventListener("click", () => {
  state.reviewing = true;
  state.endsAt = null;
  setView("sprint");
  clearInterval(timerHandle);
  timer.textContent = "Libre";
  timerProgress.style.setProperty("--timer-progress", "1");
  disableForwardOnly();
  updateWritingMode();
  showToast("Mode révision · texte déverrouillé");
});
document.querySelector("#next-task").addEventListener("click", () => {
  state.selectedTask = Math.min(state.selectedTask + 1, taskCards.length - 1);
  state.draft = "";
  state.startedAt = null;
  state.endsAt = null;
  state.reviewing = false;
  updateControls();
  setView("prepare");
});

enableForwardOnly();
editor.addEventListener("input", () => {
  state.draft = editor.textContent;
  scheduleStateSave();
});
editor.addEventListener("click", () => {
  if (!selectionIsAtEnd()) placeCaretAtEnd(editor);
});
editor.addEventListener("compositionstart", () => {
  isComposing = true;
});
editor.addEventListener("compositionend", () => {
  isComposing = false;
  state.draft = editor.textContent;
  scheduleStateSave();
  placeCaretAtEnd(editor);
});

window.addEventListener("beforeunload", flushState);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") flushState();
});

window.addEventListener("storage", () => {
  state = loadState();
  updateControls();
  setView(state.view);
});

if (state.view === "sprint" && state.endsAt && state.endsAt <= Date.now()) {
  state.view = "result";
}

body.dataset.view = state.view;
updateControls();
updateWritingMode();

if (state.reviewing) {
  disableForwardOnly();
  timer.textContent = "Libre";
  timerProgress.style.setProperty("--timer-progress", "1");
}

if (state.view === "sprint" && state.endsAt) {
  startTimer();
}
