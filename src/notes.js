// Note definitions for the keyboard range.

const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Build the list of notes from the start of one octave to the end of another.
 * @param {number} firstOctave e.g. 4
 * @param {number} lastOctave  e.g. 5 (inclusive)
 * @returns {{id: string, name: string, octave: number, midi: number, black: boolean, frequency: number}[]}
 */
export function buildNotes(firstOctave, lastOctave) {
  const notes = [];
  for (let octave = firstOctave; octave <= lastOctave; octave++) {
    NAMES.forEach((name, i) => {
      // MIDI number: C4 = 60, A4 = 69 (440 Hz).
      const midi = (octave + 1) * 12 + i;
      notes.push({
        id: `${name}${octave}`,
        name,
        octave,
        midi,
        black: name.includes('#'),
        frequency: 440 * 2 ** ((midi - 69) / 12),
      });
    });
  }
  return notes;
}
