# Production plan — one 9/10 film, repeatable

**Status:** v1.2, after a fourth review, 2026-10-29
**Goal:** one 30 s paper film at a 9/10 bar, then repeat without broken frames or
timing drift.

**v1.2 restores two things v1.1 under-specified:** a real **storyboard
sequence** (one frame per shot plus key beats, reviewed as a contact sheet) and
**code-generated SFX** (no sample library). It also adds **ASR, readcheck and
motioncheck** to the audit, **contact-sheet reviews** during animation, and a
**sound designer/mixer** as the seventh critic.

This plan amends decision 0012. Where 0012 and this file disagree, this file wins
and 0012 is updated in the same commit.

## The bar

A film ships only when:

- the **direction** reads as a film, not a deck;
- the **animatic** has no dead timing and every cut lands on its cue;
- the **cast** is correct (joints, proportions, contact, expressions);
- every **shot** has entry, development, beat and exit;
- every **frame** passes the audit (no seam, blank, clip, palette or type fault);
- the **mix** is clean (−14 LUFS, voice ducking, designed silence);
- the **critics** pass it against the anchors and the director signs.

A failed gate sends the film back one step.

## Principles

1. **Film first, system second.** Build only what the pilot needs. Extract the
   library and the second style after the pilot ships.
2. **Direction is prose plus a board.** The score's shot rows carry the
   direction; the board is one frame per shot plus key beats, reviewed as a
   sequence. A 30 s film needs about 13 frames, not three and not a hundred. The
   board is not a storyboard farm.
3. **One clock.** The audio spine drives every cut, caption and event.
4. **One score.** Shots, direction, events, captions, audio cues and assets live
   in one file the renderer reads. No second contract.
5. **No hand-authored frames.** Named poses and events on a track; the engine
   interpolates. Characters at 8–12 fps; camera and light at 30 fps.
6. **Assets are per film.** Reuse by pinned hash; create what the film needs; no
   library product until three films ship.
7. **One accent, one signature.** Paper K-pop: paper, ink, red, blue; gold only
   on the title and sticker. Signature: the sticker slam. Transition: iris.
8. **Determinism and audit are non-negotiable.**

## The seven critics

Fixed roster; the relevant subset reviews at each gate, the full panel at Gate 7.
The director has the final call; no agent overrides taste.

| Critic | Owns | Blocking authority |
|---|---|---|
| Architect | score contract, engine/backend boundary | structural violation |
| Senior developer | rig, code, tests, determinism | broken implementation |
| Designer / DOP | look, composition, light, palette, type | visual defect |
| Motion director | performance, choreography, camera | broken or dead motion |
| Editor | shot rhythm, transitions, sync | pacing or sync failure |
| Sound designer / mixer | SFX design, layers, space, mix | bad or missing sound |
| QA / UAT | every gate, audit, evidence, claims | any failed check |

## The process

### Step 0 — Brief

**Output:** `films/<id>/brief.md` — topic, audience, length, format, style,
audio mode, references, must-say points.
**Gate 0:** complete fields; format legal; audio mode declared.

### Step 1 — Script, voice, transcript, SRT

**Output:**
- `script.md`;
- `voice.wav` — recorded scratch or local TTS, pinned by hash;
- `transcript.json` with word timings;
- `captions.srt` generated from the transcript;
- the clock: narration phrase marks (pilot), BPM if music is chosen, or SFX hits;
- the SFX cue list.

**Gate 1 (binary):** voice file present and hashed; transcript covers every word;
SRT lines match the script; total voice 28.5–29.5 s inside a 30 s film; every cue
holds at least `max(1.8 s, speech + 0.6 s)`; peak below −1 dBFS. No music in the
pilot.

### Step 2 — Direction, look, score

**Output in `score.json`:**
- 9 shot rows: role, recipe, start, duration, slots, entry pose, exit pose,
  action spine, at least three timed events (one after the first third), camera,
  transition in/out, caption;
- **look table**: four palette roles per shot, one key-light angle, shadow mode,
  material spec (stock, grain, bevel, torn vs die-cut), type sizes, safe zones,
  accent count;
- **poster frame**: design shot 8 (the duet) first; shots 3 and 7 are crops or
  moves inside it;
- **storyboard**: 9 shot frames plus 4 inserts (sticker slam, duet, iris, the
  shot-6 lamp) = **13 frames**, each rendered from the score at its poster
  moment, assembled as a contact sheet in order; 1920, plus a 390 px legibility
  check of the title and caption;
- **five hero frames** cut from the board: title, wings, sticker, duet-poster,
  close, for look approval at 1920;
- reference board: `papercut-red`, `paper-popup`, `spy-titles`; steal/refuse notes.

