# Paper Studio — status audit

**Date:** 2026-10-29
**Update:** `docs/PRODUCTION-PLAN.md` v1.4 is accepted. The plan is generic and
core-first: contracts, audio resolver, asset/rig/pose system, board generator,
animatic builder, audit and critic pack come before any film render. *The
Understudy* is a fixture for tests, not the first film; the user will provide the
idea. It has a validating `score.json`, a 29.5 s scratch voice, a transcript and
an SRT. The renderer still does not read the score. The next work is the core
system, not a render.

**Purpose:** an honest inventory of what exists, what is weak, and what is
missing, with a deliberately small build plan. No new architecture unless it
removes a real blocker.

## Verdict in one paragraph

We have a strong **look** and a working **single-film proof**: the Paper K-pop
style, a 15-second 1080p film, a preview timeline, a deterministic renderer, a
repaired character rig, a treatment validator, 122 tests and green CI. We do not
have the **production system** that turns a script into a scored film, builds
per-film assets, renders from that score, and audits every frame. The gap is
process, not paint.

## 1. What we have

| Area | What exists | Evidence |
|---|---|---|
| **Paper K-pop style** | Pack 0.1.0: palette, type, 8 recipes, 2 formats, card, fonts, references, 6 crops | `styles/paper-kpop/`; hash `sha256:6c5765be…`; gate 9/9 |
| **Watercolor style** | Pack 0.2.0: card/process revision, 2 formats, exact manifests, 1 blind | `styles/watercolor-0.2.0/`; hash `sha256:196fd315…`; gate 9/9 |
| **S1 gates** | Sealed evidence for paper and watercolor, blind runs, critics | `gate/paper-kpop-blind/`, `gate/watercolor-0.2.0/` |
| **Paper proof** | 15 s, 1920×1080, 30 fps, 450 frames, three shots 4/5/6 s, silent | `proofs/s2-paper/paper-proof.mp4` |
| **Preview timeline** | HyperFrames Studio: play, scrub, shot timing | `npx hyperframes preview proofs/s2-paper` |
| **Determinism** | Two snapshot runs hash-identical on all sampled frames; seeded grain | `proofs/s2-paper/snapshots/` |
| **Character rig** | Joint chain repaired; hands, elbows, knees, boots connected; far arm follows torso | `proofs/s2-paper/vendor/characters.js` |
| **Rig contract** | Pure geometry + tests that would catch the mirrored-joint bug | `src/engine/rig.ts`, `test/rig.test.ts` |
| **Treatment contract** | Shot recipes, durations, slots, camera, motion notes, transitions; validator + CLI | `src/engine/treatment.ts`, `scripts/treatment.ts`, `proofs/s2-paper/plan.json` |
| **Research** | All 59 Lemo styles read; K-pop and watercolor autopsies; scored-film model | `docs/research/lemo-59-survey.md`, `docs/decisions/0012…` |
| **Tests / CI** | 122 tests, typecheck, GitHub Actions green | `npm test`, `npm run typecheck`; run `40738741602` |
| **Review record** | Architect, motion, design/DOP, QA on the proof; known defects written down | `proofs/s2-paper/reviews/` |

## 2. What needs improvement

These exist but are not yet good enough to sell.

| Area | Current state | Gap | Improvement |
|---|---|---|---|
| **Proof look** | Design 7/10 | Stage reads flat; some palette drift; contact shadows are weak | Stage depth pass: shadows, four roles, set layers |
| **Proof motion** | 5.5/10 | Shot 2 has a dead middle; dance is pose swaps; formation shift is small | Choreograph 8 counts with anticipation/overshoot; one continuous action in shot 2 |
| **Rig in the source** | Fixed only in the proof copy | `Y:\NewVideoTest\src\characters.js` still has the mirrored joint and far-arm defect | Port the rig fix; make the source consume `src/engine/rig.ts` |
| **Plan-driven render** | `plan.json` validates but `scenes.js` ignores it | The renderer is still hand-authored | Make the renderer read the score; delete hardcoded shot ids |
| **Treatment coverage** | Shots, slots, camera, motion, transitions | No events, clock, audio or asset manifest | Extend to `film.score.json`; keep one contract, not two |
| **Style duration** | Recipe min/max only; proof uses a 6 s stage over a 5.5 s recipe max | No min/median/max envelope or clock modes | Add `durationEnvelope` and `clockModes` to each style |
| **Asset flow** | Proof vendor copies; no manifest | No per-film cast/sets/props stage; no library promotion | Add project asset manifest + character/prop sheets |
| **QA depth** | Stills, manual checks, 122 unit tests | No every-frame audit, cue check, read check or golden frames | Add `film-audit`; run it in CI |
| **Critic process** | Six roles agreed in writing | Not implemented as gates with pass/fail | Gate A–D checklists tied to artifacts |
| **Docs hygiene** | Some handover headers are stale | Confusing for the next agent | Refresh the header and current-phase block |
| **Proof legality** | 6 s stage is a `proof: true` warning | A real film would fail | Either 5.5 s stage or a style envelope change, decided once |

