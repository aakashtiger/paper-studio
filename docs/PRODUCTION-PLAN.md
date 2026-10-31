# Production plan — one 9/10 film, repeatable

**Status:** v1.4, core-before-render, 2026-10-29
**Goal:** one 30 s paper film at a 9/10 bar, then repeat without broken frames or
timing drift.

**v1.4 is a scope correction.** Do not render a film until the core is fixed.
*The Understudy* is a **fixture** for contract tests, not the first real film. The
first real film is the user's idea. The build order is contracts → generators →
assets/rigs/poses → audit/critics → painter → the user's film. No shot is
pre-empted.

**v1.3 made the system generic; v1.4 makes it core-first.** The board is a
**derived view** of the score, not a fixed frame count. Audio has a source
resolver: narration is recorded or TTS; music is chosen from a library or
generated; SFX are generated in code. The audio resolves **before** shot timing.
The fixture is one instance, not the system; no film renders until the core
contracts, generators, assets, rigs and audit are in place.

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

1. **Core first, film second.** Build the generic contracts, generators, assets,
   rigs and audit before the first real film. Use the fixture to test them.
   Extract the library and the second style after the first film ships.
2. **Direction is prose plus a board.** The score's shot rows carry the
   direction; the board is generated from the score: one frame per shot plus any
   key beat the director marks. The count is derived, never fixed. The board is
   reviewed as a sequence, not as a frame count.
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

## What is code, what is an artifact, what is process

| Thing | Where it lives | Is it code? |
|---|---|---|
| Idea / brief | `films/<id>/brief.md` | No — input |
| Script / lyrics | `films/<id>/script.md` | No — input |
| Style | `styles/<style>/` | Code + data |
| Format | `formats/<format>/format.json` | Data |
| Audio sources | `films/<id>/audio/` | Files; the resolver is code |
| Score | `films/<id>/score.json` | Data, validated by code |
| Board | `build/<id>/board/` | Generated artifacts |
| Animatic | `build/<id>/animatic.mp4` | Generated artifact |
| Cast / set / prop sheets | `build/<id>/sheets/` | Generated artifacts |
| Rig / pose data | `src/engine/backends/<style>/` + `films/<id>/cast/` | Code + data |
| Renderer / painter | `src/engine/` + `styles/<style>/canvas/` | Code |
| Audit | `src/engine/audit/` | Code |
| Critics | `critics/<role>.md` + `docs/GATES.md` | Process, not runtime |
| Gates | `build/<id>/gates/` | Output + process |
| Library | `library/` + registry | Data + code |

The idea, script, creative direction, approvals and critic judgment are **not**
code. The system accepts them and checks them; it does not invent them.

## Core before render

No film is rendered until these are in place:

1. **Contract layer.** Brief, format, style, audio, score, assets and pose
   schemas; validators; tests. One source of truth.
2. **Audio resolver.** Narration (recorded/TTS), music (library/generated), SFX
   (generated); fixture audio now; no final voice or music needed.
3. **Asset, rig and pose system.** Per-film manifest; character/set/prop sheet
   generator; named poses and expressions; rig geometry shared by source and
   backend.
4. **Board generator.** One frame per shot plus marked beats, derived from the
   score; contact sheet; no fixed count.
5. **Animatic builder.** Board + audio + camera moves; no final render.
6. **Audit and critic pack.** Cue, ASR, read, motion, frame, trace, determinism;
   seven role files and gate checklists.
7. **Painter and backend.** Score-driven renderer; the proof stays the look
   reference.
8. **The user's film.** Only now: the idea becomes a brief, a score and a film.

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
- the clock: narration phrase marks (fixture), BPM if music is chosen, or SFX hits;
- the SFX cue list.

**Gate 1 (binary):** voice file present and hashed; transcript covers every word;
SRT lines match the script; total voice 28.5–29.5 s inside a 30 s film; every cue
holds at least `max(1.8 s, speech + 0.6 s)`; peak below −1 dBFS. No music in the
fixture.

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
- **storyboard**: **exactly one code-drawn frame per shot, in order**, each
  rendered from the score at its poster moment, assembled as one contact sheet.
  It is a review artifact, created only after the shots exist. Key beats live on
  the **text board**, not here. The 390 px legibility check belongs to
  `audit:type`, not to the sheet (decision 0017);
- **five hero frames** cut from the board: title, wings, sticker, duet-poster,
  close, for look approval at 1920;
- reference board: `papercut-red`, `paper-popup`, `spy-titles`; steal/refuse notes.

**Gate 2:** 9 shots; median 3.0 s ±25%; every recipe inside min/max (stage_wide
is 3.4-5.5, not 1.2); every field present; **the board covers every shot and
every marked key beat, and reads in order**; five hero frames at 1920 (the
390 px text check is enforced by `audit:type`, not drawn on the sheet); look
table complete; four roles max;
one accent; one signature; no two shots share the same recipe + camera + event
signature.

### Step 3 — Animatic

