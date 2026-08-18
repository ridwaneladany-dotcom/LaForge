import { useEffect, useRef, useState } from 'react';

import { KeyButton } from '../../components/KeyButton';

type InstallChoice = {
  outcome: 'accepted' | 'dismissed';
  platform: string;
};

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<InstallChoice>;
}

let pendingInstallPrompt: BeforeInstallPromptEvent | null = null;
const promptListeners = new Set<(prompt: BeforeInstallPromptEvent | null) => void>();

function updateInstallPrompt(prompt: BeforeInstallPromptEvent | null) {
  pendingInstallPrompt = prompt;
  promptListeners.forEach((listener) => listener(prompt));
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    updateInstallPrompt(event as BeforeInstallPromptEvent);
  });
  window.addEventListener('appinstalled', () => updateInstallPrompt(null));
}

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function InstallAppButton() {
  const [installPrompt, setInstallPrompt] = useState(pendingInstallPrompt);
  const [showIosInstall, setShowIosInstall] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    promptListeners.add(setInstallPrompt);
    return () => void promptListeners.delete(setInstallPrompt);
  }, []);

  const canGuideIosInstall = isIos() && !isStandalone();

  if (!installPrompt && !canGuideIosInstall) return null;

  async function install() {
    if (installPrompt) {
      await installPrompt.prompt();
      await installPrompt.userChoice;
      updateInstallPrompt(null);
      return;
    }

    setShowIosInstall(true);
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
    setShowIosInstall(false);
  }

  return (
    <>
      <KeyButton className="install-key" onClick={() => void install()}>
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M10 2v10m0 0 4-4m-4 4L6 8M3 15v2h14v-2" />
        </svg>
        Installer
      </KeyButton>

      {canGuideIosInstall && (
        <dialog
          className="install-dialog paper-panel"
          ref={dialogRef}
          onClose={() => setShowIosInstall(false)}
          aria-labelledby="install-title"
        >
          {showIosInstall && (
            <>
              <p className="eyebrow">Sur iPhone ou iPad</p>
              <h2 id="install-title">Posez LaForge sur votre écran d’accueil.</h2>
              <ol>
                <li>Touchez le bouton Partager dans Safari.</li>
                <li>Choisissez « Sur l’écran d’accueil ».</li>
                <li>Confirmez avec « Ajouter ».</li>
              </ol>
              <KeyButton variant="primary" onClick={closeDialog}>
                Compris
              </KeyButton>
            </>
          )}
        </dialog>
      )}
    </>
  );
}
