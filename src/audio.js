// Piano-like tones synthesized with the Web Audio API (no sample files).
//
// Each note is one oscillator using a custom waveform (fundamental plus a few
// decaying harmonics) shaped by a gain envelope: fast attack, slow decay while
// the key is held, and a short release when it is let go.

// Relative strengths of harmonics 1..6 — gives a soft, piano-ish timbre.
const HARMONICS = [1, 0.5, 0.25, 0.14, 0.07, 0.03];

const PEAK = 0.35; // per-note level; the compressor handles chords
const ATTACK = 0.008; // seconds
const DECAY = 5; // seconds for a held note to fade to silence
const RELEASE = 0.3; // seconds
const SILENCE = 0.0001;

/**
 * @param {BaseAudioContext} [context] injectable for tests; defaults to a new AudioContext
 */
export function createSynth(context) {
  let ctx = context ?? null;
  let master = null;
  let wave = null;
  const voices = new Map(); // note id -> { osc, gain }

  // Created lazily: browsers only allow audio to start after a user gesture.
  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  function setup() {
    init();
    if (master) return;
    // Soft limiter so several held notes don't clip.
    const compressor = ctx.createDynamicsCompressor();
    master = ctx.createGain();
    master.gain.value = 0.8;
    master.connect(compressor).connect(ctx.destination);

    const real = new Float32Array(HARMONICS.length + 1); // cosine terms stay 0
    const imag = new Float32Array([0, ...HARMONICS]);
    wave = ctx.createPeriodicWave(real, imag);
  }

  /** Start a note. Call from a user gesture so the audio context may run. */
  function noteOn(note) {
    setup();
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    stopVoice(note.id, 0.02); // restarting a note cuts the previous one quickly

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.setPeriodicWave(wave);
    osc.frequency.value = note.frequency;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(SILENCE, now);
    gain.gain.exponentialRampToValueAtTime(PEAK, now + ATTACK);
    gain.gain.exponentialRampToValueAtTime(SILENCE, now + ATTACK + DECAY);

    osc.connect(gain).connect(master);
    osc.start(now);
    voices.set(note.id, { osc, gain });
  }

  /** Let a note go: fade it out quickly and free its nodes. */
  function noteOff(note) {
    stopVoice(note.id, RELEASE);
  }

  function stopVoice(id, release) {
    const voice = voices.get(id);
    if (!voice) return;
    voices.delete(id);
    const { osc, gain } = voice;
    const now = ctx.currentTime;
    const g = gain.gain;
    // Freeze the envelope at its current level, then fade from there.
    if (typeof g.cancelAndHoldAtTime === 'function') {
      g.cancelAndHoldAtTime(now);
    } else {
      const level = Math.max(g.value, SILENCE);
      g.cancelScheduledValues(now);
      g.setValueAtTime(level, now);
    }
    g.exponentialRampToValueAtTime(SILENCE, now + release);
    osc.stop(now + release + 0.05);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }

  return { noteOn, noteOff };
}
