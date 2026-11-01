# Gates

A gate is a command plus an artifact plus a pass condition. If it cannot be
checked, it is not a gate. **Current status is marked.** No gate may pass on a
warning.

| Gate | Artifact | Command | Pass condition | Critics | Status |
|---|---|---|---|---|---|
| G0 brief | `brief.json` | `npm run film -- <score>` | fields complete; style, aspect, duration, fps and audio mode match the score | architect, editor | ready |
| G1 audio | voice, `transcript.json`, `captions.srt`, cue list | `npm run voice -- <score>` + `npm run captions -- <score>` | files exist and hash; word times come from the actual read (`words.json`), not a guess from word length; transcript covers the script; SRT cues match; read-time holds | editor, sound, QA | **partial** — `words.json` needs the local Whisper install; until then `transcript.json` says `source: "guess"` and the ASR row is the one manual check |
| G2 direction + look | score, `build/<id>/board/`, `build/<id>/board/board-sheet.png`, `build/<id>/storyboard/storyboard.png`, hero frames | `npm run board -- <score>` + `npm run storyboard -- <score>` | all shots inside the envelope; median in band; board covers every shot and marked beat; the board sheet shows every card on one image; the storyboard shows one code-drawn frame per shot, in order, on one sheet; look table complete | designer, editor | ready |
| G3 animatic | board pass + stepped rough | `npm run animatic -- <score>` + `npm run rough -- <score>` | board pass signed 9/10; stepped rough paints the score at 10 fps; every board time paired to its frame; every shot's median frame-to-frame change ≥ 0.6 and no hold >0.4 s; no camera-only shot; ≥2 breakdowns per transition | motion, editor, QA | **board pass signed; stepped rough measures pass** |
| G4 assets | `build/<id>/sheets/*.png` | `npm run sheet -- <score>` | seam gap 0; feet planted; contact shadow; 8 poses + 4 expressions; joint map; hand/foot/coat panels | designer, developer, QA | ready |
| G5 shots | animated shots, `build/<id>/strips/` | `npm run render:film -- <score>` + `npm run audit:motion -- <score>` + `npm run strips -- <score>` | entry/exit match; ≥3 events; no floating part; every shot's median frame-to-frame change ≥ 0.6 and no dead stretch > 0.1 s; one strip per shot every 0.5 s on one image (from the delivered MP4) | motion, editor | **measured + strips sheet** |
| G6 mix | master + `build/<id>/sfx/sfx.json` + `build/<id>/sfx/spectrogram-sheet.png` | `npm run sfx -- <score>` + `npm run mix -- <score>` | every cue generated in code from the kit and layered (transient, body, tail) over a material; a cue names its time once (typed `at`, or bound to its picture `event`, which derives it, snapped to the frame); **each cue passes the kit checks** - on a frame, ≥50% of its energy in its declared band, ≥60% at or above 200 Hz where a phone speaker lives, clean fade, longer than a click, band top ≤9 kHz, kind not on the banned list, and **its loudest 50 ms at the kit's level** (a cue whose gain is not its only level fails); no machine-gun repetition (any two cues of one kind may not overlap or restart within 0.3 s); **every picture event is scored or says why it is quiet** (`quiet: "<why>"` on the event — an event with neither a cue nor a reason, an event with both, an event with no cue and no reason, a cue overlapping a declared silence, a declared silence with narration over it, a hole over 2.5 s with no reason, or a cue inside the master's tail fade is an error); **each declared silence is measured on the master** (peak ≤ -50 dBFS); the mix bus is highpassed at 75 Hz and peaks at ≤ -1 dBFS; the 1-4 kHz band is ducked against the voice **and the duck the bus applied is the depth the score declared**; one shared reverb return; tail faded to silence and **measured as a monotonic slope to ≤ -60 dBFS**; **no ticks, clicks, hats, glitches or beeps (phone-speaker rule)**; a spectrogram sheet per cue on one image, each tile labelled with its measured level; master -14.0 LUFS / ≤ -1.5 dBTP from one gain and a true-peak limiter, **and the report says what the limiter took** (`limiterGainReductionDb` at the loudest sample, plus the same reduction as a distribution over 100 ms windows) | sound, editor, QA | **master ready** |
| G7 final | MP4 + SRT + score + stills + `asr.json` + `gate-7.json` | `npm run deliver -- <score>` + `npm run asr -- <score>` + `npm run gate:7 -- <score>` | one frozen **picture** hash, and the delivered file's own audio measured inside -1.5 dBTP (not the master's); score audit, **the page's score data regenerated from the score**, frames, paint-match, motion floor, type safe area, rig seam, one-hash, hashed inputs, determinism (two renders, same bytes and same picture), mix, duck, cue levels, silence, undeclared holes, a room bed under a line, tail, palette **and clipping over every frame**, and the final 0.5 s contact sheet all pass; the frame audit must also find the picture **described by the render's own manifest** (the renderer writes it, the audit never does); ASR of the master is a hard check once its report exists, and is named as pending (with the command) until then | all seven + director | **partial** |

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
a label on a rotated sticker is measured as the rectangle it covers — and a
moving label is measured **while it moves**, so an entry that overshoots the
frame is a finding, not a style. The safe margin is read from the style pack
(`tokens.json` `layout.safeZones`, e.g. `title-safe 6 percent`), so a film
inherits it and never hardcodes a number. A box more than 1 px outside the safe
rectangle fails `type-audit.json`.

