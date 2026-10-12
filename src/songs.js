// Beginner songs for the guided mode. Each song is a melody written as note
// ids (see notes.js); rhythm is ignored, the guide just waits for the next key.
// Everything stays inside the keyboard range C4–B5.

const song = (id, title, melody) => ({ id, title, notes: melody.trim().split(/\s+/) });

export const SONGS = [
  song('hot-cross-buns', 'Hot Cross Buns', `
    E4 D4 C4  E4 D4 C4  C4 C4 C4 C4 D4 D4 D4 D4  E4 D4 C4`),
  song('mary-lamb', 'Mary Had a Little Lamb', `
    E4 D4 C4 D4 E4 E4 E4  D4 D4 D4  E4 G4 G4
    E4 D4 C4 D4 E4 E4 E4  E4 D4 D4 E4 D4 C4`),
  song('twinkle', 'Twinkle, Twinkle, Little Star', `
    C4 C4 G4 G4 A4 A4 G4  F4 F4 E4 E4 D4 D4 C4
    G4 G4 F4 F4 E4 E4 D4  G4 G4 F4 F4 E4 E4 D4
    C4 C4 G4 G4 A4 A4 G4  F4 F4 E4 E4 D4 D4 C4`),
  song('au-clair', 'Au clair de la lune', `
    C4 C4 C4 D4 E4 D4  C4 E4 D4 D4 C4`),
  song('ode-to-joy', 'Ode to Joy', `
    E4 E4 F4 G4 G4 F4 E4 D4  C4 C4 D4 E4 E4 D4 D4
    E4 E4 F4 G4 G4 F4 E4 D4  C4 C4 D4 E4 D4 C4 C4`),
  song('jingle-bells', 'Jingle Bells (chorus)', `
    E4 E4 E4  E4 E4 E4  E4 G4 C4 D4 E4
    F4 F4 F4 F4  F4 E4 E4 E4 E4  E4 D4 D4 E4 D4 G4`),
  song('frere-jacques', 'Frère Jacques', `
    C4 D4 E4 C4  C4 D4 E4 C4  E4 F4 G4  E4 F4 G4
    G4 A4 G4 F4 E4 C4  G4 A4 G4 F4 E4 C4  C4 G4 C4  C4 G4 C4`),
  song('happy-birthday', 'Happy Birthday', `
    G4 G4 A4 G4 C5 B4  G4 G4 A4 G4 D5 C5
    G4 G4 G5 E5 C5 B4 A4  F5 F5 E5 C5 D5 C5`),
  song('silent-night', 'Silent Night', `
    G4 A4 G4 E4  G4 A4 G4 E4  D5 D5 B4  C5 C5 G4
    A4 A4 C5 B4 A4  G4 A4 G4 E4  A4 A4 C5 B4 A4  G4 A4 G4 E4
    D5 D5 F5 D5 B4  C5 E5  C5 G4 E4 G4 F4 D4 C4`),
  song('fur-elise', 'Für Elise (intro)', `
    E5 D#5 E5 D#5 E5 B4 D5 C5 A4  C4 E4 A4 B4  E4 G#4 B4 C5
    E4 E5 D#5 E5 D#5 E5 B4 D5 C5 A4  C4 E4 A4 B4  E4 C5 B4 A4`),
];