**Output, two passes:**
1. the derived board cut to the voice/SFX/SRT at exact times, with camera moves
   and captions — a stills animatic;
2. the same cut with blocked characters at 10 fps, live camera and scratch SFX —
   a stepped rough. Not a stills slideshow.

The board pass catches sequence and composition problems; the stepped pass
catches dead middles and pose-to-pose snapping.

**Gate 3 (binary):**
- every cue on its frame (±0);
- **the stepped rough is rendered at each board time and paired with its board
  frame on one contact sheet**, so sequence, continuity and every cut are judged
  before animation;
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
expressions on the sheet; a joint/anchor map; hand, foot and wardrobe detail
panels; badge reads MIRA; sheet approved at 1920. Paper K-pop is a front/three-
quarter puppet style: those are the required views. Side and back views are
required only for a rig that has them; do not fake them with a squash. The
390 px text check lives in `audit:type`, not on the sheet.

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
`films/<id>/sfx/<id>.wav`. The generator builds each cue from **layered parts**
(transient, body, tail) using **modal resonators** for material (wood, metal,
paper, glass), **friction/stick-slip** for creaks and cloth, **synthetic impulse
responses** for space, and an **ambience kit** for wind, rain, water, crowd and
hum. Still no sample library. Each cue has an id, type, start, duration, gain,
pan, a hash and, where the picture causes it, a **bound event** so its time is
derived, not typed twice. Mix for phone speakers: no ticks, clicks, hats,
glitches or beeps. The mix is voice + SFX; ducking is added only when a music bed
exists.

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

## The audio resolver

Audio resolves **before** shot timing, because the voice or song decides what
happens when.

```ts
type AudioPlan = {
  mode: "music" | "narration" | "sfx" | "hybrid";
  narration?: {
    source: "recorded" | "tts" | "none";
    voice: string;          // file or voice id
    transcript: string;     // word timings
    srt: string;
  };
  music?: {
    source: "library" | "generated" | "none";
    track?: string;         // library id or file
    license?: string;       // required for library tracks
    bpm?: number;
    offset?: number;
    beatMap?: string;
  };
  sfx: { source: "generated" | "library" | "recorded"; cues: SoundCue[] };
};
```

**Narration:** recorded or TTS. A TTS voice names a **provider** (`kokoro`,
local; `elevenlabs`, cloud, fetched once at authoring time and pinned as a WAV);
the render never touches the network. Word timings come from local **Whisper**,
re-attached to the script's spelling. Either way it produces a pinned voice file,
a transcript of the actual read and an SRT. The shot rows then take their phrase
marks from that transcript, so the voice is the clock.

**Music:** library first, generated fallback. A library track carries an id, a
licence, BPM, offset and a beat map. If no cleared track fits the style, mood and
duration, `scripts/music.ts` generates a score. The film never ships with an
unlicensed track.

**SFX:** generated in code from the cue list. The kit is upgraded (layers,
resonators, friction, IR reverb, ambience) and a cue may bind to its picture
event. `library` and `recorded` sources are defined but unbuilt; the library is
grown by promoting good generated cues, with provenance kept.

**Fixture:** narration only, scratch voice now; final recorded or TTS later. No
music. The schema and order already support the other modes.

## Generic system vs the fixture

| Layer | Generic contract | Fixture instance |
|---|---|---|
| Brief | topic, audience, format, style, audio mode, references, rights | *The Understudy*, 30 s, 16:9 |
| Format | aspect, duration, fps, safe zones, delivery | 16:9, 30 s, 30 fps, MP4 + SRT |
| Style | pack, tokens, recipes, duration envelope, clock modes, native moves | Paper K-pop 0.1.0 |
| Audio | narration/music/SFX resolver, pinned hashes, licences | narration + SFX |
| Score | shots, direction, events, captions, assets | 9 shots, 30 s |
| Board | derived view of the score: one frame per shot + marked beats | derived, not fixed |
| Animatic | board pass + stepped rough, cut to the clock | 30 s |
| Assets | create or reuse per film; sheets; anchors; pinned versions | Nova, Mira, stage, card, sticker |
| Animation | named poses, 10 fps characters, 30 fps camera, native moves | 9 shots |
| Renderer | score-driven painter + style backend | paper backend |
| Audit | cue, ASR, read, motion, frame, trace, determinism | seven gates |
| Library | promote approved styles, assets, music, SFX, poses | after three films |

## Still missing from the system

These are real gaps, listed so they are not mistaken for done:

| Gap | Why it matters | When |
|---|---|---|
| **Music library + licensing** | pick or generate a track; no unlicensed music | before the first music film |
| **Voice pipeline** | recorded vs TTS (`provider` = kokoro/elevenlabs), word timings from local Whisper, voice as the clock; ASR of the master as the G7 gate | before the first film's final voice |
| **Format contract 9:16 / 1:1** | re-stage, safe zones, delivery | after the first 16:9 film |
| **Asset library + provenance** | reuse at scale, versions, rights | after three films |
| **Rights and licences** | fonts, music, voice, references; sellable output | before delivery |
| **Versioning / change control** | style or asset changes must not silently alter a film | now, via hashes |
| **Preview / render performance** | iteration speed on 900-frame renders | after the technical slice |
| **Localisation** | captions and voice in other languages | later |
| **Fallbacks** | missing voice, missing music, unsupported clock | now, as resolver errors |
| **Library curation** | which assets are good enough to promote | after three films |

