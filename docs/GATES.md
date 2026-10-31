# Gates

A gate is a command plus an artifact plus a pass condition. If it cannot be
checked, it is not a gate. **Current status is marked.** No gate may pass on a
warning.

| Gate | Artifact | Command | Pass condition | Critics | Status |
|---|---|---|---|---|---|
| G0 brief | `brief.json` | `npm run film -- <score>` | fields complete; style, aspect, duration, fps and audio mode match the score | architect, editor | ready |
| G1 audio | voice, `transcript.json`, `captions.srt`, cue list | `npm run voice -- <score>` + `npm run captions -- <score>` | files exist and hash; word times come from the actual read (`words.json`), not a guess from word length; transcript covers the script; SRT cues match; read-time holds | editor, sound, QA | ready |
| G2 direction + look | score, `build/<id>/board/`, `build/<id>/board/board-sheet.png`, `build/<id>/storyboard/storyboard.png`, hero frames | `npm run board -- <score>` + `npm run storyboard -- <score>` | all shots inside the envelope; median in band; board covers every shot and marked beat; the board sheet shows every card on one image; the storyboard shows one code-drawn frame per shot, in order, on one sheet; look table complete | designer, editor | ready |
| G3 animatic | board pass + stepped rough | `npm run animatic -- <score>` + `npm run rough -- <score>` | board pass signed 9/10; stepped rough paints the score at 10 fps; every board time paired to its frame; every shot's median frame-to-frame change ≥ 0.6 and no hold >0.4 s; no camera-only shot; ≥2 breakdowns per transition | motion, editor, QA | **board pass signed; stepped rough measures pass** |
| G4 assets | `build/<id>/sheets/*.png` | `npm run sheet -- <score>` | seam gap 0; feet planted; contact shadow; 8 poses + 4 expressions; joint map; hand/foot/coat panels | designer, developer, QA | ready |
| G5 shots | animated shots, `build/<id>/strips/` | `npm run render:film -- <score>` + `npm run audit:motion -- <score>` + `npm run strips -- <score>` | entry/exit match; ≥3 events; no floating part; every shot's median frame-to-frame change ≥ 0.6 and no dead stretch > 0.1 s; one strip per shot every 0.5 s on one image (from the delivered MP4) | motion, editor | **measured + strips sheet** |
| G6 mix | master + `build/<id>/sfx/sfx.json` + `build/<id>/sfx/spectrogram-sheet.png` | `npm run sfx -- <score>` + `npm run mix -- <score>` | every cue generated in code from the kit and layered (transient, body, tail) over a material; a cue names its time once (typed `at`, or bound to its picture `event`, which derives it); **each cue passes the kit checks** — on a frame, ≥50% of its energy in its declared band, clean fade, longer than a click, band top ≤9 kHz, kind not on the banned list; no machine-gun repetition; voice highpassed at 75 Hz; the 1–4 kHz band ducked against the voice; one shared reverb return; tail faded; **no ticks, clicks, hats, glitches or beeps (phone-speaker rule)**; a spectrogram sheet per cue on one image; master −14.0 LUFS / ≤ −1.5 dBTP | sound, editor, QA | **master ready** |
| G7 final | MP4 + SRT + score + stills + `asr.json` + `gate-7.json` | `npm run asr -- <score>` + `npm run gate:7 -- <score>` | one frozen MP4 hash; score audit, frames, paint-match, motion floor, type safe area, rig seam, one-hash, hashed inputs, determinism, mix, palette and the final 0.5 s contact sheet all pass; ASR of the master is a hard check once its report exists, and is named as pending (with the command) until then | all seven + director | **partial** |

## Paint match

`npm run audit:paint -- <score> [--video <mp4>] [--step 1] [--min 30]` paints a
sample of times through the same path as the renderer's `--stills`, extracts the
MP4 frame at the same time and compares them with PSNR. A correct frame survives
H.264 at about 40 dB; a frame that does not match the painter lands near
10–20 dB. Luma and cut audits cannot see this class of defect — a video can be
well-formed and still contain frames the current code would never draw.

## Storyboard

`npm run storyboard -- <score> [--tile 640] [--cols 3] [--at 0.5]` shows the shots
as pictures. It paints one frame per defined shot through the same painter the
final render uses (at `--at`, the fraction through each shot), then tiles them, in
shot order, into a single sheet (`build/<id>/storyboard/storyboard.png`) with each
tile labelled `id · time range · recipe`. It cannot invent a shot: the sheet has
exactly one tile per shot in the score, nothing more, nothing less.

The sheet is an **index**, not the review. Full-resolution frames stay in
`build/<id>/storyboard/frames/`, so a tile that looks wrong is opened, not guessed
at. Because every tile comes from the same style pack and pose library, the sheet
is also the consistency check: a character or palette that drifts between shots is
visible in one glance. A whole film is judged by looking at one image.

## Motion floor

