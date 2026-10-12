// App entry point: builds the keyboard and plays notes as keys are pressed.
import { buildNotes } from './notes.js';
import { createKeyboard } from './keyboard.js';
import { createSynth } from './audio.js';

const status = document.getElementById('status');
const synth = createSynth();
const held = new Set();

function showHeld() {
  status.textContent = held.size ? `Playing: ${[...held].join(' ')}` : 'Click a key';
}

createKeyboard(document.getElementById('piano'), buildNotes(4, 5), {
  onNoteOn: (note) => {
    held.add(note.id);
    synth.noteOn(note);
    showHeld();
  },
  onNoteOff: (note) => {
    held.delete(note.id);
    synth.noteOff(note);
    showHeld();
  },
});

// iOS Safari unlocks audio only at the end of a touch, not at its start.
window.addEventListener('pointerup', () => synth.unlock());

showHeld();
