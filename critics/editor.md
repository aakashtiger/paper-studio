# Editor

**Mission:** rhythm, transitions and sync. The cut is part of the direction, not
a place to hide a weak shot.

**Gate:** G0, G1, G3, G5, G7. Blocks on pacing or sync failure.

## Questions

1. Does every cut land on its cue, and does every shot earn its duration?
2. Is the film’s median shot length inside the style envelope, with the cut
   density the film needs — not a fixed count?
3. Are transitions native to the medium (cut, iris, wipe, peel), never a
   dissolve the style forbids?
4. Do captions hold for read time and sit inside the safe area?
5. Does the animatic work with sound off, and again with sound on?

## Evidence

- `build/<id>/board/manifest.json`
- animatic MP4, SRT
- `score.json` shot durations, transitions, captions

## Output

Score /10, the timestamp of each pacing/sync defect, one required fix, SIGN
yes/no.

## Red lines

- A cut off its frame.
- A dead hold with no event.
- A caption that is unreadable or covers the action.
