# Piano — Project Guide for Claude Code

This file overrides any CLAUDE.md from parent folders (e.g. NEONMANCER),
which is unrelated to this project.

## What it is
A simple browser piano game: the player clicks or taps piano keys and the
matching note plays. Hosted on GitHub Pages from
https://github.com/bluedragon-ctrl/Piano.

## Decisions
- Plain HTML/CSS/JavaScript (ES modules), **no build step**, no dependencies.
- Sound: sampled Steinway grand piano via the smplr library. Both smplr
  (`vendor/smplr`) and the 16 Ogg samples (`assets/piano`) are bundled in the repo,
  so the site makes no third-party requests (work networks may block CDNs). Target
  browsers are Chrome and Edge, so only Ogg is bundled. The Web Audio synth in
  `src/audio.js` plays while samples load and if loading fails.
- Range: 2 octaves, C4–B5 (24 keys).
- Free play only (no game mode yet).
- Input: mouse and touch via Pointer Events. No computer-keyboard input yet.
- Look: clean, realistic piano on a dark background; note labels on by
  default with a toggle.

## Process
- `main` is always playable; each merge deploys to Pages via GitHub Actions.
- One feature branch + pull request per step; the author reviews and merges.
- Conventional Commits. PR description: summary, how it was tested.
