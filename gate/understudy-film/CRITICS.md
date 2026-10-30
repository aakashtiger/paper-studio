# Critic pass — The Understudy (fixture film)

**Artifact:** `films/understudy/understudy.mp4` · h264 1920×1080 · 30 fps · 900
frames · 30.000 s · 21,504,213 bytes · `sha256:14fdbf9eaf20c9c9...`
**Gate:** `npm run gate:7 -- films/understudy/score.json` → **PASS** (12 mechanical
checks; 1 still manual)
**Date:** 31 Oct 2026

This pass re-reviews the film after the rig/pose repair, the duet counter-phrase,
the painter move into the pack, and the three new audits (`audit:motion`,
`audit:type`, `audit:rig`). Scores are out of 10. A critic signs only if it would
ship the film at the quality bar; “no” means the named evidence does not exist
yet.

| Critic | Score | Sign | Blocking question |
|---|---|---|---|
| Architect | 9 | yes | — |
| Developer | 9 | yes | — |
| Editor | 9 | yes | — |
| QA | 9 | yes | 1 check declared manual (ASR), not skipped |
| Designer / DOP | 9 | yes | — |
| Motion director | 9 | yes | — |
| Sound designer | 9 | yes | ASR carried forward to the first real film (0016) |

## Evidence shared by all

- `build/understudy/audit.json` — 900 frames, 45 cues, 6 captions, 0 errors,
  0 warnings.
- `build/understudy/frame-audit.json` — 900/900 frames, luma 108.8–207.4, 0
  blank, 40 cuts, 0 missed cues, longest hold 0.13 s.
- `build/understudy/paint-match.json` — 31 sampled times, worst 36.6 dB at 19 s
  (min 30 dB). The same check on the pre-fix render failed at 17–21 s (19.7 dB),
  so the check is not decorative.
- `build/understudy/palette-audit.json` — worst saturated outlier 0.41% of frame
  (limit 0.5%).
- `build/understudy/motion-audit.json` — 9/9 shots above the 0.6 floor; weakest
  shot median 1.39 (s06), strongest 2.77 (s08); long holds ≤ 0.03 s.
- `build/understudy/type-audit.json` — 554 text boxes over 120 frames, 0 outside
  the safe area (6% inset from `styles/paper-kpop/tokens.json`).
- `build/understudy/rig-audit.json` — 842 leg solves from 241 character frames,
  0 unpaired, worst ankle jump 23.9 px (limit 60), knees 0.03–2.6 rad.
- `build/understudy/determinism.json` — two independent renders, identical MP4
  bytes (`sha256:14fdbf9e...`).
- `build/understudy/render-manifest.json` — score, score data, style backend,
  page, captions, vendor scripts and both cast pose libraries all hashed.
- `build/understudy/mix/mix-report.json` — −14.5 LUFS, −1.4 dBTP true peak.

## Architect — 9, sign

One authored score; the audit resolves the brief, audio, asset, pose and caption
contracts before a frame is drawn; no `proof: true` escape. The painter is style
code and now lives with the style (`styles/paper-kpop/canvas/recipes.js`,
decision 0015); `src/` holds no palette, shot id or recipe id. A second film
reuses the contracts by adding `films/<id>/`.

## Developer — 9, sign

The renderer verifies `drawnAt === requested` per frame, paints from the pack,
and hashes every input — including each cast pose library — into the manifest, so
a pose edit invalidates the render like a code edit. Two independent renders are
byte-identical, and `gate-7.json` now requires the determinism hash to equal the
delivered file. 169 tests, typecheck clean. The pose-mutation bug is guarded by
`test/painter-history.test.ts`; the leg reachability by `test/cast-rig.test.ts`.

## Editor — 9, sign

Nine shots, median 3.30 s. Every cut lands inside 1.5 frames of its cue. No
undeclared hold over 0.13 s. Transitions are native paper moves (cut, iris,
torn-paper card land), no dissolve. Captions hold for read time and sit in the
type area. The film reads with sound off.

## QA — 9, sign

`gate-7.json` writes pass/fail per check with the frozen hash; the score audit,
frame, paint, palette, motion, type and rig reports all describe the same file
the manifest hashed (paint and motion carry the frozen hash; the pose hashes and
the determinism hash are tied to it). The one manual check — ASR of the mixed
master — is declared as pending in the gate output, not silently passed, and is
deferred to the voice pipeline (decision 0016).

## Designer / DOP — 9, sign

Layered paper reads correctly: cut edges carry a hard shadow, one key light, the
compositions are posters with one focal shape, and the four palette roles hold
(0.41% saturated outlier). Type sits in the world on torn cards, not in a generic
lower third. The 9-shot contact sheet at 1920 confirms the look holds across the
film.

**Signed** because type-safe-area is now measured rather than judged by eye:
`audit:type` takes the text boxes from the painted frames and asserts every one
sits inside the 6% safe area — 554 boxes, 0 outside.

## Motion director — 9, sign

Every shot has a character action, not a camera move alone; feet stay on their
anchors and land on their contact shadows; the hop, the point and the bow all
have anticipation and follow-through.

**Signed** because both prior holds are closed:

1. The duet at 19.5–24.6 s is now a counter-phrase — Mira listens and answers
   rather than mirroring Nova — so the two silhouettes stack instead of
   cancelling. The s08 frame shows Nova leading and Mira answering.
2. The motion floor is measured: `audit:motion` reports 9/9 shots above the 0.6
   floor, weakest shot median 1.39 (2.3× the floor), longest hold 0.03 s. “No
   slideshow” is a number now, not an opinion.

The rig audit backs the weight: 842 paired leg solves, no unpaired solve, worst
ankle jump 23.9 px against a 60 px limit.

## Sound designer — 9, sign

13 cues are generated in code (transient/body/tail), each with a band, a reverb
send and a duck depth. The 1–4 kHz sidechain keeps the bed under the voice
without pumping. Master is −14.5 LUFS with −1.4 dBTP true peak, inside the
delivery window, and the designed silence is silent.

**Signed** for the mix design, which is fully measured. The one sound check with
no command yet — ASR of the mixed master — is **carried forward, not waived**:
the fixture voice is scratch (generated outside the repo), so ASR over it would
prove nothing. Decision `0016-voice-and-asr.md` lands ASR with the real voice
pipeline (offline, hashed, word-error threshold), and it is a hard gate on the
first real film. `gate-7.json` lists it as the single pending check.

## What this means

The fixture film is delivery-grade and mechanically clean, and the panel signs it
**9/10**. Every criterion below 9 in the previous pass was fixed by shipping a
command, not by moving a goalpost:

1. `audit:type` — safe-area boxes from the painted frames (was: judged by eye).
2. `audit:motion` — per-shot motion floor from frame differences (was: opinion).
3. `audit:rig` — paired leg solves, knee bend, ankle continuity (was: unchecked).
4. The duet counter-phrase (was: two mirrored solos).

The only open item is **ASR**, deferred to the voice pipeline by decision 0016 and
recorded as the single `pending` check in `gate-7.json`. It becomes a hard gate on
the first real film, when the voice is real.

## Carry-forward to the first real film

- Wire `audit:asr` over the real voice master before the film is signed.
- The board mix is −15.0 LUFS / −1.6 dBTP; the film master is −14.5 / −1.4 — the
  stepped rough and final master are still pending.
- The user's idea becomes the brief; nothing in this fixture is reused as content.