## The fixture (*The Understudy*)

**This is not the test video.** The user will provide the idea. *The Understudy*
exists only to exercise the contracts, the board generator, the animatic, the
audit and the rig tests. It must never become a hardcoded shot list in the
engine.

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
| fixture `score.json` | 9 legal shots, narration/SFX, captions, assets | 0 |
| backend registry | `styles/paper-kpop/canvas/recipes.js` maps recipe ids to draw functions | 1 |
| painter | `renderShot(shot, t)`; engine has no shot ids | 1 |
| rig port | `src/characters.js` uses the same `limbEnd`; drift test | 1 |
| audit | 900 frame pixel hashes, trace, cues, palette, type, audio | 1 |
| audio spine | voice + transcript + SRT + cue list | 1 |
| storyboard | derived from the score: exactly one frame per shot, in order | 2 |
| look pass | stage rebuild, poster, five hero frames | 2 |
| animatic | board pass + stepped rough at 10 fps + camera + voice/SFX | 3 |
| pose layer | named poses, tracks, interpolation, 10 fps stepping | 5 |
| sfx | `scripts/sfx.ts` synthesises every cue (layers, resonators, IR, ambience); no sample library | 6 |
| final + delivery | mix, seven critics, MP4/SRT/score/stills/audit | 7 |

## Build order

**Core first. No film render until steps 1–6 are in place.**

1. **Contract layer.** Brief, format, style, audio, score, asset and pose schemas;
   resolvers; tests. The existing treatment/film schema is the base.
2. **Audio resolver.** Narration (recorded/TTS), music (library/generated), SFX
   (generated); fixture audio only; no final voice or music needed.
3. **Asset, rig and pose system.** Per-film manifest; character/set/prop sheet
   generator; named poses and expressions; shared rig geometry; the source and
   proof vendor drift test.
4. **Board generator.** One frame per shot plus marked beats, derived from the
   score; contact sheet; no fixed count.
5. **Animatic builder.** Board + audio + camera moves; no final render.
6. **Audit and critic pack.** Cue, ASR, read, motion, frame, trace, determinism;
   seven role files and gate checklists.
7. **Painter and look pass.** Score-driven backend; stage rebuild, poster and
   hero frames on the fixture; the proof still renders.
8. **The user's film.** The idea becomes a brief, a score, a board, an animatic,
   assets, animation, SFX, mix and audit. Only now do we render a film.
9. **Only after that:** watercolor backend, asset library, second film.

## What not to build

- A cue-sheet, shot-sheet or `assets.json` file; the score is the source.
- A separate animatic CLI; ffmpeg concat is enough.
- A storyboard image farm. This bans an **authored** storyboard with a target
  count. A **derived** storyboard — one code-drawn frame per shot, created after
  the shots exist — is a review artifact and is required (decision 0017).
- An asset library, watercolor backend, app, timeline editor, plugin system.
- A sample library. SFX are generated in code. `library` and `recorded` sources
  are **defined but unbuilt** so a free pack can drop in later without a contract
  change; the library grows by promoting good generated cues.
- `proof: true` in any deliverable.
- Per-shot native moves; one signature (slam) and one transition (iris).
- 24–36-frame idles; a 0.4 s blanket that forces twitch.
- 390 px approval sets; one legibility check is enough, and it lives in
  `audit:type`, not in the storyboard sheet.
- Crowd tiers and speaker faces in the fixture look pass.

**Banned vs allowed, stated once.** Banned: generative **images or video**
anywhere in the render path, and per-film LLM-written animation code. Allowed:
local models for **voice, word timing and music** (Kokoro, Whisper, ACE-Step),
because the *picture* stays entirely code-drawn from the score. That is the
honest reason a film re-renders byte-for-byte and a generative pipeline cannot
(decision 0017).

## Definition of done for the first real film

- 30.000 s, 900 frames, 16:9, 30 fps (the fixture's format; the user's film
  chooses its own).
- 9 shots, median 3.0 s, all recipes legal.
- 6 narration lines, 6 SRT cues, read-time holds met.
- The board covers every shot and marked beat; five hero frames approved at 1920
  and the 390 text check in `audit:type`.
- 10 SFX cues generated in code, layered, hashed, bound to their picture events
  and audible.
- No seam, blank, clip, palette or type fault in any frame.
- Every cue on its frame; ASR, readcheck and motioncheck pass; two renders
  pixel-identical on all 900 frames.
- Seven critics: no criterion below 8, mean at least 9, written reasons; director
  signs.
