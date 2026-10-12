// App entry point: builds the keyboard. Sound is added in a later PR.
import { buildNotes } from './notes.js';
import { createKeyboard } from './keyboard.js';

const status = document.getElementById('status');
const held = new Set();

function showHeld() {
  status.textContent = held.size ? `Playing: ${[...held].join(' ')}` : 'Click a key';
}

createKeyboard(document.getElementById('piano'), buildNotes(4, 5), {
  onNoteOn: (note) => {
    held.add(note.id);
    showHeld();
  },
  onNoteOff: (note) => {
    held.delete(note.id);
    showHeld();
  },
});

showHeld();
