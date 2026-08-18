type AudioContextConstructor = typeof AudioContext;

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (audioContext) return audioContext;

  const AudioContextClass =
    (window as typeof window & { webkitAudioContext?: AudioContextConstructor }).AudioContext ??
    (window as typeof window & { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext;

  if (!AudioContextClass) return null;
  try {
    audioContext = new AudioContextClass();
  } catch {
    return null;
  }
  return audioContext;
}

export async function unlockClockAudio(): Promise<void> {
  const context = getAudioContext();
  if (context?.state === 'suspended') {
    try {
      await context.resume();
    } catch {
      // Le contrôle visuel reste utilisable si le navigateur refuse l'audio.
    }
  }
}

function strike(frequency: number, volume: number, duration: number) {
  const context = getAudioContext();
  if (!context || context.state !== 'running') return;

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.72, now + duration);
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + duration);
}

export function playClockTick(isTock: boolean): void {
  strike(isTock ? 1_120 : 1_420, 0.018, 0.038);
}

export function startTimeUpAlarm(): () => void {
  let stopped = false;

  const ring = () => {
    if (stopped) return;
    strike(880, 0.028, 0.18);
    window.setTimeout(() => {
      if (!stopped) strike(1_120, 0.024, 0.16);
    }, 110);
  };

  ring();
  const interval = window.setInterval(ring, 620);

  return () => {
    stopped = true;
    window.clearInterval(interval);
  };
}