**Gate 2:** 9 shots; median 3.0 s ±25%; every recipe inside min/max (stage_wide
is 3.4–5.5, not 1.2); every field present; **13-frame board reads in order**;
five hero frames at 1920 plus the 390 check; look table complete; four roles max;
one accent; one signature; no two shots share the same recipe + camera + event
signature.

### Step 3 — Animatic

**Output, two passes:**
1. the 13-frame board cut to the voice/SFX/SRT at exact times, with camera moves
   and captions — a stills animatic;
2. the same cut with blocked characters at 10 fps, live camera and scratch SFX —
   a stepped rough. Not a stills slideshow.

The board pass catches sequence and composition problems; the stepped pass
catches dead middles and pose-to-pose snapping.

**Gate 3 (binary):**
- every cue on its frame (±0);
- **the stepped rough is rendered at each of the 13 board times and paired with
  its board frame on one contact sheet**, so sequence, continuity and every cut
  are judged before animation;
- every shot has at least one character/action event, not camera only;
- no undeclared hold over 0.4 s; a declared hold may reach 0.8 s only with a
  secondary moving layer;
- at least two breakdown poses per transition;
- per-shot motion recorded: entry/exit value change, silhouette and
  centre-of-mass delta, mean frame difference, longest still window.

### Step 4 — Cast and asset sheets

**Output:** character sheet (front/side/three-quarter, expressions, 8–10 named
poses, hands, feet, wardrobe, anchors), set/prop sheets, rig test, asset list with
pinned hashes inside `score.assets[]`.

**Gate 4:** seam gap 0; feet planted; contact shadow present; all poses and
expressions on the sheet; badge reads MIRA; sheet approved at 1920. The 390 px
check applies only to the title and caption in Gate 2, not to the sheet.

### Step 5 — Animation

**Output:** each shot from the score, using named poses and events. Per pose:
2-frame anticipation, 3-frame overshoot, 4–8-frame hair/skirt/hand lag. 10 fps
character stepping, 30 fps camera. No 24–36-frame idle. **Contact sheet every
0.5 s of each shot (3–5 per shot), reviewed before the shot passes.**

**Gate 5:** the shot's contact sheet is reviewed; entry/exit states match the
score; at least three events; no undeclared hold; no floating part; no shot where
camera or hair is the only motion. Numeric motion floor, per shot:

- mean frame difference (YAVG at 480 px) ≥ `max(1.2, 0.8 × the approved
  animatic's mean for that shot)`;
- any character shot has a silhouette/centre-of-mass delta of at least 20 px
  between entry and exit;
- no undeclared 0.4 s window below 0.5 YAVG without a secondary moving layer.

The animatic sets each shot's target; the final may not fall below 80% of it.

### Step 6 — Assembly and sound

**Output:** picture lock, transitions, captions, voice, **SFX generated in code**,
designed silence, −14 LUFS ±1.

**SFX:** `scripts/sfx.ts` reads `score.audio.sfx` and synthesises every cue to
`films/<id>/sfx/<id>.wav` — paper snap, whoosh, lamp buzz, sticker slam, step,
crowd, confetti, iris. Deterministic noise and envelopes; no sample library.
Each cue has an id, type, start, duration, gain, pan and a hash. The mix is voice
+ SFX; ducking is added only when a music bed exists.

**Gate 6 is a sound gate, not a file check:**
- every cue file exists, its hash matches, and it is audible;
- every cue declares **layers** (transient, body, tail), a band, a reverb send
  and a duck depth; a snap, slam or whoosh has all three layers;
- cues vary per shot; no machine-gun repetition of the same step or crowd cue;
- a room-tone bed gives designed silence a floor;
- SFX duck under narration by about 4 dB in the 1–4 kHz band;
- true peak ≤ −1 dBTP; integrated −14 LUFS ±1; short-term/LRA inside bounds;
- a **spectrogram sheet per cue** is reviewed by the sound designer/mixer;
- captions inside safe zones and above read time; no caption covers a face or
  prop.

### Step 7 — Audit and delivery

**Output:** `gate-7.json`, `film-audit` report (ASR, readcheck, motioncheck,
cuecheck), final contact sheet, **seven critic sign-offs**, MP4 + SRT + score +
stills + audit.

**Gate 7 (binary):**
- **cuecheck:** every event and cue on its frame (±0); SRT hash matches the score;
- **ASR:** the **mixed master** transcript matches `transcript.json` (line match;
  word error rate ≤5%); not the voice stem alone;
- **readcheck:** captions ≤8 words, ≤2 lines, hold at least
  `max(1.8 s, speech + 0.6 s)`, contrast passes;
