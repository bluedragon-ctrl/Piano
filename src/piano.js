// Sampled grand piano via the smplr library, with the synth from audio.js as a
// fallback while samples load (or if they cannot be loaded at all).

// smplr and the samples are vendored in the repo, so the site makes no
// third-party requests. Ogg only: Chrome, Edge and Firefox play it natively.
const SMPLR_URL = new URL('../vendor/smplr/index.mjs', import.meta.url).href;
const SAMPLES_URL = new URL('../assets/piano', import.meta.url).href;

// How long a released key takes to fade out, in seconds.
const RELEASE = 0.3;

// Every key is played at this velocity, so only the samples covering it are
// fetched (the piano has 4 velocity layers).
const VELOCITY = 100;

/**
 * Start loading the piano samples for the given notes.
 * @param {BaseAudioContext} context
 * @param {{midi: number}[]} notes only these notes' samples are fetched
 * @param {{onProgress?: (p: {loaded: number, total: number}) => void, destination?: AudioNode}} [options]
 *   destination is where the sound goes (default: the context output)
 * @returns {{ready: Promise<boolean>, isReady: () => boolean, noteOn: Function, noteOff: Function}}
 *   `ready` resolves to true when playable, false if loading failed.
 */
export function loadPiano(context, notes, { onProgress, destination } = {}) {
  let piano = null;

  const ready = import(SMPLR_URL)
    .then(async ({ SplendidGrandPiano }) => {
      const instrument = SplendidGrandPiano(context, {
        baseUrl: SAMPLES_URL,
        formats: ['ogg'],
        decayTime: RELEASE,
        velocity: VELOCITY,
        notesToLoad: { notes: notes.map((n) => n.midi), velocityRange: [VELOCITY, VELOCITY] },
        onLoadProgress: onProgress,
        destination,
      });
      await instrument.ready;
      piano = instrument;
      return true;
    })
    .catch((err) => {
      console.warn('Piano samples could not be loaded; using the built-in synth.', err);
      return false;
    });

  return {
    ready,
    isReady: () => piano !== null,
    // stopId lets noteOff release exactly this note.
    noteOn: (note) => piano.start({ note: note.midi, velocity: VELOCITY, stopId: note.id }),
    noteOff: (note) => piano.stop(note.id),
  };
}

/**
 * Route notes to the sampled piano once it is loaded, otherwise to the synth.
 * A note is released on the engine that started it, even if the piano finished
 * loading while the key was held.
 */
export function createPlayer(synth, piano) {
  const engineById = new Map(); // note id -> engine that is sounding it

  return {
    noteOn(note) {
      const engine = piano.isReady() ? piano : synth;
      engineById.set(note.id, engine);
      engine.noteOn(note);
    },
    noteOff(note) {
      const engine = engineById.get(note.id);
      if (!engine) return;
      engineById.delete(note.id);
      engine.noteOff(note);
    },
    unlock: () => synth.unlock(),
  };
}
