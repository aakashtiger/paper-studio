# F — Vizavi Motion: the motion, camera, transition, storyboard and sound taxonomy

**Date:** 2026-11-04
**Source:** `C:\Users\Aakash\Downloads\Compressed\_research\vizavi-motion\` — `SKILL.md`
(v1.6.1) plus ten files in `references/`. All eleven files read in full (353 lines).
**Purpose:** recover the parameters a professional motion skill actually fixes, so the
transferable ones can become code values for a paper-cut style. Not an
implementation. No file in this repository was changed except this one.

---

## 0. The honest headline

**The skill is a rule-set, not a parameter table.** It says with great precision *which
properties must be true* and almost never says *by how much*. In the whole motion domain
there are only **three** numbers that are not explicitly marked "example, not a norm":

| Number | Source | Status |
|---|---|---|
| 1920×1080 | `review-and-export.md` §"Реализация" | default delivery, overridable by brief |
| 60 fps, even timestamps, H.264, yuv420p, AAC | same | default delivery |
| 20 s × 60 fps = **1200 frames**, grid `0..1199/60`, `renderAt(20)` is not an extra frame | `review-and-export.md` | counted example, explicitly not a fixed duration |

Every other figure is either **named as an example** (`1–3` main controls, `0,6–0,9 с`
cursor move, `3–5` variants) or **named in order to forbid it** (`5–7` seconds of probe,
`3` or `5` poses as a universal norm). That asymmetry is the finding: the skill encodes
**invariants and refusals**, and leaves magnitudes to the style. A paper-cut style must
supply the numbers; the skill tells us which numbers will be judged and which claims are
lies.

Consequence for us: §5 (proposed JSON) is mostly *our* values, and every one of them is
labelled `proposed` below. Only rules marked `[V]` are sourced from Vizavi.

---

## 1. What the skill is

Three mechanics are the foundation; the ten reference files are optional modules that
help execute them and never replace them (`SKILL.md` line 11). A user brief overrides
every default (`SKILL.md` 11, `review-and-export.md` 27).

| # | Mechanic | One-line law |
|---|---|---|
| 1 | **Quality by default** | The camera moves continuously through active storytelling; the frame shows real depth, weight and material; type participates in the action; music *and* design are synchronous to the action, not laid on top. |
| 2 | **Direction before implementation** | One causal through-line and a full dynamic storyboard exist before assembly; 3–5 genuinely different variants per scene; one risk probed at real quality. |
| 3 | **Mandatory iteration** | The first assembly is an internal draft. Every scene, seam and the full mix are watched and heard, causes are fixed, and the **delivered, decoded file** is checked — not the source, not the contact sheet. |

---

## 2. Taxonomy

Column **code**: `yes` = a machine can decide it from the score/rendered frames;
`partial` = a machine can measure a proxy but a person signs the meaning;
`no` = human judgement and must stay a signed row.
Column **paper**: whether it survives translation to a 2D code-drawn cut-paper film.

### 2.1 Camera — path, speed, framing, depth

| Parameter | Rule / value | Source | code | paper |
|---|---|---|---|---|
| Movement is mandatory | In active storytelling the camera moves continuously: smooth acceleration and deceleration, one coherent trajectory, motivated tilt, diagonal, slight roll, fly-around. A technical pause and the final readable frame are the only exemptions. | SKILL 17 | yes | yes |
| Six separate properties | Path, speed, orientation, target, **FOV**, **focus** are designed independently, never as one "zoom". | motion-and-sound 7 | yes | partial — no true FOV; scale is the proxy |
| Trajectory shape | One long coherent path with **waves of speed**. Identical ease-in-outs with zero velocity at every accent are forbidden. | motion-and-sound 7 | yes | yes |
| Seam continuity | At every cut check **position, direction, screen speed and acceleration**. | motion-and-sound 7 | yes | yes |
| Readable-phase damping | Inside an active scene a large traverse resolves into a **calm arc or drift**; it does not keep accelerating through the line. | motion-and-sound 7 | partial | yes |
| Hero follow | Following the hero is *compatible with* noticeable environment parallax. | motion-and-sound 7 | yes | yes |
| Location change | A meaningful editorial cut **does not** require a continuous world coordinate between different locations. | motion-and-sound 7 | yes | yes |
| Three planes | Foreground / midground / background differ by **scale, relative motion, overlap and perspective** — all four, not just size. | motion-and-sound 9 | yes | yes |
| Silhouette protection | Protect the silhouette and the text from accidental overlap at every frame. | motion-and-sound 9 | yes | yes |
| Anchored plate | A plate tied to a moving 3-D object follows the **projection of its anchor**; frame margins stay free of jitter and lag. | motion-and-sound 9 | yes | partial — 2-D anchor projection only |
| Camera serves the action | Follow the caret, push to the click, pull back for the result, orbit the spaced layers — **one meaningful gesture**, never all of them per episode. | saas-ui-motion 27 | partial | yes |
| Shot size has a job | Close-up = read the detail; wide = understand the context. | saas-ui-motion 27 | partial | yes |
| No near-plane crossing | On a close pass keep hero focus and scale and do not cross the near plane. | models-3d 15 | partial | n/a |
| World vs screen space | World-space UI and screen-space overlay are explicitly separated; a world point is projected through the **current** camera, viewport, aspect and window scale. CSS px, video-frame px and world units are never mixed without conversion. | saas-ui-motion 41 | yes | yes |
| Fixed screen indicator | The screen-space label keeps **constant position and styling** while the camera moves; it is not bound to the world camera and is protected from overlap and cropping. | saas-ui-motion 43, styles-and-sources 24 | yes | yes |
| Anti-law: "one linear zoom" | A single linear zoom of a flat composition does **not** substitute for depth. | SKILL 17 | yes | yes |
| Anti-law: "traverse over a still" | A simple traverse over a passive picture does not replace the promised action. | image-continuity 11 | partial | yes |

**Magnitudes the skill never gives:** lens millimetres, degrees of roll, px/s of pan, %/s of
push, acceleration limits, minimum travel. It names the *check*, not the *threshold*.

### 2.2 Motion — timing, easing, rhythm, holds, blur

| Parameter | Rule / value | Source | code | paper |
|---|---|---|---|---|
| Frame grid | Fixed controlled time; every frame rendered at `i / fps`; completeness and order verified. `20 s × 60 fps → 1200 frames` on `0..1199/60`. | review-and-export 31, 45 | yes | yes |
| Reproducibility | A frame must repeat after **cold seek, backward scrub, and entry from another point**; cumulative effects need analytic state / bake / replay, not one random seed. | review-and-export 47 | yes | yes — already decision 0032/0023 |
| Speed vs readability | Changing accents and shot sizes is required, but without long hangs and without chaotic flicker; density comes from **hierarchy**, not from deleting the environment. | SKILL 19 | partial | yes |
| Tempo guard | Never buy tempo by deleting mandatory elements or by speeding up past legibility. | motion-and-sound 22 | yes | yes |
| Action phases | Preparation → action → contact → reaction → decay, each with **different mass and curve**. | motion-and-sound 22 | yes | yes |
| Accent budget | One main accent per shot; secondary layers must be *coordinated*, not equal. If everything competes, change **phase, scale, depth and contrast** — not volume. | motion-and-sound 22 | partial | yes |
| Physics vocabulary | Weight, inertia, material, light, contact, secondary reaction. Spring/overshoot/anticipation are means, and the **same spring on every layer is forbidden**. | SKILL 19, saas-ui-motion 19 | yes | yes |
| Stop-motion | Local stop-motion stepping is allowed in the paper language *in support of* the action, never as random jitter. | styles-and-sources 16 | yes | yes — core to our pack |
| Motion blur | Reflects **relative screen motion over the exposure**. A sharp tracked hero may have a smeared background. The smear **weakens on deceleration**. | motion-and-sound 13 | partial | yes |
| Blur honesty | Sub-frame sampling or a renderer is a *means*, not proof the effect exists. | motion-and-sound 13 | no | yes |
| Depth of field | Isolates a chosen depth; focus follows the **semantic detail** on approach with no random defocus; near and far layers may soften but text and hero stay recognisable. Never manufacture illegibility in flat UI for a checkbox. | motion-and-sound 14 | partial | partial — layer blur ≠ lens |
| Radial / zoom blur | A **separate stylised accent** for depth or fast cards. It is not DOF and not temporal smear, and maximum blur is never applied to the whole film. | motion-and-sound 15 | yes | yes |
| Construction over garnish | Form reads by geometry, light, normals, thickness, contact shadow, overlap. Specular, grain and particles do **not** repair wrong construction. Texture and shadow follow object and light. | motion-and-sound 16 | no | yes |
| Type has a job | Design the readable final layout **first**, then the letter/word action (assembly, width change, masks, spatial relation, interaction with an object). The effect must carry meaning. | motion-and-sound 20 | partial | yes |
| Flash safety | Repeating strobe is not a substitute for energy; risky brightness changes are checked in the output; reduced-motion and "no errors" do not prove flash safety; never claim standard compliance without the analysis. | review-and-export 55 | yes | yes |
| Cursor (if a UI appears) | Hover → target reaction → press/grab → change → readable result. Hit is the **arrow tip/hotspot**, not the sprite centre. The cursor is sharp and fully visible at the click and never covers the label, result or numbers. **0.6–0.9 s** along a small arc with a slight click squash and recovery is quoted as an *example setting, not a norm*. | saas-ui-motion 15, 21 | yes | yes |
| Drag | Fix the grab point and the cursor–object offset; the card lifts and follows an **arc**, the drop zone highlights, on drop the card shrinks and seats. Lag may carry weight but must not look like a lost grip. Neighbours react **after** the event. | saas-ui-motion 19 | partial | partial |

### 2.3 Transitions

| Parameter | Rule / value | Source | code | paper |
|---|---|---|---|---|
| Designed in pairs | A transition is designed **together with both scenes**, never as a post-effect on a finished cut. | storyboard 23 | yes | yes |
| Vocabulary in the pack | `cut · page_turn · dissolve · iris · wipe · match_cut · hold` (engine); our paper pack allows `cut · iris · wipe · hold · match_cut`. | src/core/style.ts 40; tokens.motion.transitions | yes | yes |
| Match cut | Align **projection silhouette, scale, orientation and direction of movement** across the seam. | storyboard 23 | yes | yes |
| Mask | The next scene must **actually appear inside the mask**. A random overlay laid over a finished cut does not prove a mask transition. | storyboard 23 | yes | yes |
| Same location | Preserve poses, perspective, light **and speeds**; bind a reveal to a real overlap or action. | storyboard 23 | yes | yes |
| Frequency | A cut on **every** beat is explicitly not required; musical sync is a *periodic meaningful* device. | SKILL 23, motion-and-sound 32 | yes | yes |
| SFX per transition | Do not lay the same whoosh on every transition; do not duplicate every musical hit with an effect. | motion-and-sound 38 | yes | yes |
| Cost of the beat | Never trade speech intelligibility, text reading or a semantic event for a grid hit. | motion-and-sound 36 | yes | yes |

**Durations:** the skill gives *none*. Not for a wipe, an iris, a dissolve or a match cut.
Any duration we encode is a style decision, not a citation.

### 2.4 Storyboard and shot list

The board is **required before implementation** and covers **every scene and every seam**
(`storyboard.md` 1, 8). The card is the schema:

| Field | What must be fixed | code | paper |
|---|---|---|---|
| **Time and meaning** | Interval, the main accent, the shot's role in the whole story. | yes | yes |
| **States and action** | What was, what triggers the change, what the hero does, the reaction, the result. | partial | yes |
| **Space** | Composition, FG/MG/BG, light, material. | partial | yes |
| **Text** | The exact phrase, the letter/word action, **the reading window**. | yes | yes |
| **Camera and optics** | Path, target, turn/speed, shot size, focus and blur. | yes | yes |
| **Connections** | Entry from the previous shot, the transition carrier, exit to the next. | yes | yes |
| **Sound** | Musical bar, SFX and its synchronous event, **or an explicit silent**. | yes | yes |
| **Check** | The main risk, the actual verification method, the allowable technical fallback. | partial | yes |

Process rules:

- Extract from the brief: goal, viewer, key thought, mandatory text, format, duration, sound,
  allowed resources, output files. Unknown real facts are never invented; reversible
  creative choices are made alone (`storyboard.md` 5).
- One through-line: what acts, what changes, what thought the result proves. Colour/material
  change, transfer of motion, causal chain or spatial unfolding are all valid
  (`storyboard.md` 6).
- **3–5** short variants per scene, differing in **action, composition/space, metaphor or
  transition**. A colour and font swap is not a variant (`storyboard.md` 7).
- Do not re-skin the previous film. The circle / letter O / portal is one device, not a
  default; **2–3** devices may be fused if they form a single action (SKILL 29).
- Probe one indicative risk at real quality and motion, with sound when present. Length by
  perception and brief — **`5–7` seconds is explicitly refused as a mandatory probe**
  (`storyboard.md` 25).
- Shot duration guidance: **none in the skill.** The only duration constant in our repo is
  `minShot: 1.2` s (paper pack). Anything else is ours.

### 2.5 Sound

| Parameter | Rule / value | Source | code | paper |
|---|---|---|---|---|
| Default | Music **and** sound design exist from the start unless the brief says silent. A silent result is never called voiced. | SKILL 21 | yes | partial — no music yet (open item) |
| Music must be music | Motif/groove, development, contrast, **completion**. A bag of whooshes and hits is not a composition. | motion-and-sound 26 | no | yes |
| SFX binding | SFX binds to **movement, contact, material, transition** — never added at random. | motion-and-sound 26 | yes | yes |
| One event drives both | Picture and sound are driven by **the same event list**. After a speed ramp, recompute the actual accent moment; never silently change the whole musical tempo or pitch. | motion-and-sound 28 | yes | yes |
| Accent map | Built from the **actual track**: perceived peak/onset, the visual action it supports, and the nearest suitable frame as **`frame / fps`**. Real audio start/offset and editorial shifts are accounted for. Same BPM, a computed grid, or the SFX file's start is **not** evidence. | motion-and-sound 34 | yes | yes |
| Mismatch repair | Adjust shot duration, trajectory, reveal/landing time or the arrangement *within the brief*. Never fake speed or ruin speech for the grid. | motion-and-sound 36 | yes | yes |
| Priority order | Semantic event > text reading > voice > declared absence of music > mechanical beat. Silent mode disables musical binding entirely. | motion-and-sound 36 | yes | yes |
| Mix check | Full mix **and** the needed layers: balance, clipping, clicks, sync, tail. Technical metrics do not prove musical quality. | motion-and-sound 28 | partial | yes |
| Status honesty | "Not created" and "not listened" are different statuses and must be stated. | motion-and-sound 28 | yes | yes |
| Silence | A declared decision that must be authored, not a gap. Our pack already declares "one beat of silence before a drop; the close may hold on room tone". | tokens.sound.silence | yes | yes |

**Loudness:** the skill gives **no** LUFS, no true-peak, no duck depth, no silence floor.
Those are ours (−14 LUFS / −1 dBTP / 4 dB duck / ≤ −50 dBFS), already measured in the repo.

### 2.6 Review and export — the measurable acceptance criteria

| Parameter | Rule / value | Source | code | paper |
|---|---|---|---|---|
| Draft law | The first assembly is an internal draft and is never delivered as final. | SKILL 33 | partial | yes |
| Watch protocol | Full watch at **normal speed**, then a targeted pass on every scene and every seam; with sound, the full mix and the required layers. | review-and-export 7 | partial | yes |
| Note format | **interval → observation → cause → concrete fix → re-check.** Iterations are not counted, they are motivated; if nothing is found, record what was checked. | review-and-export 7 | no | yes |
| Seven checks | Idea and causal thread + hero recognition + development (no boring hang); camera/size/perspective/layers direct attention, speeds and seams soft; type performs, mandatory words read without pausing; form/light/shadow/material/identity/contact preserved, no artifacts/crops/layer conflicts; blur and focus match motion and depth without hiding what is needed; music and SFX support style/rhythm/events with no desync, click or cut-off; format, duration, fps, silent/offline met. | review-and-export 11–17 | partial | yes |
| Simplification trap | After simplifying, re-compare with the brief: "cleaner" is unacceptable if required characters, text, environment or actions disappeared. | review-and-export 19 | partial | yes |
| Delivery | MP4 **1920×1080, even 60 fps, H.264, yuv420p, AAC**; sources kept alongside; 4K on request; explicit brief wins. | review-and-export 27 | yes | partial — we render 30 fps |
| Export pipeline | (1) fixed grid, render **all** frames at `i/fps`, no realtime capture with drops; (2) mix to a **real exportable audio track**, accounting for start, offsets, accents and end; (3) mux with FFmpeg, keep fps and duration, never substitute the mix with one effect; (4) align head and tails before mux, never cut the last scene or the music's end for arithmetic, never apply `-shortest` blindly; (5) **check the ready decoded MP4**. | review-and-export 31–35 | yes | yes |
| Delivered-file checks | Real codec/pixel format, resolution, even fps and timestamps, frame count, **exact duration**, AAC/needed audio, AV sync, start, end, **scene boundaries**, frames either side of each boundary, readable holds, fastest phases. | review-and-export 35, 41 | yes | yes |
| Evidence hierarchy | Contact sheet judges composition; a dense sequence judges one seam; full playback judges rhythm and smoothness; listening judges sound. **These are not interchangeable.** | review-and-export 41 | partial | yes |
| Sync verification | Compare chosen cuts/actions to perceived accents of the **real track** against frames of the **decoded export**, including the post-mux audio offset. Numerical label coincidence is not proof. | review-and-export 43 | partial | yes |
| Five statuses | **implemented · verified by run · visible in frames · verified in motion · listened.** Unverified never gets PASS from parameters or general impression. | review-and-export 51 | yes | yes |
| Frame arithmetic | 20 s at 60 fps = 1200 frames; `renderAt(20)` is not an extra frame. Distinguish "audio stream present" from "sound is good": a silent stream never passes as an audio result. | review-and-export 45 | yes | yes |

### 2.7 Style and source rules — what must be invariant

| Parameter | Rule / value | Source | code | paper |
|---|---|---|---|---|
| Style card fields | Name, **source and date of agreement**, visual grammar (**forms, typography, material, light, camera/rhythm**), **boundary of applicability**. It describes a *language*, not a scene order. | styles-and-sources 7 | yes | yes |
| What is invariant | The visual grammar above and the three core mechanics. The shot sequence, format and duration are *not* invariant. | styles-and-sources 7, 11 | yes | yes |
| Reference split | Observation first: **visible/audible in a specific interval → useful principle → own decision for this story**. Never describe editing, motion, frames or music from a title or a link. | video-references 5, 7 | no | yes |
| Reference fusion | Three references: name exactly which characteristic comes from which, record compatible **and conflicting** properties, then build **one system**, not three fragments. Keep one causal thread and **one scale of movement**. | video-references 11, 13 | partial | yes |
| Identity continuity | For every new pose submit the **same canonical reference set**, never the last, drifted regeneration. Fix constants, camera/shot size, anchors, scale, light source, background/alpha and what changes per phase; after, align anchors, silhouette and contact and check face/anatomy/hands/prop/perspective/light direction. | image-continuity 3, 5 | partial | yes |
| Pose count | The number of poses is set by the task; **"three or five poses" is explicitly not a universal norm.** A three-pose change is a discrete series, not a smooth rotation. | image-continuity 5, 7 | yes | yes |
| Alpha honesty | Real PNG alpha; a drawn checkerboard or flat colour is not transparency; check channel, edge on dark and light, colour halo, premultiplied alpha. | image-continuity 9 | yes | yes |
| Source honesty | Only verified entries: exact page, what is available, account needed, free-use terms **for the specific file**, format/output, date and method of verification, known limits. Distinguish page text / preview / download access / real file / verified work. | styles-and-sources 30 | partial | yes |
| Paper language | Cut shapes, layers, edges and **contact shadows**, folds, material plasticity. Stretch, squash, collision and **local stop-motion stepping support the action** — they do not replace it with random jitter. | styles-and-sources 16 | yes | **the target language** |
| 2.5D definition | The same flat panels spaced in depth; the camera reveals relative placement, perspective, overlap and parallax. Panels **do not get real sides or extrusion**. | saas-ui-motion 34 | yes | yes |
| 3D definition | Real geometric thickness, edges, side surfaces; volume proved by **light, normals, shadows and a spatial pass**, not by scale or a drop shadow. | saas-ui-motion 35 | partial | n/a |

---

## 3. Code-encodable vs human judgement

### 3.1 A machine can decide (put it in a gate)

1. Every shot has a non-`static` move with real travel (already: `camera:check`).
2. Move variety: ≥ 3 distinct moves per film, longest run ≤ 2 (already).
3. Seam continuity numbers: position delta, direction turn, speed jump, acceleration jump.
4. Frame grid completeness, frame count vs duration, even fps, codec, pixel format, AV sync.
5. Plane count and declared parallax ratios per shot.
6. Silhouette/text overlap, text inside the safe area, words per second, reading window.
7. Blur presence proportional to screen speed, and zero blur on a hold.
8. Flash/strobe budget and per-frame luma delta.
9. Transition legality: type is in the pack's list; a match cut's silhouette/scale/angle/direction
   agreement; a mask's actual containment.
10. Accent map: every declared accent has `frame / fps` within tolerance of the measured peak;
    every SFX is bound to a picture event; no SFX kind repeated on consecutive transitions.
11. Silence declared and measured on the master (already: ≤ −50 dBFS).
12. Every report names the sha256 of the score / videoHash of the picture it describes
    (already: decisions 0032, 0033).

### 3.2 A machine can measure a proxy, a person must sign

- "The camera directs attention" — measurable as on-screen motion of the focus region, judged
  as attention.
- "The seam is soft" — measurable as velocity continuity, judged as softness.
- "Density without chaos" — measurable as cut rate and accent count, judged as rhythm.
- "Type performs" — measurable as the word box moving, judged as meaning.
- "Identity is preserved" — measurable as anchor drift, judged as likeness.
- "The mix is balanced" — measurable as LUFS/true peak/duck depth, judged by ear.

### 3.3 Must stay human (never gate it)

- Whether the idea lands and the causal thread is legible.
- Whether the 3–5 variants were *genuinely* different.
- Whether the transition *carries meaning* rather than decorating.
- Whether the music has development and completion.
- Whether a blur "hides what is needed".
- Whether the film is "alive". The skill itself refuses to certify this by instruction or by
  one good frame (SKILL 33) — so a pipeline that claims it from metrics repeats the mistake
  it warns about.

---

## 4. Conflicts with a 2-D code-drawn paper style

| Conflict | Where | Why it breaks | Our resolution |
|---|---|---|---|
| **A camera has FOV and focus as real optics** | motion-and-sound 7, 14 | A cut-paper collage is photographed flat, with deep focus and hard top light. A 35 mm lens and a focus pull are physically absent. | Rename the axis: `scale` (1.0–1.35), `translate` (px), `rotate` (≤ 4°), `layerSharpness` (0–1). Never claim DOF. |
| **Fly-around, roll, orbit** | SKILL 17 | A paper sheet on a table cannot be orbited; a fake orbit needs layer offsets that then contradict the contact shadows. | `orbit` becomes a bounded 2.5-D parallax arc; roll is capped at the tilt of the *sheet*, not the camera. |
| **Motion blur from exposure** | motion-and-sound 13 | Paper stop-motion has no shutter; a smeared background reads as a printing error, not speed. | Blur only on deliberate fast travel, capped, and disabled on holds and on type. Declared as an effect, not as optics. |
| **Radial / zoom blur for depth** | motion-and-sound 15 | In paper this reads as a print-registration effect, never as depth. | Allowed as an accent; forbidden as the film's default. |
| **8 fps / 60 fps default** | review-and-export 27 | Our pack is 30 fps (`tokens.motion.timing.frameRate`); the skill's 60 is a delivery default, not an art rule. | Format owns fps; the style owns `minShot`. Never inherit 60 silently. |
| **Continuous camera in *every* active shot** | SKILL 17 | True for motion graphics; for paper it fights the medium if it means 3-D moves. | Keep the invariant ("no shot is a photograph") and restrict the vocabulary to 2-D moves. Already the shape of decision 0041. |
| **Music exists by default** | SKILL 21 | Paper Studio has no music path yet; AGENTS.md names this open. | Encode `sound.mode: "music+sfx" \| "sfx" \| "silent"` and refuse to call an `sfx` film "voiced". |
| **3-D model pipeline** (GLB, hinge, near plane, units) | models-3d, 3d-sources | Paper is drawn in code; importing GLB would break determinism and the no-generative rule. | Out of scope. Keep only two rules: normalise scale/origin; do not cross the near plane (for us: do not push past the paper's edge). |
| **Generative image / reference-edit providers** | image-providers 5–45 | AGENTS.md bans generative images and video in the render path. | Out of scope entirely. Transfer only the *continuity discipline*: canonical pose set, anchors, alpha honesty. |
| **Cursor / SaaS-UI rules** | saas-ui-motion | Only apply if a film shows a screen. | Reuse the 0.6–0.9 s arc, hotspot rule and hover-before-click for app recipes; ignore the rest. |
| **"3–5 variants per scene"** | storyboard 7 | That is an authoring cost, not a gate; it cannot be proven from artifacts and would double the film's writing. | Keep as a *writing* rule for the human/LLM that writes the score. Never a check. |
| **"Watch and listen to the film"** | review-and-export 7 | No machine can. | Must be a signed review row, with the status vocabulary of §4.5, or the gate must say `unverified`. |

---

## 5. Proposed JSON shape

Field names follow the existing pack (`tokens.motion`, `shot.camera`, `shot.transitionOut`,
`shot.direction`) so this is an extension, not a second vocabulary. Values marked
`proposed` are ours; `[V]` marks a value the skill states.

### 5.1 Style — `styles/<pack>/tokens.json` → `motion`

```json
{
  "motion": {
    "timing": {
      "fps": 30,
      "bpm": 88,
      "offset": 0.21,
      "bar": 4,
      "grid": "frame = round(t * fps)"
    },
    "camera": {
      "moves": ["static", "push_in", "pull_back", "pan", "tilt", "parallax"],
      "default": "push_in",
      "requireMove": true,
      "minDistinct": 3,
      "maxRun": 2,
      "byBeat": { "hook": "orbit", "setup": "pan", "escalate": "push_in", "turn": "pull_back", "release": "orbit", "button": "push_in" },
      "minTravel": { "push_in": 0.03, "pull_back": 0.03, "pan": 24, "tilt": 18, "parallax": 0.02, "orbit": 0.06 },
      "maxScale": 1.35,
      "maxRotateDeg": 4,
      "seam": {
        "maxSpeedJump": 0.35,
        "maxAccelJump": 0.50,
        "maxDirectionTurnDeg": 90,
        "cutAtRestMaxShare": 0.5
      },
      "layers": {
        "min": 3,
        "parallax": { "foreground": 1.0, "midground": 0.6, "background": 0.3 }
      }
    },
    "easings": ["easeOut", "easeInOut", "easeIn", "backOut", "linear"],
    "physics": { "squash": 0.12, "overshoot": 0.18, "anticipation": 0.1, "boilHz": 12 },
    "blur": { "motionMax": 0.02, "holdMax": 0.0, "radialShareMax": 0.15 },
    "type": { "maxWordsPerSecond": 3.5, "minReadSeconds": 1.0, "maxWordsPerLine": 8 },
    "flash": { "maxLumaDeltaPerFrame": 20, "maxPerSixSeconds": 1 },
    "minShot": 1.2,
    "maxShot": 6.0
  }
}
```

`[V]` here: `requireMove`, `minDistinct ≥ 3`, `maxRun ≤ 2`, "no cut-at-rest on every accent"
(encoded as `cutAtRestMaxShare`), three-plane parallax, `motionMax` exists at all,
`type` reading window, `flash` budget. Everything numeric is `proposed`.
`minShot` / `squash` / `overshoot` / `anticipation` / `boilHz` are the pack's existing values.

### 5.2 Shot — `films/<id>/score.json` → `shots[]`

```json
{
  "id": "s03",
  "beat": "b02",
  "scene": "sc02",
  "duration": 3.2,
  "visual": { "shows": "...", "action": "...", "focus": "...", "link": "v02", "why": "..." },
  "camera": {
    "move": "pan",
    "from": 0.0,
    "to": 0.12,
    "ease": "easeOut",
    "target": "the fare split",
    "focus": "midground",
    "parallax": true,
    "entry": { "position": [0.5, 0.5], "speed": 0.40, "direction": [1, 0] },
    "exit":  { "position": [0.62, 0.5], "speed": 0.05, "direction": [1, 0] }
  },
  "motion": {
    "phases": ["prepare", "action", "contact", "reaction", "decay"],
    "accent": "b02",
    "secondary": ["v02", "hud.meter"],
    "blur": 0.0
  },
  "text": {
    "line": "THE SPLIT",
    "action": "the words assemble along the coin's cut edge",
    "readFrom": 0.6,
    "readTo": 2.6
  },
  "transitionOut": {
    "type": "match_cut",
    "frames": 0,
    "carrier": "the coin edge",
    "match": { "silhouette": "disc", "scaleRatio": 1.0, "angleDeltaDeg": 0, "direction": [1, 0] }
  },
  "direction": {
    "entry": "the coin is still whole",
    "exit": "the coin is split in two",
    "spine": "one price becomes two",
    "cast": ["Kiran"],
    "events": []
  }
}
```

`[V]`: `camera.target` / `focus` / `entry` / `exit` (the seam check needs four numbers, not one
move name), `motion.phases`, `text.readFrom/readTo`, the four `match.*` fields, and the
pair-wise design of `transitionOut` against the next shot's `direction.entry`.
`[V]` negative: **no `duration` constant** — the skill refuses one; 3.2 s is the score's.

### 5.3 Transition — a first-class object between two shots

```json
{
  "transition": {
    "from": "s03",
    "to": "s04",
    "type": "match_cut",
    "frames": 0,
    "carrier": "the torn edge of the map",
    "requires": ["silhouette", "scale", "orientation", "direction"],
    "check": {
      "silhouetteIou": 0.80,
      "scaleRatio": [0.90, 1.11],
      "angleDeltaDeg": 5,
      "directionDot": 0.90
    },
    "forbidden": ["overlay_after_cut", "same_whoosh_every_time"]
  }
}
```

`[V]`: the four `requires` fields (storyboard 23), `forbidden.overlay_after_cut` (storyboard 23),
`forbidden.same_whoosh_every_time` (motion-and-sound 38). The four tolerances are `proposed`.

### 5.4 Sound — `films/<id>/sound.json`

```json
{
  "sound": {
    "mode": "music+sfx",
    "music": { "motif": "...", "development": "...", "contrast": "...", "end": 29.4 },
    "accents": [
      { "t": 4.133, "frame": 124, "perceived": "onset", "kind": "hit", "supports": "s03.transitionOut" }
    ],
    "sfx": [
      { "t": 4.133, "kind": "paper_snap", "event": "s03.contact", "gainDb": -6, "quiet": null }
    ],
    "duck": { "db": 4 },
    "master": { "lufs": -14, "truePeakDb": -1.0 },
    "silence": [ { "from": 12.0, "to": 12.9, "why": "one beat before the drop" } ],
    "accentToleranceFrames": 1,
    "checked": ["balance", "clipping", "clicks", "sync", "tail"]
  }
}
```

`[V]`: `accents[].frame` **alongside** `t` (the skill demands `frame / fps`), `perceived`
(peak vs onset), `supports` (the picture event), `accentToleranceFrames`, `silence[].why`,
`checked` as a named list. Loudness and duck values are ours; the skill gives none.

### 5.5 Review — one page, five statuses

```json
{
  "review": {
    "score": "films/x/score.json",
    "videoHash": "sha256:...",
    "statuses": ["implemented", "verified-by-run", "visible-in-frames", "verified-in-motion", "listened"],
    "rows": [
      { "code": "camera.seam", "interval": "00:04.13", "observation": "speed jumps 0.61",
        "cause": "shot 3 ends at full speed", "fix": "ease the last 4 frames", "rechecked": true,
        "status": "verified-in-motion" }
    ],
    "evidence": {
      "contactSheet": "build/.../sheet.png",
      "seams": ["build/.../s03-s04.mp4"],
      "fullPlayback": true,
      "listened": false
    }
  }
}
```

`[V]`: the `interval → observation → cause → fix → re-check` row shape (review-and-export 7),
the five statuses (51), the non-interchangeable evidence types (41). `listened: false` must
fail the gate — that is the whole point of the status vocabulary.

---

## 6. The strongest rules to adopt

Ranked by how much they would change a paper film tomorrow.

1. **Every shot declares its seam, not just its move.** A move name is not enough: `entry` and
   `exit` carry position, speed and direction, and the cut is checked on all three plus
   acceleration. This is the one thing our `camera:check` does not yet do, and it is where
   polish actually lives.
2. **Waves of speed, and at least one move that crosses a cut.** "Identical ease-in-out with
   zero velocity at every accent" is named as a defect; a film where every shot stops before
   the cut reads as a slideshow. Encode `cutAtRestMaxShare ≤ 0.5`.
3. **A transition is designed together with both scenes and has a named carrier.** Match cut =
   measured silhouette + scale + angle + direction. Mask = the next scene is actually inside
   the mask. An overlay laid on a finished cut is explicitly a lie.
4. **The accent map is built from the real track, in frames, with the audio offset.** `frame /
   fps`, perceived peak vs onset, the picture event it supports, ±1 frame. Same BPM is not
   evidence — and neither is a computed beat grid.
5. **Silence is authored, and a silent file never passes as sound.** Plus: "not created" and
   "not listened" are different statuses. Our gate must be able to print both.
6. **Five honest statuses, and evidence that is not interchangeable.** Contact sheet ≠ seam
   sequence ≠ full playback ≠ listening. A report may not upgrade itself.
7. **Never buy tempo by deleting a required element or speeding past legibility.** This is the
   rule that protects the brief from the edit, and it is measurable: words/second, shot floor,
   presence of every mandatory slot.
8. **Three planes with declared relative motion.** Depth is scale + relative motion + overlap +
   perspective — all four. A traverse over a flat picture is named as insufficient, which is
   the exact failure mode of a lazy paper shot.
9. **Type has a semantic job and a reading window fixed before the animation.** Design the
   readable layout first; the letter action comes after.
10. **A style card describes a language — forms, typography, material, light, camera/rhythm,
    boundary — and never a shot order.** Combined with "3–5 genuinely different variants per
    scene", this is the discipline that stops the next film from being the last film renamed.
11. **Blur and focus must be declared as effects with limits, never as optics we do not have.**
    `motionMax`, `holdMax = 0`, `radialShareMax`, and no blur on type.
12. **No repeating strobe as energy; check luma deltas per frame; never claim flash safety
    without the analysis.** Cheap to encode, expensive to defend otherwise.

---

## 7. What the skill does not say (do not pretend it does)

- No lens, no shutter angle, no f-stop, no camera speed in px/s or %/s.
- No transition duration for any type.
- No shot-length distribution, no cuts-per-minute target, no average shot length.
- No easing curves — only the names, and a prohibition on using the same one everywhere.
- No loudness, true-peak, duck depth or silence floor.
- No storyboard template beyond the eight-row card.
- No numeric pass/fail for "alive", "readable", "balanced" or "on brand".
- Its "3–5 variants", "1–3 controls", "0.6–0.9 s" and "5–7 s probe" are all explicitly
  *examples*, and two of them are examples of what **not** to universalise.

Every number in §5 marked `proposed` is therefore a Paper Studio decision that must be
written into `docs/decisions/` before it becomes a gate — not a citation to this skill.

---

## 8. One-line answer

Vizavi contributes **invariants and refusals**, not magnitudes: a moving camera with checked
seams, depth carried by three planes, transitions designed as pairs with a measured match,
a frame-accurate accent map built from the real track, five honest review statuses, and a
style card that describes a language rather than a shot list. The magnitudes — and every
optics claim a paper film cannot make — remain ours to choose and to justify.