## 3. What we do not have

These are missing, not weak.

| Missing | Why it matters | Build now? |
|---|---|---|
| **`film.score.json`** | The film is a timed score: shots, events, voice, SFX, captions; the renderer must read it | **Yes — first** |
| **Per-film asset stage** | Cast, poses, sets, props are made per film; the library grows by promotion | **Yes — second** |
| **Pose / expression library** | The proof has 16 hand-written poses; no named, reusable set | **Yes — second** |
| **Engine / backend boundary** | One engine, paper and watercolor backends; no copies of primitives | **Yes — third** |
| **Renderer that reads the score** | Today `scenes.js` hardcodes `open/sticker/stage` | **Yes — third** |
| **`film-audit`** | Every-frame rig, clipping, blank, palette, type, cue, determinism | **Yes — fourth** |
| **Audio** | No music, narration, SFX or mix; the proof is silent | Later (schema now) |
| **SFX generated in code** | You want this; it needs a cue list first | Later |
| **Watercolor video backend** | Only the pack and card exist | After the paper score render |
| **45 s film / 9:16 re-stage** | No full film, no vertical output | After the S2 gate |
| **Delivery + library** | No approved asset library, no delivery package | After the first scored film |
| **CI render / golden frames** | CI runs unit tests only | With `film-audit` |

## 4. Status at a glance

| Layer | Status |
|---|---|
| Style / look | ✅ strong |
| Single proof | 🟡 watchable, not 9/10 |
| Rig | 🟡 fixed in proof, not in source |
| Contracts | 🟡 treatment only, not a score |
| Assets | ❌ per-film flow and library |
| Engine | ❌ boundary, plan-driven render |
| Audio | ❌ silent |
| QA | 🟡 tests and stills, no every-frame audit |
| Delivery | ❌ no full film, no 9:16, no package |

## 5. The simple build order

### Must do next — the S2 gate

1. **Score schema + validator.** Extend the treatment; do not create a second
   system. Add clock modes (`music`, `narration`, `sfx`, `realtime`, `reading`,
   `free`), events, shots, assets, audio plan.
2. **Project asset manifest + character sheet.** Nova and Mira: named poses,
   expressions, wardrobe, props; create-or-reuse; approve the sheet.
3. **Renderer reads the score.** Replace `scenes.js` hardcoding with a painter
   that dispatches by shot and backend. Keep the paper primitives.
4. **`film-audit` + CI.** Cue alignment, rig seams, blank/clipped frames,
   palette, read time, determinism.

Then: **re-cut the 15 s proof through the score with a non-music clock**
(narration or SFX-only). This proves the system is not a music-video one-trick.

### Should do

- Watercolor backend on the same engine.
- Pose library promoted to the library after the film.
- Style `durationEnvelope` + `clockModes`.
- Golden-frame check in CI.

### Later

- 45 s film, 9:16 re-stage, delivery package.
- Music/narration mix and code-generated SFX.
- More styles.

### Never (to avoid over-engineering)

- A timeline editor or app.
- A plugin system or node graph.
- All 59 styles as products.
- A generic 3D engine.
- Hand-authoring every frame.
- Two parallel engines.
- A DAW.

## 6. What not to touch

- The Paper K-pop look and the style pack hashes.
- HyperFrames as preview/render host.
- Canvas2D as the paper backend.
- Determinism and seeded randomness.
- The 122-test suite and green CI.
- The six-critic roster and the four gates.

## 7. Definition of done for the next milestone

A 15-second film that:

- has **5 variable shots** inside the Paper K-pop envelope, not a fixed count;
- runs on a **narration or SFX clock**, not music;
- has a **per-film asset manifest** and approved Nova/Mira character sheets;
- is **rendered from the score**, with no hardcoded shot ids;
- passes **`film-audit`**: cues on frame, no rig seam, no blank/clipped frame,
  palette and type checks, deterministic hash;
- is signed by the **seven critics** and the director;
- ships with the score, audit report and stills.

That is the S2 gate. The 45 s film comes after it, not before.