- **motioncheck:** per-shot mean frame difference, longest still window and
  silhouette/COM delta meet Gate 5;
- **framecheck:** 900/900 rendered frame pixel hashes match a second render;
  no blank/black/error frame; no unintended edge clip;
- **trace:** text boxes inside safe zones, palette roles ≤4, rig seam 0;
- **format:** MP4 30.000 s, 900 frames, 30 fps;
- determinism is not cleanliness: pixel and trace checks run on every frame, not
  only the hash;
- **contact sheet:** a final 0.5 s contact sheet is reviewed;
- critics: no criterion below 8, mean at least 9, a written reason per score;
  director signs. A split panel goes to the director.

## One score contract

`films/<id>/score.json` extends the existing treatment contract. The brief and
script are inputs. SRT, cue list, contact sheet and audit are generated. There is
no `cue-sheet.json`, no `shot-sheet.json`, no separate `assets.json`.

```ts
const ClockSchema = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("music"), bpm: z.number(), offset: z.number(), meter: z.number() }),
  z.object({ mode: z.literal("narration"), lines: z.array(NarrationLineSchema) }),
  z.object({ mode: z.literal("sfx"), cues: z.array(SoundCueSchema) }),
  z.object({ mode: z.literal("realtime"), start: z.number(), zero: z.number() }),
  z.object({ mode: z.literal("reading"), base: z.number(), perWord: z.number() }),
  z.object({ mode: z.literal("free") }),
]);

const DirectionSchema = z.object({
  entry: z.string().min(1),
  exit: z.string().min(1),
  spine: z.string().min(1),
  events: z.array(z.object({ t: z.number().nonnegative(), kind: z.string(), note: z.string() })).min(3),
});

export const FilmScoreSchema = TreatmentSchema.omit({ proof: true }).extend({
  clock: ClockSchema,
  audio: z.object({
    mode: z.enum(["music", "narration", "sfx", "hybrid"]),
    voice: z.string().optional(),
    music: z.string().optional(),
    sfx: z.array(SoundCueSchema).default([]),
  }),
  captions: z.object({
    source: z.string(),
    lines: z.array(CaptionLineSchema).min(1),
  }),
  assets: z.array(z.object({
    id: z.string(), version: z.string(), hash: z.string(),
    source: z.enum(["new", "reused"]),
  })),
  shots: z.array(TreatmentShotSchema.extend({ direction: DirectionSchema })).min(1),
});

type ResolvedFilm = ResolvedTreatment & {
  clock: Clock;
  audio: AudioPlan;
  captions: Captions;
  assets: AssetRef[];
  shots: (ResolvedShot & { direction: Direction })[];
};
```

`FilmScoreSchema.parse` is the only entry point for a film. It must not call
`TreatmentSchema.parse` first, because the base schema strips unknown keys, and
`resolveFilm` must not reuse `resolveTreatment`'s shot rebuild because it would
drop `direction`. `ResolvedShot` carries `direction` and `events`. The base
`proof` flag is omitted, so no deliverable can declare it. A technical slice is
a **render window** of the 30 s film (`--from 0 --to 10.6`), not a separate film
and not a separate score.

## The pilot

***The Understudy* — 30 s, 16:9, 30 fps, narration + SFX, no music**

Nova is the star. Mira is the understudy. The cue lamp calls Nova; the wings are
empty; Mira walks on; the crowd never knows.

**9 shots, 30.0 s, median 3.0 s:**

| # | Time | Recipe | Direction |
|---|---|---|---|
| 1 | 0–2.2 | paper_open | card, title "THE UNDERSTUDY", cue lamp |
| 2 | 2.2–5.2 | portrait_iris | Nova alone at the cue |
| 3 | 5.2–8.8 | stage_wide | stage builds: sun, floor, crowd |
| 4 | 8.8–10.6 | sticker_slam | "NO NOVA" sticker, house lights |
| 5 | 10.6–13.6 | portrait_iris | Mira steps into the light |
| 6 | 13.6–15.8 | macro_prop_beat | the empty cue lamp, Nova's hand |
| 7 | 15.8–19.8 | stage_wide | Mira points; crowd answers |
| 8 | 19.8–24.6 | stage_wide | Nova joins late; duet formation |
| 9 | 24.6–30.0 | pullback_close | bow, held poster, cream iris |

All recipes are inside their limits (stage_wide min 3.4). No `proof: true`.

