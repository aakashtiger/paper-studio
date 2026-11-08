# The KPOP critics — the last row is a person, twice

**Date:** 8 Nov 2026
**Status:** K6. The prompts are generalised from the M0 crime film
(`proofs/kpop-crime-60/critics/`), which is the worked example. The rule they
serve is code: `npm run critics:check -- <film dir>`.

A 10/10 gate is necessary and not sufficient. The gate reads declarations; it
cannot see that a hand is in the wrong place or that the story was lost at shot
nine. Two fresh critics can. **Both must say GO**, at 10/10, tied to the picture
that ships.

## The two roles

| Role | Prompt | Reads | Answers |
|---|---|---|---|
| **picture** | `kpop-picture.md` | the MP4, one still per shot, the contact sheet, the cut pairs, the hand sheets | continuity, anatomy and contact, type, performance, world variety |
| **story** | `kpop-story.md` | the score, the lines and word times, the stills and sheet | legibility from pictures alone, line-to-picture, ending, invention, argument, pacing |

They are separate sessions with no shared context. Neither may read the other's
report before writing its own.

## What makes a critic fresh

1. They did not make the film and have no history with it.
2. They are **read-only**: they may pull frames with ffmpeg and read any file,
   and they write exactly one file — their own report.
3. They may not use the gate as their argument. "The ten rows pass" is not a
   finding, and "the gate says 10/10" is not a reason to say GO.
4. Every P0 and P1 names a shot, a second where it has one, the severity and the
   sheet, still or pulled frame where it can be seen. A finding without a place
   is not a finding, and `critics:check` refuses it.
5. A reused report is legal only when it names **this** picture's `videoHash`.
   Never because it is convenient.

## How to run them

Spawn two agents in parallel, one per prompt, with the film's own values filled
in. The prompt files carry `{{FILM}}`, `{{DIR}}`, `{{VIDEO}}`, `{{SHA}}`,
`{{SHOTS}}` and `{{SCORE}}`. Each writes `<dir>/critics/<role>.json`:

```json
{ "role": "picture", "critic": "<session id or name>", "videoHash": "<sha256>",
  "score": 10, "verdict": "GO",
  "axes": { "continuity": 10, "anatomy": 10, "legibility": 10, "performance": 10, "type": 10, "variety": 10 },
  "findings": [], "named_strongest": "s...", "named_weakest": "s..." }
```

Then:

```bash
npm run critics:check -- ../proofs/kpop-crime-60 --score ../proofs/kpop-crime-60/film.json
```

The command reads `<dir>/critics/*.json` and the picture hash from the film's own
evidence (`review.json`, `out/twin.json` or `out/look.json`), and prints SHIP or
every reason it is not shippable. It is the K6 row of the factory.

## What happens to their findings

- **P0** becomes a `FIXLIST.md` row the same day, and the film is re-cut.
- **P1** becomes a row or is argued down in writing, with the reason.
- **P2** is fixed when cheap, otherwise recorded.
- A NO-GO blocks sign-off; one GO never cancels the other's NO-GO.

After a fix, the picture hash changes, so **both reports are stale by
construction** — which is the point. Fresh critics run again on the new cut.
