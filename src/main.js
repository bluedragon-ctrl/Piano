// App entry point: builds the keyboard and plays notes as keys are pressed.
import { buildNotes } from './notes.js';
import { createKeyboard } from './keyboard.js';
import { createSynth } from './audio.js';
import { loadPiano, createPlayer } from './piano.js';

const notes = buildNotes(4, 5);
const status = document.getElementById('status');
const soundStatus = document.getElementById('sound-status');
const held = new Set();

// One shared audio context. The browser keeps it suspended until the first
// touch/click, which audio.js resumes.
const context = new (window.AudioContext || window.webkitAudioContext)();
const synth = createSynth(context);
const piano = loadPiano(context, notes, {
  onProgress: ({ loaded, total }) => {
    soundStatus.textContent = `Loading piano sound… ${Math.round((loaded / total) * 100)}%`;
  },
});
const player = createPlayer(synth, piano);

soundStatus.textContent = 'Loading piano sound…';
piano.ready.then((ok) => {
  soundStatus.textContent = ok ? 'Grand piano ready' : 'Using basic synth sound (piano samples unavailable)';
});

function showHeld() {
  status.textContent = held.size ? `Playing: ${[...held].join(' ')}` : 'Click a key';
}

createKeyboard(document.getElementById('piano'), notes, {
  onNoteOn: (note) => {
    held.add(note.id);
    player.noteOn(note);
    showHeld();
  },
  onNoteOff: (note) => {
    held.delete(note.id);
    player.noteOff(note);
    showHeld();
  },
});

// iOS Safari unlocks audio only at the end of a touch, not at its start.
window.addEventListener('pointerup', () => player.unlock());

showHeld();
