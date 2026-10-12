# Piano

A simple browser piano: click (or tap) the keys to play notes.

**Play it:** https://bluedragon-ctrl.github.io/Piano/

## Run locally

No build step — it's plain HTML, CSS and JavaScript modules. Serve the folder
with any static server (ES modules don't load from `file://`):

```bash
npx serve .
```

or

```bash
python -m http.server 8000
```

Then open http://localhost:8000 (or the port shown).

## Project structure

```
index.html          page entry point
style.css           styles
src/main.js         app entry module
src/notes.js        note names and frequencies
src/keyboard.js     keyboard rendering and pointer input
src/audio.js        Web Audio synthesizer (piano-like tones)
.github/workflows/  GitHub Pages deployment
```

## Development

- Work happens on feature branches and is merged into `main` via pull requests.
- Every merge to `main` deploys automatically to GitHub Pages.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)
  (`feat:`, `fix:`, `docs:`, `chore:` …).

## Roadmap

1. Project setup and Pages deployment
2. Keyboard rendering — 2 octaves (C4–B5), visual key press
3. Sound — Web Audio synthesized tones, press/release, glissando
4. Touch support — multi-touch, no scroll/zoom while playing
5. Polish — note labels toggle, volume slider