**Look spec**
- Collage shadow mode: hard contact and cast shadows, no blur.
- Paper stock grain and 12 Hz boil at 1920; no soft bloom.
- Every layer: 1–2 px cream cut-edge bevel plus a 1 px ink edge shadow.
- Torn edges for stickers and backdrops; die-cut for characters and set pieces.
- One key-light angle per shot; a fixed shadow-offset table per recipe.
- Paper plate joints: overlapping discs at elbow, knee and wrist; brad on top.
- One foreground occluder in every wide (proscenium edge or crowd head).
- Crease AO line where layers overlap.
- Palette: paper + ink + red + blue; gold only title and sticker; acid out.
- Badge reads MIRA. Lower third inside the safe area.
- Rebuild the stage: boots contact, shadow side, sun cast shadow, flat floor
  with two cream rules. Crowd tiers and speaker faces are deferred.

**Motion spec**
- Eight counts per phrase, planted feet, head counter-rotation, three half-beats
  offset between Nova and Mira.
- Entry/exit value change per shot (body travel or scale, in frame units).
- Cut-on-action: the outgoing and incoming shot share a motion vector.
- Two breakdown poses per transition; no pose-to-pose snapping.
- Grey-box motion tests (1–2 s) approved before full animation.

## System and boundary

| Piece | What it does | Slice |
|---|---|---|
| `film` score + validator | extend `treatment.ts`; one CLI; no `proof: true` | 0 |
| pilot `score.json` | 9 legal shots, narration/SFX, captions, assets | 0 |
| backend registry | `styles/paper-kpop/backend.js` maps recipe ids to draw functions | 1 |
| painter | `renderShot(shot, t)`; engine has no shot ids | 1 |
| rig port | `src/characters.js` uses the same `limbEnd`; drift test | 1 |
| audit | 900 frame pixel hashes, trace, cues, palette, type, audio | 1 |
| audio spine | voice + transcript + SRT + cue list | 1 |
| storyboard | 13 frames (9 shots + 4 inserts), contact sheet | 2 |
| look pass | stage rebuild, poster, five hero frames | 2 |
| animatic | board pass + stepped rough at 10 fps + camera + voice/SFX | 3 |
| pose layer | named poses, tracks, interpolation, 10 fps stepping | 5 |
| sfx | `scripts/sfx.ts` synthesises every cue; no sample library | 6 |
| final + delivery | mix, seven critics, MP4/SRT/score/stills/audit | 7 |

## Build order

1. **Brief, script, voice, SRT, score.** Extend `treatment.ts` with
   `FilmScoreSchema`; write the nine-shot score; record the six lines;
   transcript; SRT; validator passes.
2. **Rig, backend registry, painter, audit skeleton.** Port the rig fix; add the
   paper registry; render shots 1–4 as a **0–10.6 s window** (not 12.5 s); run
   the audit from the first render.
3. **Look pass and board.** Rebuild the stage; poster; 13-frame storyboard and
   contact sheet; five hero frames at 1920 and the 390 legibility check; pass
   Gate 2.
4. **Asset sheets (Gate 4).** Character and prop sheets for the pilot; rig test;
   approve before animation.
5. **Animatic, full 30 s.** Board pass, then stepped rough for all nine shots;
   pass Gate 3.
6. **Pose layer and full pilot.** Animate all nine shots; contact sheets every
   0.5 s; pass Gate 5.
7. **SFX and mix.** Synthesise the 10 cues with `scripts/sfx.ts`; mix voice + SFX
   to −14 LUFS; pass Gate 6.
8. **Audit, critics, delivery.** ASR, readcheck, motioncheck, cuecheck, frame
   hashes, seven critics; pass Gate 7.
9. **Only then:** watercolor backend, asset library, second film.

## What not to build

- A cue-sheet, shot-sheet or `assets.json` file; the score is the source.
- A separate animatic CLI; ffmpeg concat is enough.
- A storyboard image farm. A 13-frame board is the board; 100 frames is a farm.
- An asset library, watercolor backend, app, timeline editor, plugin system.
- A sample library. SFX are generated in code.
- `proof: true` in any deliverable.
- Per-shot native moves; one signature (slam) and one transition (iris).
- 24–36-frame idles; a 0.4 s blanket that forces twitch.
- 390 px approval sets; one legibility check is enough.
- Crowd tiers and speaker faces in the pilot look pass.

## Definition of done

- 30.000 s, 900 frames, 16:9, 30 fps.
- 9 shots, median 3.0 s, all recipes legal.
- 6 narration lines, 6 SRT cues, read-time holds met.
- 13-frame board approved; five hero frames approved at 1920 and 390 text check.
- 10 SFX cues generated in code, layered, hashed and audible.
- No seam, blank, clip, palette or type fault in any frame.
- Every cue on its frame; ASR, readcheck and motioncheck pass; two renders
  pixel-identical on all 900 frames.
- Seven critics: no criterion below 8, mean at least 9, written reasons; director
  signs.