`npm run audit:motion -- <score> [--video <mp4>] [--floor 0.6]` measures the mean
absolute difference between consecutive frames inside each shot with
`tblend=all_mode=difference`. A slideshow shot sits near 0.2; an acted shot sits
well above the floor. It reports a median and the longest dead stretch per shot
and writes `motion-audit.json`, tied to the video hash it measured. This is the
number behind "no dead middles".

## Stepped rough

`npm run rough -- <score> [--fps 10] [--floor 0.6]` is G3's second pass, after the
board pass. It paints the score through the same painter as the final render
(three-frame holds at 10 fps), then pairs every board time with its rough frame, so
a card and its acted frame sit side by side on one contact sheet
(`build/<id>/rough/contact-sheet.png`). It burns the captions from the score, muxes
the mix, and measures each shot's frame-to-frame change the same way
`audit:motion` does. `build/<id>/rough/rough.json` fails if any board time is
unpaired, any shot's median change is below the floor, any hold runs past 0.4 s, or
a shot carries no event except a camera move. This is a board pass with the cast on
screen; the look pass is still to come.

## Type safe area

`npm run audit:type -- <score> [--step 0.5] [--margin 0.06]` paints sampled times
through the renderer with `src/engine/paint-probe.js` attached. The probe records
the box of every text run a frame draws, mapped through the canvas transform, so
a label on a rotated sticker is measured as the rectangle it covers. The safe
margin is read from the style pack (`tokens.json` `layout.safeZones`, e.g.
`title-safe 6 percent`), so a film inherits it and never hardcodes a number. A
box more than 1 px outside the safe rectangle fails `type-audit.json`.

## Rig seam

`npm run audit:rig -- <score> [--step 0.5]` wraps `solveLeg`, `limb` and
`drawCharacter` so every painted frame reports its leg solves and the two limb
segments each solve drew. It checks, per leg:

1. the drawn thigh and shin are the lengths the solver used;
2. the knee is a seamless joint;
3. the drawn ankle lands on the pose's foot target (within 3 px);
4. the knee bends and bends the way its side owns (a sign flip is a backwards
   knee), between 0.03 and 2.6 rad;
5. no ankle teleports between adjacent samples.

`test/cast-rig.test.ts` proves the same reachability statically, in a second,
without a browser, so bad pose data fails before a render.

## Current audit

`npm run audit -- films/understudy/score.json` checks:

- every shot event, narration line, caption and SFX cue on the frame grid;
- caption count, read-time holds and SRT cue count;
- the score-level contracts (brief, audio, assets, poses, shots).

The report counts **events** (what the picture declares) and **cues** (what the
audio plan asks for) separately: one event usually has a cue, but not every
event does, and a number that conflates them hides the gap.

It does **not** check rendered frames, ASR or mix. Those are G5–G7. The
mechanical parts of G7 that are not score-level are their own commands:
`audit:motion` (motion floor), `audit:type` (safe area) and `audit:rig` (rig
seam). ASR is `npm run asr`, a hard check once its report exists.

`npm run film:review` chains the whole set for one film and prints one page. It
hides no failure: every step runs even after one fails, and a row is only
summarised from a report **this run wrote**. A failed step shows its own error
line, never last week's "ok" next to today's FAIL, and what was not run is
printed as skipped.

The render manifest hashes the score, the generated score data, the style
backend (`styles/<style>/canvas/recipes.js`), the film page, the captions, the
vendor scripts and **each cast pose library**. A pose edit is a film change, so
it invalidates the manifest the same way a code edit does; `gate-7.json` checks
the pose hashes with the `poseHashes` row.

## Voice and ASR

`npm run voice -- <score>` captures the narration and derives the clock from the
actual read:

1. **Capture** is `recorded` (a supplied file, used as-is) or `tts` with a
   **provider** — `kokoro` locally, or `elevenlabs` fetched **once** at authoring
   time and pinned as a WAV. The render never touches the network. The spoken WAV
   is kept unless `--force` is passed.
2. **Listen.** Local Whisper (`faster-whisper small.en`) writes what it heard.
   `src/engine/words.ts` attaches those times to the **script's own spelling**, so
   "nineteen nineteen" is timed as the script's "1919" — matched words keep their
   heard span, a split or merged run shares the span by length, a missed word
   shares the gap between its neighbours. It writes `films/<id>/words.json`.
3. **Derive.** `build/<id>/clock.json` holds the line clock and the shot
   boundaries a snap to a phrase beat would move. It is a **proposal**; the score
   is not rewritten — the director edits it to accept a move.

The speech tools are external and pinned like `ffmpeg`; `tools/README.md` has the
one-time install. When a module is missing, `npm run voice` and `npm run asr`
print the exact install and exit without touching the network.

`npm run asr -- <score>` listens to the delivered master with the same Whisper,
compares what it heard to the script and writes `build/<id>/asr.json` with the
coverage and every word it did not hear. `gate:7` reads that report: it is a
**hard check** when the report exists and is **named as pending**, with the
command, until it does.

