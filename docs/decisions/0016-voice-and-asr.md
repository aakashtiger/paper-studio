# 0016 — Voice content: ASR belongs to the voice pipeline

**Status:** accepted · 31 Oct 2026
**Owners:** technical
**Spec:** `docs/PRODUCTION-PLAN.md` (§ audio, § still missing)
**Blocks:** the sound critic’s `9/10` sign, and the first real film’s voice

## Context

The sound designer holds *The Understudy* at **8/10**:

> there is no ASR of the mixed master. Nothing mechanically proves the words in
> the delivered audio match the transcript; a wrong take or a buried line would
> pass every current check.

The hold is fair in principle. It is the wrong ask for this film.

`films/understudy/voice.wav` is a **scratch voice**, pinned by hash, generated
outside the repo (PRODUCTION-PLAN: “recorded scratch or local TTS”). It is not a
performance and there is no commitment that its words match the authored
transcript. An ASR over a scratch voice would measure the placeholder, not the
film, and would be green or red for reasons that do not describe the product.

## Decision

1. **ASR is not wired for the fixture.** The one manual item in `gate-7` stays
   manual and is not silently passed; `docs/GATES.md` names it.

2. **ASR lands with the voice pipeline**, before the first film’s final voice
   (PRODUCTION-PLAN already lists this milestone). At that point:
   - narration is a *real* take or a *pinned local TTS render*;
   - the recogniser is **offline**, pinned by its own hash, and never a network
     call — same rule as fonts and frames;
   - it diffs the master against `transcript.json` and fails the gate above a
     **word-error threshold** (start at 10%, tighten per film).

3. **TTS narration needs no ASR.** When the engine synthesises the voice from the
   script, the words are the script by construction; the hash of the render
   pins them. ASR is required only for a **recorded** take.

4. **What is mechanical today and stays.** The mix proves the voice is present,
   that the 1–4 kHz band ducks under it, and that a line is never buried
   (`scripts/mix.ts`); the frame and motion audits prove the picture. None of
   these prove *content*, and none claims to.

## Why not a proxy

A dependency-free “voice-band energy in the line window” check is cheap, but it
cannot distinguish the right sentence from the wrong one. Adding it would turn a
1 px measurement into a green tick for a question it does not answer. The
placed line is already covered by the mix; content waits for the real voice.

## Consequence

The fixture is **not** signed 9/10 by the sound critic, and that is recorded, not
hidden. The fix is a milestone, not a patch. No new dependency enters the repo
today; the recogniser is chosen and justified when the voice pipeline is built,
by hash and offline, in a later decision.

## The other three holds are closed by commands

| Hold | Command | Status |
|---|---|---|
| type-safe-area | `npm run audit:type` | built |
| motion floor | `npm run audit:motion` | built |
| rig seam | `npm run audit:rig` | built |
| ASR | — | this decision: deferred to the voice pipeline |

The motion director’s remaining hold is creative, not mechanical: the duet at
19.5–24.6 s reads as two mirrored solos. That is a score/painter change, tracked
with the film, not a command.
