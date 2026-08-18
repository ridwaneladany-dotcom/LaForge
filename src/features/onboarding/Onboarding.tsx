import { useState } from 'react';

import forgeMark from '../../../assets/laforge-mark.svg';
import { KeyButton } from '../../components/KeyButton';

type OnboardingProps = {
  onComplete: () => void;
};

const STEPS = [
  {
    index: '01',
    eyebrow: 'Le principe',
    title: 'Un brouillon qui refuse de reculer.',
    body: 'Pendant un sprint, LaForge vous pousse vers l’avant. Vous écrivez sans corriger le passé, pour enfin produire de la matière.',
    note: 'Le texte se déverrouille entièrement à la fin.',
  },
  {
    index: '02',
    eyebrow: 'La préparation',
    title: 'Trois pièces. Jamais plus.',
    body: 'Transformez votre intention en une courte file de tâches concrètes, choisissez la première, puis fixez un temps de chauffe.',
    note: 'Moins de choix. Plus d’élan.',
  },
  {
    index: '03',
    eyebrow: 'Votre atelier',
    title: 'Vos mots restent chez vous.',
    body: 'Le MVP fonctionne sans compte. Vos tâches et vos textes sont conservés localement dans ce navigateur, sous votre contrôle.',
    note: 'LaForge encourage. Elle ne culpabilise jamais.',
  },
] as const;

export function Onboarding({ onComplete }: OnboardingProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;

  return (
    <main className="onboarding-shell">
      <header className="onboarding-header">
        <div className="brand" aria-label="LaForge">
          <img src={forgeMark} alt="" />
          <span>LaForge</span>
        </div>
        <button className="text-button" type="button" onClick={onComplete}>
          Passer l’introduction
        </button>
      </header>

      <section className="onboarding-stage" aria-labelledby="onboarding-title">
        <div className="onboarding-copy">
          <p className="eyebrow">{step.eyebrow}</p>
          <h1 id="onboarding-title">{step.title}</h1>
          <p className="onboarding-body">{step.body}</p>
        </div>

        <div className="onboarding-paper paper-panel" aria-live="polite">
          <span className="onboarding-index">{step.index}</span>
          <div className="type-sample" aria-hidden="true">
            {stepIndex === 0 && (
              <>
                <span>Chaque mot compte.</span>
                <span>Le suivant aussi.</span>
                <span className="type-caret" />
              </>
            )}
            {stepIndex === 1 && (
              <>
                <i>01</i>
                <i>02</i>
                <i>03</i>
              </>
            )}
            {stepIndex === 2 && (
              <>
                <span className="local-mark">LOCAL</span>
                <span>aucun compte requis</span>
              </>
            )}
          </div>
          <p>{step.note}</p>
        </div>
      </section>

      <footer className="onboarding-footer">
        <div className="step-dots" aria-label={`Étape ${stepIndex + 1} sur ${STEPS.length}`}>
          {STEPS.map((item, index) => (
            <span key={item.index} data-active={index === stepIndex || undefined} />
          ))}
        </div>
        <div className="onboarding-actions">
          {stepIndex > 0 && (
            <KeyButton onClick={() => setStepIndex((current) => current - 1)}>Retour</KeyButton>
          )}
          <KeyButton
            variant="primary"
            onClick={() => (isLastStep ? onComplete() : setStepIndex((current) => current + 1))}
          >
            {isLastStep ? 'Entrer dans l’atelier' : 'Continuer'}
          </KeyButton>
        </div>
      </footer>
    </main>
  );
}
