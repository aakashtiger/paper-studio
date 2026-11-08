# KPOP Crime 60 s — final status

**Delivered.** A 60.00 s, 1920×1080, 30 fps paper-cut crime film: 21 shots,
7 scenes, 14 voice-over lines, 186 words at 187.4 wpm, male-only cast
(MAN, DETECTIVE, WARDER, JUDGE), non-graphic murder and execution.

- Picture: `proofs/kpop-crime-60/out/kpop-crime-60.mp4`
- sha256: `475f54e785ce6a69d4ac118852893cb576baf95c8cc9f32a1ad03bdbb4ba439f`
- Size: 169,357,140 bytes
- Audio: −14 LUFS / −1.5 dBTP delivered (12 code-generated cues + narration)
- Look: luma 78.73, saturation 14.41, edges 3.22 (band 55–100 / 14–26 / 3.0–6.5)
- Contact sheet: `out/sheet/contact-sheet.png`
- Stills: `out/stills/t*_*.png`, one per shot

## Gate

`node scripts/quality-check.mjs proofs/kpop-crime-60/film.json` → **10/10**

| row | result |
|---|---|
| sync | every content word has a picture event; every shot reads it |
| motion | no shot freezes; the cut moves; report tied to the MP4 |
| determinism | 9 frames, 1-vs-4 workers identical; report tied to the MP4 |
| rig | 4 cast rigs, armL+/armR− |
| performance | 21/21 shots pass the pose/gesture/face/static floor |
| set | 11 sets, longest run 3, layers 6+, props 6+ |
| type | hero + label + subtitle + HUD in every shot |
| edit | median 2.66 s, cameras push/track/pull/pan, four transitions |
| sound | 12 cues, master −14/−1.5, delivered −14/−1.5 |
| look | 78.73 / 14.41 / 3.22 |

`node scripts/continuity-check.mjs proofs/kpop-crime-60/film.json` → **PASS**
(day, wardrobe, set, prop state; the cell is visited and returned to).

`node scripts/twin-check.mjs` → PASS, picture sha `475f54e7…`.
`frame-diff` → 1800 frames, no frozen shot, no run over 12 frames.

## The critic loop

Two critics reviewed the picture at 1× and at 3–4× crops. The final round
passed both the visual and the story/contract review. Defects found and fixed
in the picture, not just in the score:

- the chase read as a dance → bodies separated, the runner's arms pump, the
  detective reaches the coat tail from 360 px back;
- the s02 insert arm floated → it enters from the left edge at waist height;
- the kneeling detective's leg ended in a stump → the knee pad is trouser
  coloured and the fold reads as a knee;
- the case file floated → the hand and thumb hold it;
- hats floated → the rig fedora/cap dropped 30 px, the gray hat sits at the
  hairline, and the hat's band is dark from s04 to s15;
- the lead read female at s12–s21 → the “headband” was a hole between the
  hair path and the face plate; the hairline now overlaps the face plate, the
  hair is a short dark cut, stubble stays;
- the judge read female → moustache, stubble, short dark hair, glasses, robe;
- the s15 bystanders read female → fedoras, stubble, male faces;
- the noose was a solid rope → a thin shadow on the wall, connected to the
  beam shadow; no body, no drop;
- the yard cuffs and the warder's side changed between shots → the warder
  stays on the man's left, the cuffs are on his wrists in both, declared at
  s20 (`belt -> wrists`);
- s12 left the hat in mid-air → it is drawn on the head at −82 and lands on
  the barrier at 1160 on “walked”;
- the court had no dock → a low rail in front of the accused;
- the verdict card read “10” (10 years) → a seal, no number;
- the court flag read as a national flag → a red banner with a gold seal;
- the newspaper vanished from the window in s08/s09 → it stays papered;
- the near sleeve was invisible against the coat → near +6, far −16 shade;
- s16's unlock/hook was too fast → the hook completes by 45.05, cuffs visible
  on the warder's belt in s16, s17 and s18;
- s19 had the case file back in the cell → removed; the file stays in s16 and
  the score declares `caseFile: on the bench -> gone to court`;
- the folded court jacket did not match the worn suit → the same red tie.

## Core changes this film forced

- `scripts/quality-check.mjs`: the performance lead is the **largest instance**
  of a cast name in the frame, so a background extra no longer shadows the
  lead's face (the s15 41 px false read); the set row allows a 3-shot scene.
- `scripts/look-check.mjs`: `maxBuffer` raised to 1 GiB, so 1800-frame
  `signalstats` output no longer kills the child (the missing `look.json`).
- `proofs/kpop-crime/characters/man.js`: the hair path no longer leaves a
  hole above the face plate (the “headband”); `hatColor`; the fedora/cap sit
  30 px lower; the near sleeve is shaded +6 and the far −16; the judge is
  male by default; the mustache is two lobes.
- `proofs/kpop-crime-60/test-scenes.js`: `poseAt` returns a deep-enough copy
  on hold frames, so per-frame arm nudges cannot accumulate in the pose
  library.
- `studio/films/kpop-crime/`: the 14 lines, 186 words, the measured read. The
  v10 line break hold was cut 0.30 → 0.10 s; the longest word gap is 0.58 s
  (gate 0.6).

The 21 s proof (`proofs/kpop-crime/`) was re-rendered on the same rig and is
still **10/10**: `out/kpop-crime.mp4` sha
`97986bb9b86041f32b7bf5fc2ede96462800ca15311f4e56cd208677398ffd8d`,
look 81.53 / 15.24 / 3.23.

## Reproduce

```bash
node proofs/kpop-crime-60/render-crime-60.mjs --measure
node proofs/kpop-crime-60/render-crime-60.mjs --frames=0:60 --workers=4
node proofs/kpop-crime-60/render-crime-60.mjs --encode --out=proofs/kpop-crime-60/out/kpop-crime-60.mp4
node scripts/frame-diff.mjs proofs/kpop-crime-60/out/kpop-crime-60.mp4 proofs/kpop-crime-60/out/frame-diff.json proofs/kpop-crime-60/shots.json
node scripts/look-check.mjs proofs/kpop-crime-60/out/kpop-crime-60.mp4 proofs/kpop-crime-60/out/look.json
node scripts/twin-check.mjs proofs/kpop-crime-60 proofs/kpop-crime-60/render-crime-60.mjs 1.0:1.3
node scripts/quality-check.mjs proofs/kpop-crime-60/film.json
node scripts/continuity-check.mjs proofs/kpop-crime-60/film.json
```

The score is derived from the measured clock: `make-words.mjs`,
`make-score-60.mjs`, `make-sound-60.mjs`, then `scripts/sync-check.mjs`.
