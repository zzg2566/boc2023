type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

export function createSummerPondMusic() {
  let context: AudioContext | null = null;
  let master: GainNode | null = null;
  let timer: number | null = null;
  let step = 0;
  let running = false;

  const notes = [261.63, 329.63, 392, 440, 392, 329.63, 293.66, 261.63, 220, 261.63, 329.63, 293.66];

  const tone = (frequency: number, when: number, duration: number, volume: number) => {
    if (!context || !master) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, when);
    filter.type = "lowpass";
    filter.frequency.value = 1500;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(volume, when + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    oscillator.connect(filter).connect(gain).connect(master);
    oscillator.start(when);
    oscillator.stop(when + duration + 0.05);
  };

  const cicada = (when: number) => {
    if (!context || !master) return;
    for (let index = 0; index < 5; index += 1) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = when + index * 0.075;
      oscillator.type = "triangle";
      oscillator.frequency.value = 3900 + index * 90;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.0025, start + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.055);
      oscillator.connect(gain).connect(master);
      oscillator.start(start);
      oscillator.stop(start + 0.06);
    }
  };

  const schedule = () => {
    if (!context || !running) return;
    const now = context.currentTime + 0.06;
    tone(notes[step % notes.length], now, 1.5, 0.026);
    if (step % 4 === 0) tone(notes[(step + 5) % notes.length] / 2, now, 2.2, 0.012);
    if (step % 16 === 11) cicada(now + 0.9);
    step += 1;
  };

  const start = async () => {
    if (running) return true;
    const AudioContextClass = window.AudioContext || (window as WebkitWindow).webkitAudioContext;
    if (!AudioContextClass) return false;
    context ||= new AudioContextClass();
    if (context.state === "suspended") await context.resume();
    master ||= context.createGain();
    master.disconnect();
    master.connect(context.destination);
    master.gain.cancelScheduledValues(context.currentTime);
    master.gain.setValueAtTime(0.0001, context.currentTime);
    master.gain.exponentialRampToValueAtTime(0.55, context.currentTime + 1.2);
    running = true;
    schedule();
    timer = window.setInterval(schedule, 900);
    return true;
  };

  const pause = () => {
    if (!running) return;
    running = false;
    if (timer !== null) window.clearInterval(timer);
    timer = null;
    if (context && master) {
      master.gain.cancelScheduledValues(context.currentTime);
      master.gain.setTargetAtTime(0.0001, context.currentTime, 0.15);
    }
  };

  const destroy = () => {
    pause();
    void context?.close();
    context = null;
    master = null;
  };

  return { start, pause, destroy, get isRunning() { return running; } };
}