## SFX kit

`npm run sfx -- <score>` renders every cue from `src/engine/sfx.ts`. A cue is a
shape over a **material** (paper, wood, glass, metal, stone, cloth), built from
layers:

- `transient` — the first 20 ms of a hit;
- `body` — the material's modal bank, a whoosh, a hum, friction, a sweep, a
  sparkle or a settle;
- `tail` — the decay and the air around it.

The render is **dry** and deterministic: same kind + same id = same samples. The
mix owns the one shared reverb return (`send`) and the duck (`duckDb`). The kit
is also the single source for a kind's `send`, `duckDb` and **band** — `mix.ts`
reads the same table, so a cue cannot be placed differently by the two commands.

A cue names its time **once**:

```json
{ "id": "sfx-iris", "kind": "iris", "event": { "shot": "s03", "index": 2 } }
```

The time is the shot's start plus the event's offset, **snapped to the frame
grid**, so re-timing a shot moves its foley with it and the cue still starts on a
frame. `at` is still valid for a cue that is not tied to a picture event; naming
both, or neither, is a contract error.

A kind must exist in the kit. A typo (`"thunder"`, `"smap"`) is a contract error
at resolve time (`sfx_kind_unknown`), and the renderer refuses it rather than
falling back to a generic paper thud: a sound you did not ask for is a worse
failure than a red row.

Every cue is checked mechanically and the command exits non-zero if one fails:
it is on a frame, at least half its energy is in its declared band, the top of
the band is ≤9 kHz (the phone-speaker rule), it lasts longer than a click, it
fades out clean, and its kind is neither banned (`tick`, `click`, `hat`,
`glitch`, `beep`, `blip`, `buzz`) nor unknown. The results are in
`build/<id>/sfx/sfx.json`; the one-image review is
`build/<id>/sfx/spectrogram-sheet.png`.

Each record in `sfx.json` carries a **spec** fingerprint (kind, time, length,
layers, gain, pan, band) and the **sha256 of its WAV**. `npm run mix` recomputes
the fingerprint and hashes the file it is about to mix: if the score moved after
`npm run sfx` — a different kind, gain or time — the mix stops and says to re-run
sfx, instead of mixing yesterday's take. The mix report records `inputs.score`,
`inputs.sfx` (a fingerprint of the whole cue set) and `inputs.voice`, and
`gate:7` refuses a mix whose inputs do not describe the current score, cue set
and master.

## Sheets (one look)

Every batch of pictures is reviewed **on one image**, never file by file. One
helper, `src/engine/grid.ts`, tiles labelled images; every command that produces
N pictures uses it. A sheet is a **review artifact**: it lives under `build/`, is
gitignored, and **never enters a render manifest or a frame hash**.

Two rules keep a sheet honest:

- **Chrome is neutral.** A sheet's page, panel, border and label colours come
  from `REVIEW_CHROME` in `grid.ts`, never from a pack's palette. The pack's
  colours appear only where the pack's own value is being shown — a swatch, a
  font specimen — so two packs are told apart by the work, not the furniture.
- **Type comes from the pack.** A label font is named by the caller from the
  pack's `tokens.json` (`packFontPath`); the engine hardcodes no face and no
  script borrows one from a sealed `proofs/` directory.

| Sheet | Command | Gate |
|---|---|---|
| board sheet | `npm run board -- <score>` | G2 |
| storyboard | `npm run storyboard -- <score>` | G2 |
| style sheet | `npm run style:sheet -- <pack>` | G-sheet, pack review |
| per-shot strips (every 0.5 s) | `npm run strips -- <score>` | G5 |
| spectrogram, per cue | `npm run sfx -- <score>` | G6 |
| final 0.5 s contact sheet | `npm run gate:7 -- <score>` | G7 |

A gate is only real if a command proves it. Every sheet in this table now exists:
the board sheet and storyboard (G2), the derived style sheet, the stills sheet,
the per-shot strips (G5, read from the delivered MP4), the per-cue spectrogram
sheet (written by `npm run sfx`) and the final contact sheet (written by
`npm run gate:7`).

## Rule

A failed gate writes the failure and sends the film back one step. “Almost” is a
no. The director signs only after the full panel at G7.

ASR is no longer a missing command: step 10 built it (`npm run asr`), and it is
the only G7 row that is still **pending** on this machine, because the local
speech model is not installed yet. The gate reads the report when it exists and
names the command when it does not; it never passes the row by silence. See
`docs/decisions/0016-voice-and-asr.md` and
`docs/decisions/0017-review-surface-audio-and-sheets.md`.

**Banned vs allowed, stated once.** Banned: generative **images or video** in the
render path, and per-film LLM-written animation code. Allowed: local models for
**voice, word timing and music** (Kokoro, Whisper, ACE-Step), because the picture
stays entirely code-drawn from the score (decision 0017).
