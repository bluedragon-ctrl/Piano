// Renders the piano keyboard and turns pointer input (mouse and touch) into
// note-on / note-off callbacks. Dragging across keys with the button held
// (or a finger down) slides from key to key.

/**
 * @param {HTMLElement} container element to render into
 * @param {ReturnType<import('./notes.js').buildNotes>} notes
 * @param {{onNoteOn?: (note: object) => void, onNoteOff?: (note: object) => void}} handlers
 */
export function createKeyboard(container, notes, { onNoteOn = () => {}, onNoteOff = () => {} } = {}) {
  container.classList.add('keyboard');
  container.style.setProperty('--white-count', notes.filter((n) => !n.black).length);

  const keyById = new Map(); // note id -> { el, note }
  let whiteIndex = 0;
  for (const note of notes) {
    const el = document.createElement('div');
    el.className = `key ${note.black ? 'black' : 'white'}`;
    el.dataset.note = note.id;
    el.setAttribute('aria-label', note.id);
    if (note.black) {
      // Centered on the boundary before the next white key.
      el.style.setProperty('--pos', whiteIndex);
    } else {
      const label = document.createElement('span');
      label.className = 'label';
      label.textContent = note.name === 'C' ? note.id : note.name;
      el.append(label);
      whiteIndex++;
    }
    container.append(el);
    keyById.set(note.id, { el, note });
  }

  const pointers = new Map(); // pointerId -> note id held (or null between keys)
  const holds = new Map(); // note id -> number of pointers holding it

  function press(id) {
    const count = holds.get(id) ?? 0;
    holds.set(id, count + 1);
    if (count === 0) {
      const { el, note } = keyById.get(id);
      el.classList.add('pressed');
      onNoteOn(note);
    }
  }

  function release(id) {
    const count = holds.get(id) ?? 0;
    if (count > 1) {
      holds.set(id, count - 1);
      return;
    }
    holds.delete(id);
    const { el, note } = keyById.get(id);
    el.classList.remove('pressed');
    onNoteOff(note);
  }

  function keyAt(x, y) {
    const el = document.elementFromPoint(x, y)?.closest('.key');
    return el && container.contains(el) ? el.dataset.note : null;
  }

  // Move a pointer onto a key (or off all keys when id is null).
  function moveTo(pointerId, id) {
    const current = pointers.get(pointerId);
    if (current === id) return;
    if (current) release(current);
    if (id) press(id);
    pointers.set(pointerId, id);
  }

  function end(pointerId) {
    if (!pointers.has(pointerId)) return;
    moveTo(pointerId, null);
    pointers.delete(pointerId);
  }

  container.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    // Touch implicitly captures the pointer; release it so moves can slide to other keys.
    if (container.hasPointerCapture(e.pointerId)) container.releasePointerCapture(e.pointerId);
    pointers.set(e.pointerId, null);
    moveTo(e.pointerId, keyAt(e.clientX, e.clientY));
  });

  window.addEventListener('pointermove', (e) => {
    if (pointers.has(e.pointerId)) moveTo(e.pointerId, keyAt(e.clientX, e.clientY));
  });

  window.addEventListener('pointerup', (e) => end(e.pointerId));
  window.addEventListener('pointercancel', (e) => end(e.pointerId));
  // Don't leave keys stuck if the window loses focus mid-press.
  window.addEventListener('blur', () => [...pointers.keys()].forEach(end));
}
