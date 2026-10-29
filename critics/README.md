# Critics

Seven fixed roles. They judge artifacts; they do not render and they do not
invent direction. The director has the final call.

| Role | File | Owns |
|---|---|---|
| Architect | `architect.md` | score contract, engine/backend boundary |
| Senior developer | `developer.md` | rig, code, tests, determinism |
| Designer / DOP | `designer.md` | look, composition, light, palette, type |
| Motion director | `motion.md` | performance, choreography, camera |
| Editor | `editor.md` | shot rhythm, transitions, sync |
| Sound designer / mixer | `sound.md` | SFX design, layers, space, mix |
| QA / UAT | `qa.md` | every gate, audit, evidence, claims |

## How a critic answers

Every review returns:

1. **Score** /10 against the anchors in `docs/PRODUCTION-PLAN.md`.
2. **Blocking issues**, each tied to a timestamp, shot, file or frame.
3. **One required fix** if not signed.
4. **SIGN yes/no.** A no blocks the gate; the film goes back one step.

A critic may not pass a film with a known broken frame, a missing cue, an
unlicensed track or a claim that the evidence does not support.

## Where they sit

| Gate | Artifact | Critics |
|---|---|---|
| G0 brief | `brief.json` | architect, editor |
| G1 audio | voice, transcript, SRT, cue sheet | editor, sound, QA |
| G2 direction + look | score, board, hero frames | designer, editor |
| G3 animatic | board pass + stepped rough | motion, editor, QA |
| G4 assets | character/prop sheets | designer, developer, QA |
| G5 shots | animated shots + contact sheets | motion, editor |
| G6 mix | mixed master | sound, editor, QA |
| G7 final | MP4 + SRT + score + audit | all seven + director |

The gate commands and pass conditions are in `docs/GATES.md`.
