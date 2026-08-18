type TimeUpOverlayProps = {
  soundEnabled: boolean;
};

export function TimeUpOverlay({ soundEnabled }: TimeUpOverlayProps) {
  return (
    <div
      className="time-up-overlay"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="time-up-title"
    >
      <div className="time-up-copy">
        <p className="eyebrow">Sprint terminé</p>
        <h2 id="time-up-title">Le temps est écoulé.</h2>
        <p>Votre jet est en sécurité. La forge s’ouvre dans un instant.</p>
      </div>

      <div className="alarm-clock" aria-hidden="true">
        <svg viewBox="0 0 260 230" role="img">
          <path
            className="alarm-clock__bell"
            d="M42 69C42 39 65 18 94 20L92 33C71 32 55 47 55 68Z"
          />
          <path
            className="alarm-clock__bell"
            d="M218 69C218 39 195 18 166 20L168 33C189 32 205 47 205 68Z"
          />
          <path d="M74 185 55 214M186 185l19 29" />
          <circle cx="130" cy="124" r="78" />
          <circle className="alarm-clock__face" cx="130" cy="124" r="64" />
          <path d="M130 77v47l32 19" />
          <circle cx="130" cy="124" r="5" />
          <path d="M130 46V32M113 30h34" />
        </svg>
        <span>00:00</span>
      </div>

      <p className="time-up-sound-state">
        {soundEnabled ? 'Sonnerie douce en cours' : 'Fin silencieuse'}
      </p>
      <div className="time-up-progress" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
