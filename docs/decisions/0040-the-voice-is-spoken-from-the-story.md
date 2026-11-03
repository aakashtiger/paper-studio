# 0040 — The voice is spoken from the story, before the score

**Status:** accepted · 4 Nov 2026
**Owners:** shared (`src/engine/**` contract, `films/**` authored)
**Depends on:** 0025 (the film is written before it is shot), 0035 (the measured read)

## Context

0025 said narration is generated after the beats and before the scenes and
shots. The code did the opposite: `voice` read `score.clock.lines`, so the score
— and the shot list — existed before the read. `voice` could move the score's
line starts, but it could not speak a film that had no score.

The user asked for the literal order: idea → story → beats → voice → scenes →
shots. This decision builds the first half of that order.

## Decision

**`npm run voice:story -- --story <story.json>` speaks the story, measures every
word, and writes `narration.json` before any scene or shot exists.**

It:

1. reads `story.json` and the `beats.json` beside it;
2. runs `checkStory` first — a story that is not filmable is not spoken;
3. speaks the story's narration lines with Kokoro (or keeps a pinned read);
4. listens with Whisper and attaches the heard words to the script's spelling;
5. derives each line's start and duration from the measured words;
6. writes `narration.json` with the lines, the word times, the coverage, the
   wpm, the first line, the longest hole and the last end;
7. refuses the read if any of these fails:
   - a line was not spoken (`everyLineSpoken`);
   - fewer than 90% of the script's words were heard (`everyWordHeard`);
   - the script is outside the story's wpm band (`wpm`);
   - the first line starts after 1 s (`firstLine`);
   - a hole is longer than 2.5 s (`hole`);
   - speech covers less than 80% of the film (`coverage`);
   - a line ends after the film (`withinFilm`).

`voice` still exists for a score that already has a clock; `voice:story` is the
front-door command. The score can be filled from `narration.json` next; that is
the one link still to build.

## Measured

`fixtures/story-min` — 30 s, 70 words, 5 beats:

```
voice:story: story-min · 70 words · 140 script wpm · 190 spoken wpm · speaks 73%
  first line 0.08s · last ends 29.48s · longest hole 0.78s at 2.40s · 69/70 words heard
  ok everyLineSpoken · ok everyWordHeard · ok firstLine · ok hole · ok withinFilm
  FAIL coverage
```

The one unheard word is **grey**, heard as **gray** — a spelling variant, not a
swallowed word; the 0.9 coverage floor is the same one `voice` uses.

**The first version of this report said 91%, and it was wrong.** It summed the
line windows, so every pause inside a line counted as speech. The measured word
times say **22.06 s of speech in 30 s (73.5%)**, and `measureWords` is now the
same function preflight uses (0037). The command **refuses** the fixture.

That refusal is honest, and it exposes a contract tension: 70 words at 140 script
wpm fills 30 s with words. A natural read adds pauses, so it either covers less
than 80% (this read) or runs past 30 s (slower reads). At 1.04 the read was 178
wpm with a 6.4 s tail; at 0.82 a 2.69 s tail; at 0.80 the last word ends 29.48 s
but speech covers 73.5%. No speed satisfies both. Either the coverage floor or
the "140–150 wpm on a 30 s film" density has to move; the command does not hide
it.

The read is pinned: a request hash (script text, voice, speed) is stored beside
the audio, and a changed script refuses the old read until `--force`. For a real
film the default files are `films/<id>/voice.wav` and `films/<id>/narration.json`,
not `build/`.

**441 tests**, typecheck clean, `films/` untouched.

## What this does not do, and is named

- **It does not fill `score.clock.lines` alone.** `voice --from-story
  <narration.json> --apply` writes the measured clock, captions and shot snaps
  into the score; a copy of *Same Alarm* took 7 lines, 7 captions and passed
  `npm run film`. The score must already have its shots; a shotless score is
  refused.
- **The fixture is a refusal example, not a passing one.** A passing read needs a
  script whose words fit the coverage floor with its pauses, or a longer film.
- **It speaks TTS only.** A recorded read is supported by `voice`, not yet by
  `voice:story`.
- **A song is not a narration.** The same order applies, but a lyric/syllable
  clock is not built.
- **The 0.80 speed is a fixture choice, not a style constant.** Another voice
  will need another speed to hit the same script density.
