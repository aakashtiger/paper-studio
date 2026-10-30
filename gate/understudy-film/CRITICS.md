# Critic pass — The Understudy (fixture film)

**Artifact:** `films/understudy/understudy.mp4` · h264 1920×1080 · 30 fps · 900
frames · 30.000 s · 21,425,165 bytes · `sha256:97b086d2eafe73a5…`
**Gate:** `npm run gate:7 -- films/understudy/score.json` → **PASS** (8 mechanical
checks; 4 still manual)
**Date:** 30 Oct 2026

This pass reviews the film after the pose-copy fix (decision 0014) and the s09
ending fix. Scores are out of 10. A critic signs only if it would ship the film
at the quality bar; “no” means the named evidence does not exist yet.

| Critic | Score | Sign | Blocking question |
|---|---|---|---|
| Architect | 9 | yes | — |
| Developer | 9 | yes | — |
| Editor | 9 | yes | — |
| QA | 9 | yes | 4 checks declared manual, not skipped |
| Designer / DOP | 8 | **no** | type-safe-area is unproven mechanically |
| Motion director | 7.5 | **no** | duet silhouettes are near-mirrored; motion floor unmeasured |
| Sound designer | 8 | **no** | no ASR of the mixed master |

## Evidence shared by all

- `build/understudy/frame-audit.json` — 900/900 frames, luma 108.8–207.4, 0
  blank, 40 cuts, 0 missed cues, longest hold 0.13 s.
- `build/understudy/paint-match.json` — 31 sampled times, worst 36.5 dB at 23 s.
  The same check on the pre-fix render fails at 17–21 s (19.7 dB), so the check
  is not decorative.
- `build/understudy/palette-audit.json` — worst saturated outlier 0.40% of frame
  (limit 0.5%).
- `build/understudy/determinism.json` — two independent renders, identical MP4
  bytes (`sha256:97b086d2…`).
- `build/understudy/mix/mix-report.json` — −14.5 LUFS, −1.4 dBTP, LRA 10.3.
- `build/understudy/audit.json` — 900 frames, 45 cues, 6 captions, 0 errors,
  0 warnings.

## Architect — 9, sign

One authored score; the audit resolves the brief, audio, asset, pose and caption
contracts before a frame is drawn; no `proof: true` escape; `src/` holds no
palette, shot id or recipe id — those live in the painter and the score. A second
film reuses the contracts by adding `films/<id>/`.

## Developer — 9, sign

The painter is boring canvas code with named pose helpers; the renderer verifies
`drawnAt === requested` per frame and hashes its inputs into the manifest. 165
tests, typecheck clean. The determinism bug fixed today is now guarded by
`test/painter-history.test.ts`, which fails if any pose object is mutated across
frames.

## Editor — 9, sign

Nine shots, median 3.30 s. Every cut lands inside 1.5 frames of its cue. No
undeclared hold over 0.13 s. Transitions are native paper moves (cut, iris,
torn-paper card land), no dissolve. Captions hold for read time and sit in the
type area. The film reads with sound off.

## QA — 9, sign

`gate-7.json` writes pass/fail per check with the frozen hash; the frame, palette
and paint reports all describe the same file the manifest hashed. Two renders
match on bytes. The four manual checks are declared as pending in the gate
output, not silently passed.

## Designer / DOP — 8, no

Layered paper reads correctly: cut edges carry a hard shadow, one key light, the
compositions are posters with one focal shape, and the four palette roles hold
(0.40% saturated outlier). Type sits in the world on torn cards, not in a generic
lower third.

**No sign** because type-safe-area is not measured. The margin band is judged by
eye in the contact sheets; a caption or card that drifts under the frame edge at
layout time would ship unnoticed. Fix: a command that takes the text boxes from
the board and asserts they sit inside the safe area on the delivered frames.

## Motion director — 7.5, no

Every shot has a character action, not a camera move alone; feet stay on their
anchors; the hop, the point and the bow all have anticipation and follow-through.

**No sign** for two reasons:

1. The duet at 19.5–24.6 s reads as two mirrored solos, not two complementary
   silhouettes on a shared eyeline. Nova and Mira run the same arm cycle in
   opposition, so the shapes cancel instead of stacking.
2. The motion floor is still judged by eye. No metric proves each shot moves
   enough, so "no slideshow" remains an opinion.

Fix: give Mira a counter-phrase (hold, listen, then answer) and measure per-shot
frame difference against a floor.

## Sound designer — 8, no

13 cues are generated in code (transient/body/tail), each with a band, a reverb
send and a duck depth. The 1–4 kHz sidechain keeps the bed under the voice
without pumping. Master is −14.5 LUFS with −1.4 dBTP true peak, inside the
delivery window, and the designed silence is silent.

**No sign** because there is no ASR of the mixed master. Nothing mechanically
proves the words in the delivered audio match the transcript; a wrong take or a
buried line would pass every current check.

Fix: wire an offline recogniser over the master and diff it against the
transcript with a word-error threshold.

## What this means

The film is delivery-grade and mechanically clean. It is **not** signed 9/10 by
the panel: three critics hold, and each holds for a missing command, not a
disagreement about taste. Turning these three into commands is the next quality
investment:

1. `audit:type` — safe-area boxes from the board vs the rendered text.
2. `audit:motion` — per-shot motion floor from frame differences.
3. `audit:asr` — recogniser over the master vs the transcript.
4. `audit:rig` — joint/seam check over the delivered frames.