It also holds the film's copy to the pack's floor: a run the painter marks
`copy: true` must be drawn at or above `type.scale.label` scaled to the frame
(14 px at the pack's 390 px authoring width → 69 px at 1,920). The mark is
cross-checked against the score, so a marked run must be a piece of that shot's
slot text and a shot with slots must show a marked run. `films/understudy` at
`--step 0.2`: 151 frames, 348 boxes, 257 of them copy, none outside, none under
the floor.

## Rig seam

`npm run audit:rig -- <score> [--step 0.5]` wraps `solveLeg`, `limb`,
`rigAnchor` and `drawCharacter` so every painted frame reports its leg solves,
the two limb segments each solve drew, and where each rig hung the chest, the
head and the hair. It checks, per leg:

1. the drawn thigh and shin are the lengths the solver used;
2. the knee is a seamless joint;
3. the drawn ankle lands on the pose's foot target (within 3 px);
4. the knee bends and bends the way its side owns (a sign flip is a backwards
   knee), between 0.03 and 2.6 rad;
5. no ankle teleports between adjacent samples.

And, per character:

6. every anchored part keeps a fixed place **in chest space** (1.5 rig units).
   This is the row a still cannot fake. The long hair was drawn at the rig root
   instead of under the head, so it kept the upright head's position: on a bow
   the face travelled ~95 units and left a vertical black slab behind it, which
   read as a detached head. Every still that checked the head *alone* passed,
   and the pixel audits passed, because nothing in the frame was missing — it
   was in the wrong place.

`npm run audit:rig:proof` is the proof that row 6 works: it puts the long hair
back at the rig root, paints the bow at the audit's own 0.1 s step, and measures
both. On the old placement the hair sits at `(-105.1, -582.7)` in chest space
and moves **96.9 units in one step** at 25.0 s; on the fixed rig it sits at
`(0.0, -604.0)` and moves **0.0**. The command restores the rig byte-identically
(`sha256:fd660e88...`) in a `finally`, so it is safe to run on a clean tree.

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
`audit:motion` (motion floor), `audit:type` (safe area **and the copy floor**),
`audit:rig` (rig seam) and `audit:palette` (**palette and clipping, every
frame**). ASR is `npm run asr`, a hard check once its report exists.

`audit:type` answers two questions, not one. Every box the frame drew must sit
inside the pack's title-safe rectangle, **and** every box that is the film's own
copy — a string the score puts in that shot's slots, or a wrapped piece of one —
must be drawn at or above the pack's `type.scale.label` floor scaled to the frame
(14 px at the pack's 390 px authoring width). Set dressing a rig draws, such as a
costume name tag, is exempt: it is not a sentence the viewer has to read, and
holding it to the copy floor would fail every character that wears a label. The
probe box's height is the em size the frame actually drew, so the check cannot be
satisfied by reporting a size in a comment.

Two of those read every frame and two read a sample, and the difference is not
hidden. `audit:frames` and `audit:palette` decode all 900 frames of the delivered
file — blank frames, cuts, holds, hue outliers and clipping are counted per frame.
`audit:type` and `audit:rig` need the *live* page, not the pixels: the text boxes
and the IK solve only exist in the composition, so those two paint sampled
instants in the same Chrome path the renderer uses. They are stronger than a pixel
read for what they measure (a box is measured in layout units, an ankle as a
solved target) and weaker in coverage (a sample at `--step`, not 900 frames). Both
facts are in their reports: `sampled`, `step`, and the probe's own hash.

`npm run film:review` chains the whole set for one film and prints one page. It
hides no failure: every step runs even after one fails, and a row is only
summarised from a report **this run wrote**. A failed step shows its own error
line, never last week's "ok" next to today's FAIL, and what was not run is
printed as skipped. The chain is `audit → board → storyboard → sheet → sfx → mix →
strips →` (with `--gate`) `frame-audit → paint-match → motion-audit → type-audit →
rig-audit → deliver → gate:7`: `mix` comes after `sfx` because `sfx` rewrites every
cue WAV, and `deliver` comes after `frame-audit` because the audit proves the
delivered picture is the render's (the manifest check) and `deliver` is what puts
the measured audio into the manifest.

**The render writes the manifest, because only the render knows.** The manifest
hashes the score, the generated score data, the style backend
(`styles/<style>/canvas/recipes.js`), the painter, the film page, the captions,
the vendor scripts and **each cast pose library** — and it is `render:film` that
writes it, at encode time (`src/engine/manifest.ts`). A pose edit is a film
change, so it invalidates the manifest the same way a code edit does.

This ownership is the point. `audit:frames` used to *write* the manifest from the
files on disk at audit time, which meant a painter edited after a render was
recorded beside a picture it never touched — every hash agreeing, the central
claim unchecked. Now the audit **reads** the manifest and fails
(`describedByRender`) when the video it measured is not the picture the render
named; `npm run deliver` refuses a source picture the manifest does not describe;
and at gate time the `inputsHashed` row re-hashes **every** input the manifest
names — score, generated page data, backend, painter, page, captions, every
vendor script, every font the page declares and every pose library — so "the code
that painted this frame is still the code on disk" is a checked statement rather
than a note. It is one rule (`inputMismatches`), so the gate and its test walk the
same flat list. `audit.json` carries the hash of the score it audited, and the
`scoreAudit` row requires it to be the current score.

**The page's data is regenerated, not trusted.** The renderer paints from
`films/<id>/score-data.js`, not from `score.json` — so that file is generated by
`npm run embed` from one function (`src/engine/score-data.ts`), and the
`scoreData` gate row regenerates it and compares byte for byte. Understudy had
shipped one stale: the score had gained five `quiet` reasons and the cue → event
bindings, and the page was still painting the older plan. Nothing looked wrong in
any report, because no report was about that file. Now one is: a score edited
without re-embedding, or a hand-edited page, fails the gate and names the command
that fixes it.

**Render the deliverable last.** The manifest names the file the render wrote, and
one film has one manifest, so the last render to run is the one the film ships
with:

```bash
npm run render:film -- films/understudy/score.json --out build/understudy/det.mp4   # the determinism copy first
npm run render:film -- films/understudy/score.json                                   # then the deliverable
node scripts/compare-renders.mjs films/understudy/understudy.mp4 build/understudy/det.mp4
```

The other order works — the picture hash is the same either way — but then the
manifest names `build/understudy/det.mp4` while the film ships
`films/understudy/understudy.mp4`, which is a true statement about the wrong file.

## Picture and container are two hashes

`videoHash` is **sha256 over the video stream**, not over the MP4 file. The film
ships as an audio re-cut over a frozen picture: the look pass changes the master,
and a picture hash that moved every time a fade moved would invalidate every
frame audit for a change not one of them measured. The stream hash is taken over
copied packets, so it is instant and survives a re-mux. The container hash is
recorded beside it (`videoFileHash` in the manifest) because the file is what
ships.

`npm run deliver -- <score>` is the step that makes the deliverable:

```bash
npm run mix -- films/understudy/score.json       # measure the master
npm run deliver -- films/understudy/score.json   # mux it into the picture, measure the file
```

It copies the video stream (no re-encode), encodes the master to AAC beside it,
and then **measures the delivered file's own audio**. That last part is why the
step exists: the AAC encoder overshoots the master's true peak. Understudy
measures -1.9 dBTP on the master, which arrives in an unprocessed file at
**-0.6 dBTP** (1.3 dB of overshoot) — inside the mix contract, outside the
delivery contract.

The first fix was a gain walk, and it was the wrong knob: turning the file down
to fit the peak took the film to -15.3 LUFS, outside -14 ± 1. The overshoot is a
*peak* problem, so the encode carries a **peak limiter** instead: `alimiter`
starting at -2.5 dBFS, tightened by the measured overshoot, floored at -6 dBFS,
touching only the loudest samples. Understudy lands at **-14.4 LUFS / -1.9 dBTP
in one pass**, and `deliver.json` records the limit, the passes, the file hash,
the picture hash and the measurement. `render-manifest.json` gets the same block,
so the manifest's `audio` is the audio that shipped instead of `null`. When the
peak fits and the loudness does not, the step **stops and reports a `conflict`**
rather than trading one bound for the other.

`gate:7` reads that block as the `deliveredAudio` row: the delivered file's hash
must match `deliver.json`, its picture must be the frozen one, and its measured
true peak and loudness must sit inside the delivery bounds.

## Voice and ASR

`npm run voice -- <score>` captures the narration and derives the clock from the
actual read:

1. **Capture** is `recorded` (a supplied file, used as-is) or `tts` with a
   **provider** — `kokoro` locally, or `elevenlabs` fetched **once** at authoring
   time and pinned as a WAV. The render never touches the network. The spoken WAV
   is kept unless `--force` is passed. A line is placed at the **second the
   score's clock gives it**; the capture pads silence to that second and refuses
   when a read would run past the next line's start. Without this the read is
   butted end to end, and a film whose clock spreads six lines over twenty
   seconds gets a voice that says them all in fourteen: the captions then name
   seconds the voice never occupied, and every audit passes, because the audio is
   present, audible and correctly spoken.
2. **Listen.** Local Whisper (`faster-whisper small.en`) writes what it heard.
   `src/engine/words.ts` attaches those times to the **script's own spelling**, so
   "nineteen nineteen" is timed as the script's "1919" — matched words keep their
   heard span, a split or merged run shares the span by length, a missed word
   shares the gap between its neighbours. It writes `films/<id>/words.json`.
3. **Derive.** `build/<id>/clock.json` holds the line clock and the shot
   boundaries a snap to a phrase beat would move. It is a **proposal**; the score
   is not rewritten — the director edits it to accept a move.
4. **Check the clock, on the audio.** For each authored start the WAV is scanned
   for the first sample above −40 dBFS within ±0.25 s, and the drift must be
   within **0.1 s** (`voice.json` → `clock`, `checks.clock`). The measurement is
   on the samples rather than on Whisper's word onsets because those wobble: on
   Understudy the read that starts at 0.50 s measures 0.53 s, and Whisper dated
   its first word at 0.18 s. Measured on the audio the worst line is **+0.03 s**;
   measured against the recogniser it was −0.32 s, which is the recogniser, not
   the film. Coverage answers "are these the script's words"; the clock answers
   "are they where the score says". They are different questions and both are
   now asked.

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
it is on a frame, at least half its energy is in its declared band, at least 60%
of its energy is at or above 200 Hz (where a phone speaker lives — measured with
a four-stage highpass, because a one-pole filter passes most of an 80 Hz thud and
would let the one check written to stop it through), the top of the band is
≤9 kHz, it lasts longer than a click, it fades out clean, and its kind is neither
banned (`tick`, `click`, `hat`, `glitch`, `beep`, `blip`, `buzz`) nor unknown.

Two rules beyond the single cue:

- **One loudness rule, on the loudest moment.** Every cue's loudest 50 ms is set
  to `CUE_LOUD` (0.2, −14 dBFS), then a soft knee (0.8) and a hard peak limit
  under 1 keep the strike under the ceiling. A cue's `gain` in the score is then
  the only level that matters: a 900 ms sweep and a 140 ms snap hit at the same
  level, and a 30 ms hit is not 13 dB quieter than the bed beside it. Whole-cue
  RMS was the first attempt and it was wrong for sparse cues — a hit that decays
  in a third of its length reads quiet, the peak limit ate up to 11 dB of it, and
  the cue's `gain` stopped being its level. `checkCue` therefore also fails a cue
  whose loudest moment sits more than 2 dB under the kit's level: a gain is not
  the only level if the renderer made it quieter.
- **No machine-gun.** `checkCueSet` fails when **any two** cues of one kind
  overlap or start within 0.3 s of the previous one ending (`sfx_repeat`). It
  compares all pairs of a kind, not adjacent rows in a sorted list: a third kind
  between two `crowd` cues used to hide the repeat. Three crowd cues in eight
  seconds read as a stutter, not as a crowd.

## Silence is contract surface

A hole in the foley is either a decision or a defect, so the score has to say
which. Two different declarations cover two different things:

- **A declared silence** is a claim about the *master*: this window carries
  nothing at all. `"silences": [{ "from": 19.55, "to": 19.85, "why": "..." }]`
- **A quiet event** is a reason on the *event*: the picture has a beat here and
  the film deliberately makes no sound for it. `"quiet": "the line carries the
  beat"` on the event itself, because a window of time cannot say why that beat
  is quiet.

`npm run audit` reads both against the picture and the cue sheet, and each of
these is an **error**, not a warning:

| code | what it catches |
|---|---|
| `sfx_unscored` | a picture event with no cue and no `quiet` reason |
| `sfx_quiet_scored` | a picture event with both a cue and a `quiet` reason |
| `sfx_in_silence` | a cue that overlaps a declared silence (starts in it *or* rings through it) |
| `silence_over_voice` | a declared silence with a narration line running through it |
| `sfx_gap` | more than `MAX_GAP` (2.5 s) with no foley and nothing to explain it |
| `sfx_tail_fade` | a cue that starts inside the master's 0.5 s tail fade |
| `sfx_no_duck` | a cue that plays under a spoken line and carries no `duckDb` |

The resolver checks the shape of a silence as well: it must end after it starts,
stay inside the film, last at least 0.3 s (shorter reads as a mistake, not a
beat) and not overlap the one before it (`silence_order`, `silence_outside`,
`silence_short`, `silence_overlap`). The report says how the film is covered:
`events`, `scored`, `bare` (deliberately quiet), `silences`, `longestHole`. The
Understudy fixture is 32 events, 27 scored, 5 bare, **2 silences**, longest hole
1.07 s — the earlier list named five windows, three of which carried narration or
a reverb tail; the audit now reads the voice, so those are gone rather than
declared.

The results are in `build/<id>/sfx/sfx.json`; the one-image review is
`build/<id>/sfx/spectrogram-sheet.png`. A spectrogram normalises its own colour
scale, so each tile's label carries the cue's **measured level**: the picture
shows the footprint, the label shows how loud it is.

Each record in `sfx.json` carries a **spec** fingerprint (kind, time, length,
layers, gain, pan, band) and the **sha256 of its WAV**. `npm run mix` recomputes
the fingerprint and hashes the file it is about to mix: if the score moved after
`npm run sfx` — a different kind, gain or time — the mix stops and says to re-run
sfx, instead of mixing yesterday's take. The mix report records `inputs.score`,
`inputs.sfx` (a fingerprint of the whole cue set) and `inputs.voice`, and
`gate:7` refuses a mix whose inputs do not describe the current score, cue set
and master.

## The mix and the master

`npm run mix -- <score>` sums the cue WAVs and the voice on one bus and masters
the result. The bus does five things, all fixed:

- the voice is highpassed at 75 Hz (a phone cannot reproduce a rumble, and the
  headroom it eats is what clips the mix);
- cue energy in the 1–4 kHz band is ducked against the voice, by the cue's own
  `duckDb`, so a hit does not sit on top of a word;
- one shared reverb return (`send`) takes every cue that asks for a room;
- the last 0.5 s fades to silence, so the film ends rather than stops;
- **the bus is turned down if it peaks over −1 dBFS** (`PREMASTER_CEILING`,
  reported as `bus.headroomDb`). A premaster over full scale is a badly staged
  mix whatever float arithmetic allows: the master's gain would be a repair, and
  the file would not survive being written as 16-bit. The stage only ever turns
  the bus down — a quiet mix is not rescued here, it is a mix to fix.

**A cue's band is two unity edges, and its level is put back afterwards.** The
bus used to place a cue with one resonant bandpass centred on `sqrt(lo·hi)`; a
`[200, 9000]` cue lost 1–3.4 dB at its own loudest moment, so the score's `gain`
stopped being the level the cue reached in the film. The band is now a highpass
at `lo` and a lowpass at `hi`, both at unity inside the band, and the bus then
**re-levels** each cue to `20·log10(CUE_LOUD · gain)`. The mix report's
`cueLevels` row fails if any cue's loudest 50 ms lands more than 1 dB off its own
level.

**The duck is measured, not declared.** The sidechain used to be the voice
envelope normalised by the film's single loudest sample; only 257 ms of a 29.5 s
take reach that peak, so an 8 dB declaration arrived as ~2.6 dB at the hit it was
written for. The key is now a **presence gate on a local reference** — the
voice's own presence within ±1 s — and the mix report names, per cue, what it
applied (`appliedDb`), where (`at`), and how the cue sat against the word
(`overVoiceDb`, averaged over the words the cue shares). `npm run mix` fails a cue
that did not reach its declared depth, or one that sits above the voice in 1–4 kHz.

The master is **one measured gain and a true-peak limiter**. It runs no
normaliser over the programme. The gain is measured, not chosen: each pass adds
the residual the last render missed, because the limiter takes back part of every
increase. The limiter holds the sample ceiling at −2 dBFS so the true peak lands
under −1.5 dBTP. Two bounds keep the master honest and the mix is where a film
past them gets fixed:

| bound | value | why |
|---|---|---|
| `MASTER_MAX_GAIN` | 8 dB | a film needing more to reach −14 is a quiet mix |
| `LIMITER_MAX_REDUCTION` | 8 dB | past this the master is squashing the film, not mastering it |

**The report says what the limiter took, twice.** `limiterGainReductionDb` is the
reduction at the loudest sample; `limiterWindows` is the same measurement
distributed over 100 ms windows (`p50`, `p90`, `p99`, `max`, `over3Db`,
`windows`). One number alone cannot be read: a single clamped hit and a squashed
programme look identical. Understudy reads −14.1 LUFS / −1.9 dBTP, gain +6.6 dB,
6.8 dB off the loudest sample — and a **median window of 0.02 dB**, with 33 of
293 active windows over 3 dB. The peak is the top ~1% of the film, not the film.
`gate:7` refuses a master row with no `limiterWindows` at all: a missing
distribution is not a median of zero.

That distribution is arithmetic, not a defect. A −14 LUFS delivery leaves 12.5 dB
between the programme's loudness and the −1.5 dBTP ceiling. Understudy's hits
reach ~16 dB over its loudness, so something has to give: the top ~11% of active
windows hand back up to ~6 dB, and the median window is untouched. Reading the
median next to the peak is how the report distinguishes that from damage.

Both peaks come from `ebur128=peak=true` (`src/engine/loudness.ts`, the one place
either script measures). `volumedetect` clamps its samples to 16-bit and reports
a signal lifted over 0 dBFS as 0 dB, so a reduction measured with it reads as a
fraction of what it is — the earlier "+2.0 dB off the loudest sample" was that
clamp, not the limiter.

`gate:7` reads the master's row against the same bounds and refuses a report that
claims to be inside them while a window median says otherwise.

**Silence and the tail are measured on the master.** `npm run mix` reads back the
file it wrote and reports `silence.windows` (each declared window's peak, against
−50 dBFS) and `tail` (the last 0.5 s as a 50 ms slope: `fromDb`, `endDb`,
`monotonic`, against −60 dBFS). A declared window that carries sound, or a tail
that rises, fails the run — the declaration is a claim about the file, and only
the file can settle it.

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
the last G7 row to become a hard check. The local speech model (faster-whisper
`small.en`) is installed, `npm run asr` hears the delivered master at 93 % of the
script and writes `asr.json` with the audio hash **and** the picture hash it
listened to, and the gate refuses an ASR report about any other cut. When the
report is absent the gate names the command and does not pass the row by
silence. See `docs/decisions/0016-voice-and-asr.md` and
`docs/decisions/0017-review-surface-audio-and-sheets.md`.

**A hole in the foley is a decision or a defect.** The mix measures the windows
the score declares silent (`silence`), and it also measures the other direction:
any 0.15 s or more at or under −50 dBFS that the score did **not** declare
(`undeclaredHoles`), and any room bed that stops while a line is still being
spoken (`roomUnderLines`). Both fail the mix and therefore the `mix` row. A cut
that loses its foley for 270 ms is the kind of defect no picture audit can see
and no one hears as a decision.

**Banned vs allowed, stated once.** Banned: generative **images or video** in the
render path, and per-film LLM-written animation code. Allowed: local models for
**voice, word timing and music** (Kokoro, Whisper, ACE-Step), because the picture
stays entirely code-drawn from the score (decision 0017).
