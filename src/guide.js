// Guided-song logic: tracks which note of the chosen song comes next.
// Pure logic with no DOM, so it is easy to test; main.js wires it to the page.

/**
 * @param {{id: string, title: string, notes: string[]}[]} songs
 * @param {(state: {song: object|null, index: number, total: number, target: string|null, done: boolean}) => void} onChange
 *   called whenever the song, the position or the target note changes
 */
export function createGuide(songs, onChange) {
  let song = null;
  let index = 0;

  function emit() {
    const total = song ? song.notes.length : 0;
    const done = song !== null && index >= total;
    onChange({ song, index, total, target: song && !done ? song.notes[index] : null, done });
  }

  return {
    /** Choose a song by id, or null for free play. Starts from the beginning. */
    select(id) {
      song = songs.find((s) => s.id === id) ?? null;
      index = 0;
      emit();
    },
    restart() {
      index = 0;
      emit();
    },
    /** Tell the guide a key was pressed. Wrong keys are ignored (no penalty). */
    noteOn(noteId) {
      if (!song || index >= song.notes.length || song.notes[index] !== noteId) return;
      index++;
      emit();
    },
  };
}
