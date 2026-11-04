# Paper K-pop identity research - index

**Date:** 4 November 2026
**Status:** research accepted; the identity core is implemented in decision 0053. The research files below are the evidence and the proposal; `KPOP-IDENTITY.md` v1.3 is the accepted definition.

## The deliverable

- **`KPOP-IDENTITY.md`** - the identity specification v1.3: 12 invariants, 12 required differences, 30+ axes, exact code values, scope system, acceptance test, gap analysis and the minimal change set.
- **`kpop-identity.proposed.json`** - the compact machine-readable extension (27 blocks, 10 required, 45 forbidden). It is a proposal for `tokens.identity`, not a second identity file.

## The evidence

| File | What it is |
|---|---|
| `A-engine.md` | every engine constant: paper, palette, light, camera, motion, edit, type, HUD, determinism |
| `B-cast-sets.md` | cast construction, movement, sets, props, 51-scene staging, contracts |
| `C-edit-camera-sound.md` | the 720p PDoom comparison edit (not the canonical film) |
| `D-lemo.md` | how 59 Lemo style packs encode identity; the schema lesson |
| `E-kits.md` | cartoon-short-kit and claude-animated-shorts; what transfers |
| `F-vizavi.md` | motion/camera/transition/storyboard/sound taxonomy |
| `G-studio-gap.md` | current pack/score/check inventory; 2 full, 28 partial, 5 missing |
| `H-youtube.md` | the two YouTube links are tutorials for a different channel; the pack's source is `out/claude-pop.mp4` |
| `I-frames.md` / `.json` | 162 frames: height, centroid, field, palette, contrast, blue-on-blue, Uber gap |
| `J-skills.md` | HyperFrames/critics/prompts; the 9/10 bar and the P0 gap list |

## The critiques and blind tests

| File | Score | What it found |
|---|---|---|
| `critique-creative.md` / `-v2` / `-v3` / `-v4` | 6.5 -> 7.0 -> 7.5 -> 8.0 | tone, archetype, performance, variation |
| `critique-technical.md` / `-v2` / `-v3` / `-v4` | 5.0 -> 6.0 -> 6.5 -> 7.0 | duplication, band collision, instruments, arithmetic |
| `critique-motion.md` | 5.0 | camera shares, edit maths, transitions, type/sound |
| `critique-qa.md` / `-v2` | 6.0 -> 6.5 | provenance, silent passes, 25% claim |
| `critique-completeness.md` / `-v2` | 7.0 -> 7.5 | missing records, lighting, determinism, HUD |
| `blind-test.md` | 5/10 | v1.1 produced a paper fable, not a K-pop show |
| `blind-test-v2.md` | 8/10 | v1.2 produced a performance after 3.30 was added |
| `blind-test-v3.md` | 7/10 | v1.3 performance holds; 5 x 6 s exposed a short-format edit gap |

## The five findings that changed the definition

1. **The canonical film is `out/claude-pop.mp4`** (1920x1080, 30 fps, 156.63 s, 4,699 frames). `ref/source.mp4` is a different 720p24 PDoom edit; the two YouTube links are tutorials for a third channel (Ricks Clips), not the reference. The pack's six crops come from the canonical film.
2. **The current gate measures the wrong thing.** The reference film fails the pack's own crop bands 4/5 (luma -44.9, contrast -30.4, saturation -18.0, palette 48.3 > 45). A film that looks exactly like the reference would be refused. The fix is two references: crops for surface, film for tones/composition/edit.
3. **The Uber film's ~25% is measurable.** Five axes fail: archetype (office workers), field (cream plate + 19% side bars), placement (x 0.136 vs 0.55), local contrast (12.6 vs 46.6), motifs (network diagrams). Blue-on-blue 7/10 tiles, 25/30 frames. The global colour pass came from the bars, not the channel.
4. **The missing concept is performance.** The reference is a K-pop show: a star, a stage, a chorus, a song, an entrance and an exit. A paper fable with the same palette is a different channel. This is now section 3.30 and the `performance` block.
5. **The cast is a paper-pop performer, not a flower.** The reference family includes a petal idol, a human researcher, five flower dancers, a cat idol and paper creatures. The invariant is the doll construction (3.4-4.5 visual heads, 22-28% head, 45-65% ornament), the stage role and the face, not a sunflower. A generic worker fails specificity and stage role.

## What is not implemented

- `style:identity` still uses the five crop-delta bands and still passes the Uber film.
- There is no drawn bbox, field component, ring, performance, motif or variation reader yet.
- `tokens.identity.filmBands` is a proposal, not a live field.
- The supersedes table (section 8.4) is a contract change, not applied.
- Music remains parked; the narrated mode is the only producible one without a licensed track.

The acceptance test is in section 5.5 of the spec. It is the next thing to build, after the owner signs the identity.
