# 0052 — Style identity is a film gate, not a description

**Status:** accepted · 4 Nov 2026
**Owners:** shared (`src/engine/style-identity.ts`, `scripts/style-identity.ts`), creative (`styles/paper-kpop/tokens.json`, `STYLE.md`)
**Depends on:** 0015 (the pack), 0041 (camera), 0048 (the character), 0051 (the visual brief)

## Context

The pack already documented its identity in `STYLE.md` and `tokens.json`, and
`style:measure` could measure a film against the reference frames. Nothing in the
film pipeline **read those definitions**. The Uber draft passed 23 mechanical
checks with no performer in any shot, a desaturated diagram palette and a
generic map opening. `style:measure` said the quiet part out loud:

| metric | reference | Uber draft | delta |
|---|---|---|---|
| luma | 145.8 | 184.3 | +38.5 |
| saturation | 39.8 | 14.8 | -25.0 |
| contrast | 245.8 | 227.0 | -18.8 |
| palette distance | — | — | 83.8 |

The pack was not missing a definition. The pipeline was missing a **film-level
identity gate** that used the existing definition and the existing measurement.

## Decision

- `tokens.identity` names the machine-readable contract: `dimension`, the
  `reference` frame folder, the metric `bands`, and the cast contract (max,
  staged ratio, poses, expressions, anchors).
- **Cast is a construction, not a membership.** A film may use a library
  character or design a new one; the new character must have the paper-puppet
  anchors, the body block, 8 poses and 14 expressions. The library is a source,
  not a loyalty test.
- **At least half the shots stage a performer.** A diagram-only film is not
  Paper K-pop.
- `npm run style:identity -- <score>` measures the film against the reference
  frames with the existing `style:measure`, checks cast/staging, and writes
  `build/<id>/style-identity/style-identity.json`.
- `render:film` refuses without a passing identity report tied to the score;
  `film:review` runs it again on the delivered video (`--video`), and `gate:7`
  adds a `styleIdentity` row tied to the frozen video hash. The gate is **24
  checks**.
- The identity bands are `luma ±20`, `contrast ±25`, `saturation ±10`,
  `edges ±5`, `palette distance ≤45`. The palette band is 45 because the
  reference frames themselves span six colours and the nearest-colour distance
  is 0–441; 40 was a guess that a measured, on-style cut missed by 3.
- **The style is allowed to be a paper explainer.** `STYLE.md` no longer refuses
  “corporate explainers” as a class; it refuses clean vector decks and
  advertorials with no paper performance. The subject can be a song or a
  business model; the grammar stays.

## Measured on *The Uber Cut*

- Cast: Kiran and Vaz staged in **9/10** shots; 8 poses, 14 expressions, body,
  anchors.
- Measured on the delivered video: **Δ luma -1.0, Δ saturation -4.1,
  Δ contrast -18.0, palette 43.0** — inside the bands.
- `style:identity` PASS; `gate:7` **PASS · 24 checks · nothing manual**;
  `film:review` PASS.
- The sheet now has the bright cobalt/tomato/gold paper fields, the two
  performers, the phone map, the city route, the fare split, the four revenue
  tiles and the network — the story and the channel in the same frame.

## What this does not do

- It is not a pixel-level semantic check. A conforming cast and a measured
  palette can still be a bad film; the sheet and the director judge that.
- It does not make `style:measure` per-region. The identity check uses the
  global metrics; where the ink falls is still the eye's job.
- It does not force the library. The per-film “library or new character” chooser
  and the immutable library versions are parked.
