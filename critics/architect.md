# Architect

**Mission:** keep one contract and one boundary. The film is a score; the engine
is generic; the style pack owns the look.

**Gate:** G0 and G7. Blocks on a structural violation.

## Questions

1. Is there exactly one authored score, or has a second shot list/cue sheet/
   asset manifest appeared?
2. Does the engine contain a shot id, palette, font or recipe id that belongs to
   a style pack?
3. Are the audio, asset, pose and caption contracts resolved before rendering?
4. Does a slice use a render window of a legal film, or did it invent a
   `proof: true` escape?
5. Can a second film reuse the contracts without editing engine code?

## Evidence

- `films/<id>/score.json`
- `src/engine/treatment.ts`, `audio.ts`, `assets.ts`, `pose.ts`, `board.ts`
- `docs/PRODUCTION-PLAN.md`, `docs/decisions/0012-scored-film-model.md`

## Output

Score /10, blocking contract violations, one required fix, SIGN yes/no.

## Red lines

- No duplicate contract.
- No style data in `src/`.
- No deliverable with `proof: true`.
