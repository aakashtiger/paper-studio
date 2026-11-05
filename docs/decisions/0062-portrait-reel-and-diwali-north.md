# 0062 — The portrait reel: 9:16, *The Road Home*, and a frame report that reads its own frame

**Date:** 5 Nov 2026
**Status:** accepted by the work; the film is delivered and the gate is green.

## The request

The user asked for a **9:16 portrait reel**, one minute, explaining why Diwali
is celebrated in North India. The 16:9 proof was already green; the point of
this film is to prove the same pipeline in portrait without cropping a 16:9
composition.

## The film

`films/diwali-north/` — *The Road Home*.

- 60.0 s, 1080×1920, 30 fps, 19 shots, 16 narration lines, 181 words.
- The North Indian story is stated plainly: Rama's return to Ayodhya with Sita
  and Lakshmana after fourteen years, the defeat of Ravana, the lamps that
  welcomed them home; then Dhanteras, Chhoti Diwali, Lakshmi Puja, Govardhan
  Puja and Bhai Dooj, with rangoli, a thali, grain and cattle, and a tilak.
- 4/19 shots are staged (Child, Householder + Child): 21%, inside the pack's
  `diagram-show` 20–60% band.
- `mood: "mixed"`: the film has night streets, bright paper diagrams and a
  green field, so it claims the mixed band rather than pretending every scene
  is a night exterior.
- Voice: Kokoro `af_heart` at speed 1.1; measured last word 59.10 s. The clock,
  captions and shot bounds are snapped to the 30 fps grid. Captions are 4-word
  chunks with a measured hold; the SRT is a sidecar, not burned into the frame.

## The portrait fix that was not optional

`src/engine/frame-report.ts` mapped the probe's chest/head/feet aperture as if
every frame were 1920×1080. On a 1080×1920 still that put the subject box — and
the local-contrast ring around it — in the wrong place. The report now scales
the box by the frame that was actually painted (`frameWidth`/`frameHeight`),
which is a no-op for 16:9 and the truth for 9:16. Without it the identity gate
was measuring a landscape crop of a portrait frame.

## The pack grew, and the gate says so

The nineteen portrait scenes are film-local vocabulary in
`styles/paper-kpop/recipes/p_*.json`, drawn by
`films/diwali-north/vendor/diwali-recipes.js`. `capabilities.proof.frames` names
all 60 recipes, and `test/paper-kpop-0.2.0-gate.test.ts` now proves sixty
recipes (22 pack + 38 film) instead of forty-one. The sealed 0.1.0 plans still
resolve recipe for recipe.

## Evidence

- `preflight`: PASS.
- `visual:check`: contract 3, 19/19 briefs, 4 staged, 0 findings.
- `camera:check`: 19 shots, 4 moves, longest run 1.
- `collage`: 19 distinct frames, 1080×1920.
- `probe:motion`: every shot moves.
- `determinism`: 57 frames, serial and parallel, 0 mismatches.
- `style:identity`: pass, 0 findings; delivered video bands measured.
- `inspect`: motion / type / rig / face pass from one probe.
- `sfx` + `mix`: 42 cues, −14.1 LUFS / −1.5 dBTP master, declared silences ok.
- `render:film --workers 4`: 1800 frames.
- `deliver`: −14.1 LUFS / −2.1 dBTP on the delivered file.
- `audit:frames`: 1800 frames, 0 blank, 0 missed cuts, longest hold 0.00 s.
- `audit:motion`: 19/19 above the 0.6 floor.
- `audit:palette`: 4 hue families / top 90.5%, clipping 0.03%.
- `audit:paint`: 61 frames, worst 36.0 dB.
- `asr`: 92.8% of the script heard (threshold 90%).
- `gate:7`: **PASS · 30 checks · nothing manual**.
- `film:review --gate --reuse`: **PASS**.
- Delivered picture `sha256:d2948b8f9beaac10fd6539c6b61d66a0f66e68c514e509c4d68454a22b4245b7`
  (`films/diwali-north/diwali-north.mp4`, ignored by git; the hash and sheet are
  the evidence).

## Known, named

The SRT is a sidecar; the MP4 carries no burned captions. The two shortest
lines (v08, v15) use a caption hold to meet the read-time floor. The film's
surface is still measured globally per frame; the identity report is one
sample per shot. The frame-report fix is the only engine change; it is covered
by the existing 16:9 tests and the new portrait run.
