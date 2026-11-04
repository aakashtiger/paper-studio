# Blind test v3 - Paper K-pop

**Designer:** blind. Phase 1 was written before opening `out/claude-pop.mp4`, the six reference frames, or any render of this channel.
**Spec read:** `docs/research/identity/KPOP-IDENTITY.md` v1.3 and `kpop-identity.proposed.json` v1.3, those two files only.
**Date:** 4 November 2026.

**Format note, recorded not designed around:** the brief asks for 5 shots in 30 s. `identity.edit.formats.30s` asks for 10-13 shots with `maxS: 5.0`. Five 6.0 s shots cannot satisfy that field. This file follows the brief; Phase 2 measures what the brief costs.

---

# PHASE 1 - the concept

## 1. The film

**ONE MORE** - a paper idol is clicked into one more take by her host, until she takes the clicker and poses herself.

- **Tone:** sweet-sinister. The threat is the show itself: a warm, cute, sold-out stage that will not let her stop. The joke is on the machine of stardom, never on her. One tender beat, in the dark, no joke.
- **Performance mode:** `stage-show` (I for a song film). Not a presenter-show: Tock hosts, but the film is her number.
- **Sound:** song-led, 5 sung lines, 41 words, ~91 wpm over a 26.9 s voiced span. The click is a rim-click **in the track**, not a foley cue (`sound.song.addedSfx: false`). Music is parked; this is the design, not a render claim.
- **Story spine:** 5 beats, 5 acts, 5 shots - poster, click, rack, dark, bow. A rise-and-fall that ends with her owning the click.

### The eight tone beats, in order

| # | Beat | Where |
|---|---|---|
| 1 | bright surface | S1: the poster folds open, cream and gold, she smiles |
| 2 | first threat | S1 last second: the meter already reads **TAKE 047** |
| 3 | cute-in-danger | S2: Tock clicks her shoulder; she snaps pose, still smiling, keeps singing |
| 4 | comic escalation | S3: three clicks, three poses, the fan sheds a pleat per click |
| 5 | dark act | S4: ink field, one 120 px pool, she is held in a pose that is not hers |
| 6 | tender beat | S4 back half: she peels the tape off her own wrist; the meter folds to **001** |
| 7 | resolve | S5: she takes the clicker and clicks her own brad |
| 8 | button | S5 last: Tock frozen mid-click, wheeled off like a prop; the fan shuts on her wink |

## 2. Cast - two principals, three chorus

### RILLA - the star

| | |
|---|---|
| Stage role | `star` (addresses the audience, holds a mic, owns the signature move) |
| Silhouette | 720 units. Head + fan crown 25% of height, torso 32%, legs 38%, shoulders 20%, boot 10%, hand 2.5%. Visual head-to-body 4.8 (doll, not human) |
| Ornament | a **folded paper fan crown**, 12 pleats, 52% of her height across - not a flower, not a halo |
| Costume | tomato-red cropped jacket (`main`), cream shirt (`paper`), oxblood 7-pleat skirt (`skirt`), gold platform boots (`boot`), gold brads (`metal`), ink hair |
| Three features | (1) the 12-pleat fan crown, readable at 390 px; (2) the stiff left hair-flip that breaks the bob silhouette; (3) one gold epaulette on the **right** shoulder - the shoulder the clicker lands on |
| Face | drawn face plate, blush, one tooth, an ink beauty mark under the left eye; 10 eyes x 7 mouths = 14 expressions |
| Poses | 8, including 4 performance poses: the point, the hair-flip, the mic-hold, the 90 deg bow |
| Signature move | **the click-bow**: she snaps her own wrist to her shoulder and bows at 90 deg with one eye open |
| Whole film | she is the subject of 5/5 shots and sings all 5 lines |

### TOCK - the host / foil

| | |
|---|---|
| Stage role | `host` (an MC, not a narrator) |
| Silhouette | 580 units, short and wide: head + cone 27%, torso 34%, legs 33%, shoulders 22%, boots 8% |
| Ornament | a **cream paper megaphone cone** worn as a hat, mouthpiece forward - he speaks through it, so his mouth is never seen |
| Costume | acid tabard (`main`), cream shirt, ink trousers, red sneakers with the gold bar, a lanyard of 3 paper tickets |
| Three features | (1) the cone hat; (2) an oversized flat **clapper hand** - a palm with a red button where the thumb should be; (3) the ticket lanyard |
| Voice | silent except one backing-vocal shout, "ONE MORE!", inside the track. No VO in a song film |
| Function | he clicks her into each pose. He is never cruel; he is a stage manager doing his job, which is worse |

### THE UNDERSTUDIES - chorus, 3

Identical rig to Rilla, scale .55-.68, fan crowns in cream / red / ink. They live on a **doll rack** at stage left (a rail with 3 hooks) and step down when clicked. They copy every pose **2 frames late**, and always 3 deg wrong - which is the point of S5.

## 3. Performance frame

| Field | Value |
|---|---|
| Mode | `stage-show` |
| Stage share | 5/5 shots (>= 0.60) |
| Performer presence | 5/5 shots (>= 0.85) |
| Detail/diagram share | 0/5 (<= 0.40) |
| Giant stage object | **the giant fan** - 24 pleats, 7 m, the world's scale anchor, and the film's clock: it opens one pleat per act, snaps fully open in S5, and folds shut as the curtain |
| Stage devices | proscenium arch, paper curtain, riser, mic stand, doll rack, fly-poster wall |
| Spotlights | 2 practicals: one acid cone (S2-S3) that lights **the brad**, not the stage, and one cream pool (S4) |
| Audience | 24 paper silhouettes in the stalls; frozen except one cue - they raise light sticks on line 2 |
| Entrance | **the fold**: she unfolds out of the folded fly-poster in S1 |
| Exit | **the curtain**: the fan folds shut over her, back into the same poster, last frame stamped TAKE 001 |
| Formation changes | 3: rack -> line (S2), line -> diagonal (S3), wheel Tock off (S5) |
| Signature shot | S5, the self-click (below) |

## 4. Field script and motifs

### Field script (5 roles, one per act, no consecutive repeat, no blue)

| Act | Shot | Field | Share | Why |
|---|---|---|---|---|
| I | S1 | **cream** `#F2E8D5` | .34 | the poster, the dressing room, the world before the show |
| II | S2 | **red** `#E8452A` | .42 | the number; the stage is loud and warm |
| III | S3 | **acid** `#D9F24B` | .38 | the poison becomes the room; escalation |
| IV | S4 | **ink** `#171310` | .46 | the dark act; one cream pool is the only warmth |
| V | S5 | **gold** `#F5B93F` | .40 | resolve; the accent becomes the stage |

Roles used in the film: paper, red, acid, ink, gold = **5** (the short-film cap). No blue at all.

**The accent is the joint.** One accent per frame, and in four of five shots it is the gold brad at her right shoulder - the exact 3.5 px that the plot turns on. S4's accent is the acid meter in the dark; S5's is the red button on the clicker.

### Motifs (4)

| Motif | Uses | Meaning |
|---|---|---|
| `sunburst` | 5 | the 24-pleat fan: backdrop, crown, entrance, curtain, clock |
| `meter` | 4 | the **TAKES** readout, top-right, diegetic: 047, 048, 312, 001. It is the film's stakes and its only HUD |
| `torn-strip` | 2 | a pleat tears off the fan on each of her three clicks in S3 |
| `iris` | 2 | the spotlight closing to a coin in S4; the mirror in S4 back half |

Semantic object with a transformation arc: the **clicker** - the thing that poses her becomes the thing she poses herself with. It is a prop, not a library motif, so the motif list stays at 4.

## 5. The words - lyric, hooks, behaviours

Sung lyric, 5 lines, one per shot. Cut on the line.

1. *Roll the poster out and count me in* (8)
2. *Click my shoulder, start the whole song again* (8)
3. *Every single take I lose another pin* (7)
4. *Leave the little light on so I can stand* (9)
5. *One more take and then I'm only, only mine* (9)

Display hooks (Anton): **ONE MORE** (S1), **AGAIN** (S3), **MINE** (S5) = 3 hooks. Mono (DM Mono): subtitle band, the meter, the credits. Two systems, never three. Behaviours: **fold** (S1 hook unfolds with the poster), **stamp** (S3 hook stamped onto the fan), **drop** (S5 hook drops onto the closed fan).

## 6. The five shots

### S1 - THE CREASE - 0.0-6.0 - Act I

- **Field:** cream fly-poster wall, red print marks, the giant fan closed to a single crease.
- **Framing:** wide. Subject 24% -> 44% height inside the shot (she starts folded); centroid x .55; feet 1004 px.
- **Camera:** `pull_back`, z 1.22 -> 0.98 (dz .24), focus on the crease, easeOut. The world opens at the same rate she does.
- **Action:** (1) a boot toe taps three times from inside the fold; (2) the poster folds open along the crease and she steps out; (3) the fan behind opens three pleats, one per tap. Hero: the unfold.
- **Paper event:** **fold** - the poster opening.
- **Text:** Anton **ONE MORE** (2 words, 128 px, upper-left) folds open on the third tap; mono label TAKE 047, top-right, at frame 0 - the first threat, before she is fully out.
- **Transition:** hard cut on "in".

### S2 - THE CLICK - 6.0-12.0 - Act II

- **Field:** red stage, ink floor, gold fan ribs, the fan open 6 pleats.
- **Framing:** medium two-shot. Rilla 46% at x .58, Tock 38% at x .30; feet 1002 / 1006; both inside the centre two-thirds.
- **Camera:** `orbit`, dz .08, arc 20 deg right-to-left around the pair, focus on her right shoulder.
- **Action:** (1) Tock raises the clapper hand; (2) the click - she snaps pose A -> pose B with 2 anticipation frames and 1.05 overshoot; (3) the three understudies step off the rack in unison. Hero: the snap.
- **Paper event:** none (saved for S3).
- **Text:** mono subtitle line 2; the meter ticks 047 -> 048 in acid. Two boxes, **one** family (mono: subtitle + meter); no display type in this shot.
- **Transition:** **flash**, .25 s at alpha .45, on the click. Designed transition 1.

### S3 - THE RACK - 12.0-18.0 - Act III

- **Field:** acid field, red figure, ink floor, fan open 9 pleats, one pleat already missing.
- **Framing:** medium-close. Rilla 50% at x .50; the chorus row at 26% behind (ratio 1.92); feet 1002.
- **Camera:** `track`, +280 px right, following her as the clicks walk her across the stage.
- **Action:** three clicks in 1.8 s - the point, the hair-flip, the bow - each with 2 anticipation frames and 3-frame hair lag; the chorus copies 2 frames late; the meter spins 048 -> 312. Hero: the third click.
- **Paper event:** **tear** - one pleat rips off the fan per click, three strips flutter down.
- **Text:** Anton **AGAIN** (148 px, upper-right, opposite her) stamped onto the fan, not onto her; the meter spins. Two boxes, two systems.
- **Transition:** hard cut on the third click, on motion.

### S4 - THE LITTLE LIGHT - 18.0-24.0 - Act IV

- **Field:** ink. One cream pool. Acid only on the meter. The fan is ribs, no paper.
- **Framing:** medium -> close. Subject 50% -> 84% height, centroid x .52, feet clipped by the push (allowed for a close).
- **Camera:** `push_in`, dz .22, anchor on her right wrist, easeInOut. One move, one idea.
- **Action:** (1) she holds a pose that is not hers - one arm up, weight on one toe, chin lifted by the click; (2) the iris closes from 900 px to a 120 px coin; (3) she peels the tape off her own wrist; (4) the meter folds 312 -> 001 like a flip-clock. Hero: the peel.
- **Paper event:** **fold** - the meter's digits fold over.
- **Text:** mono subtitle line 4, no display type, no joke in the frame. The meter reads 001 in acid.
- **Transition:** hard cut.

### S5 - THE BOW - 24.0-30.0 - Act V - **signature shot**

- **Field:** gold. The fan is fully open, 24 pleats, acid only on the clicker's edge.
- **Framing:** wide. Subject 20% at x .55, Tock 26% at x .30, the fan 92% wide; the whole theatre visible for the first time since S1.
- **Camera:** `crash_zoom` dz .60 onto her thumb on her own brad, then `pull_back` dz .14 after the reveal (a secondary move motivated by the reveal), ending on the poster frame.
- **Action:** (1) she takes the clicker out of Tock's clapper hand (grip 11 px below his wrist, transferred to her palm); (2) she clicks **her own** shoulder brad and snaps into a pose that is hers - the arm 3 deg lower than the chorus's copy, the chin 2 deg off; (3) the fan snaps fully open in one hit; Tock freezes mid-click; the chorus wheels him off like a prop. Hero: the self-click.
- **Paper event:** **snap** - the whole fan opens at once.
- **Text:** Anton **MINE** (220 px) drops onto the frame on the click; mono credits, 14 px, left, on the closed poster in the last beat.
- **Transition:** none. The fan folds shut over her - the same fold she came out of - and the last 0.8 s holds the closed poster, stamped TAKE 001.

**Why it is the signature shot:** the film's whole grammar is "a click re-poses a paper body". Every other shot spends that grammar on her; this one gives it to her. The crash lands on a thumb, not a face; the stage re-forms around a pose she chose; and the chorus proves it is hers by getting it 3 deg wrong.

## 7. What this concept claims against the spec

| Field | Claim |
|---|---|
| `performance.stageShareMin` | 5/5 stage shots |
| `performance.performerPresenceMin` | 5/5 |
| `performance.detailShareMax` | 0/5 |
| `camera.movingShare` | 5/5 |
| `camera.distinctMovesShort` | 5 (pull_back, orbit, track, push_in, crash_zoom) |
| `camera.maxRun` | 1 |
| `composition.heightTiers` | 3 (20 / 46-50 / 84) |
| `composition.heightSdMin` | 17.6 points (sample sd of 34, 46, 50, 67, 20) |
| `composition.centroidX` | .50-.58 in 5/5 |
| `field.share` | .34-.46 |
| `field.edgeBarMax` | 0 bars |
| `motifs.perFilm` | 4 |
| `type.maxSystems` | 2 |
| `type.hooksPerFilm` | 3 |
| `edit.cutOnWord` | 4/4 cuts land on a sung line (one line per shot) |
| `tone` | 8 beats, 1 tender beat, 1 poison accent (acid) |

**Known tension in this concept, stated up front:** 5 shots cannot satisfy `edit.formats.30s` (10-13 shots), and at n = 5 every camera share is quantised to 20%, which exceeds `crashShare` (5-15%) and `tiltShare` (5-15%) whatever I choose. Phase 2 takes this up.

---
---

# PHASE 2 - after the frames

## 0. What I looked at, and the blindness caveat

- The six crops in `styles/paper-kpop/references/frames/`.
- Five frames from `out/claude-pop.mp4` at **4, 38, 78, 118, 152 s** (saved to `build/blind-test-v3/ref-1..5.jpg`).
- Measured with `ffmpeg signalstats`, so the judgement is not only by eye.

| Frame | Content | YAVG | SATAVG |
|---|---|---|---|
| crop `chorus-stage` | star + 3 chorus, marigold sunburst, blue floor | 133.0 | **62.2** |
| crop `portrait-paper-cast` | hero close, orange field | 161.5 | **58.9** |
| crop `throne-orbit` | star + gold crown, oxblood wall | 76.6 | **51.6** |
| crop `macro-prop` | paper cube stack | 184.8 | 27.5 |
| crop `open-sunflower` | sunflower on dark | 125.6 | 20.7 |
| crop `desk-diorama` | doll on cutting mat | 193.2 | 18.5 |
| film 4 s | "I SEE SPARKS", cast, blue floor | 151.5 | 44.0 |
| film 38 s | P(DOOM) chorus number | 117.9 | **58.7** |
| film 78 s | museum, ENIAC | 92.4 | 19.3 |
| film 118 s | "BREAKING", pastel houses | 178.0 | 16.8 |
| film 152 s | desk pullback | 64.8 | 19.0 |

Two checks before the critique:

1. **The spec's numbers reproduce.** My six-crop mean is Y 145.8 / SAT 39.9; the document says 145.8 / 39.8. The instrument agrees with the document.
2. **The blindness was partial.** I was blind to the pixels but not to the evidence: v1.3 already told me the cast has a petal halo, the HUD is a meter, the closer is a desk pullback, the median is 2.86 s and the palette is marigold/tomato/oxblood/cobalt. Any likeness below is partly the spec's doing, and that is the honest limit of this test.

**The measurement that matters most:** the two performance frames sit at SAT **58.7-62.2**; the three muted frames at 16.8-19.3. The five-sample mean is 31.6 because a 156 s film alternates registers. `filmBands.saturation` is **[12, 35]**, a whole-film mean. **A 30 s film cut from the channel's performance frames fails it.**

## 1. Does the concept read as the same channel? - **7/10**

| Axis | Score | Why |
|---|---|---|
| Construction / archetype | 9 | fan crown, drawn face, doll proportions, 3 named features, stage role - this is the channel's cast |
| Performance frame | 9 | star, host, chorus on a rack, entrance, exit, signature move, giant object; it is a show, not a diagram |
| Set / field | 8 | full-bleed, per-act field, crowd, floor lip; but the stage is a **proscenium theatre**, not a concert stage |
| Type | 7 | right families and behaviours; my hooks are 128-220 px (the channel's are 80-170 px) but always in a corner, never **behind** the cast as part of the set |
| Camera | 6 | 5 distinct moves, all moving; but nothing in my shot list proves the channel's lateral travel and orbit feel |
| Motifs / HUD | 6 | the fan and the brad are good; the TAKES meter is the P(DOOM) meter's twin |
| Palette / surface | **5** | no cobalt, no giant sun, one acid act the channel never uses. This is where the 3 lost points are |
| Edit | **4** | 5 shots at 6.0 s is a poster set; the channel is 2.4-3.2 s, 18-24 cuts/min |
| Tone | 8 | sweet-sinister, one tender beat, the joke is on the show, not on her |

**7/10.** With the same shots cut to 10-12, a cobalt grid floor and a full sun disc behind her, this is 8.5. As written, a viewer would say "same channel, different episode, slower".

**What matches, in the frames' own terms:** the cast silhouette (tube body, petal-scale ornament, blunt boots), the giant radial object behind the star, the torn black subtitle band with the red `LYRIC` label, the mono HUD in the top-right, the poster headline with a cream keyline, the crowd of black silhouettes at the bottom edge, the halftone and grain, the saturated warm field.

**What does not:** every stage shot sampled (4 s, 38 s; a blue floor strip survives at 78 s) stands on a **cobalt floor with a perspective grid**, and a **sun disc appears in four of five** samples. I have neither. Those are the two most repeated graphic facts in the channel, and I traded both for a theatre.

## 2. Performance or diagram? Which field forced it?

**It is a performance, and the field that forced it is `identity.performance.pureFable: false` (X).** It is the only hard ban in the performance block, and it rules out the fable option outright. The rest of the block then constrains *what kind* of performance: `modes` + `defaultMode: stage-show` + `modeScopes` (only stage-show is `I`; presenter and creature are signed `V`) make a stage the path of least resistance; `star: 1` and `signatureMove: 1` force a star who owns a gesture; `entrance: 1` and `exit: 1` force a before and an after; `giantObject: 1` forced the fan; `showTest` ("remove the story: is there still a performance?") is the sentence I designed against.

**But the block forces a performance *frame*, not a *proportion*, and that is the residue of the Uber failure:**

- `performance.detailShareMax: 0.4` still allows **4 of 10 shots** to be diagrams. That is not a footnote; it is a slide deck with a host.
- `presenter-show` is a signed variant with no content restriction, so any topic can become a desk demo.
- Nothing in the block requires the performance to *be the argument*. My film argues through a performance; the Uber film argued through diagrams and performed the wrapper.

**So: the spec forces a stage. The director still decides whether the film is a number or a lecture.** My film is a number because I wrote a power drama about a body being posed - `performance` did not supply that, it only refused the alternatives. The proof that this is still open is in the document's own §5.4: Uber passed 24 checks.

## 3. Every divergence, and the exact field that caused it

| # | Divergence from the channel | Field that caused it | What it costs |
|---|---|---|---|
| D1 | 5 shots at 6.0 s, one cut per sung line | `identity.edit.formats.30s` (`shots [10,13]`, `medianS [2.4,3.2]`, `maxS 5`) has **no 5-shot form**; the brief cannot be expressed | the film reads as a poster set, not the channel's cut rhythm. The spec correctly refuses the brief - but then the brief is unwritable, which is its own problem |
| D2 | **No cobalt, no blue floor** | `identity.sets.floor` carries geometry only (`radialLines`, `horizontals`, `tornLipPx`) and **no colour role**; `palette.blueShare [0,.20]` + `blueMedianMax .05` + `blueOnBlue (X)` price blue as a cost and never say where it belongs | the single largest area of blue in the channel is its floor. My stage is a warm box; the reference's is a blue-gridded stage |
| D3 | **No giant sun / gold ring** | `identity.motifs.maxShotShare 0.4` + `identity.performance.stageDevice` (proscenium, sunburst, spotlight, LED, riser, curtain, trapdoor, mic stand - **no sun disc**) | the channel's most constant graphic (4/5 samples) is unrepresentable. A backdrop that appears in most shots is illegal as a motif and unlisted as a device, so I invented a fan |
| D4 | Acid as a 20% field | `palette.fieldRoles` lists acid with no "observed" vs "allowed" distinction; the only brakes are `warmShare` and `lumaMean` | the loudest fifth of my film is a colour the reference never uses as a field. It will read as a different (harder) channel |
| D5 | A gold field with the accent re-pointed to a red button | `palette.accentPerFrame: 1` and `palette.fieldRoles` **both** include `accent` | a field that is the accent leaves no accent. The rule contradicts itself; I had to argue my way out in prose |
| D6 | The TAKES meter is the P(DOOM) meter relabelled: same slot, same behaviour, same acid digits | `identity.hud` (F, "recommended, not mandatory") bans copying the *label*, not the *object class*, the *slot* or the *escalation* | my strongest same-channel cue is my weakest variation. `variation.requiredDifferences` has no `hud` entry |
| D7 | A proscenium arch, i.e. two legal vertical bars | `field.edgeBarMax .08` measures width, and the prose exemption "a designed bar is allowed only if it is part of the set" is the same sentence Uber's wall would use | the arch can pass the letter and still read as a frame inside the frame - the exact failure the rule exists to stop |
| D8 | The signature shot is a **thumb** macro at 84% height | `composition.framingMix.extreme [0,.1]` + `subjectHeight [.13,.92]` allow it; nothing says what an extreme close may *be* | the reference's closest shots are faces and props, never a body part. My poster frame is a new register, not a channel one |
| D9 | Hooks sit in the corner, never behind the cast | `identity.type` position ("opposite the subject"), `textOverFace (X)`, `maxBoxes 2` - there is no "behind and occluded" mode | the channel's monumental `P(DOOM)` / `I SEE SPARKS` layout, with the cast in front of the type, is not expressible in my score. My type stays a caption; the channel's becomes the set |
| D10 | An acid tabard on the foil | `identity.cast.costume` says "palette roles only"; there is no cap on how much of a costume may be the poison accent | the threat colour becomes a garment. The poison accent is supposed to mark the threat, not dress it |
| D11 | A host in a song film who does not sing | `sound.voiceLedRequires: presenter-show` + `performance.stageRoles` includes `host`, but nothing defines a host's voice in a song film | my Tock is mute except a backing shout I invented, and no field authorises or forbids it |
| D12 | No empty world shot - no desk-diorama breath | `performance.performerPresenceMin .85` (`detailShareMax .4` would have allowed it); my choice to run 5/5 | the channel's calm comes from shots with no performer. My film never stops performing, which is right for the story and wrong for the rhythm |

**The deepest divergence is not in the table.** The reference is *on* a stage; my film is *about* a stage, backstage, with a proscenium and a dressing-room pool. That is partly a set-family choice (`theatre`), but it was forced by `tone.darkActMin: 1` inside a 5-act film: a dark act must be 20% of the film, so it must be a different room, so the film leaves the stage. **`tone.darkActMin` plus a 5-shot budget buys a genre change.** In 10 shots I would have kept one stage and dropped the light, and the film would read closer.

## 4. The three failures

### Office-worker lead - *prevented by rule, not by check*

Fields that name it: `cast.archetype: paper-pop-performer`; `performerTest` items 2 and 7 (3+ features **and** a declared stage role); `forbidden: office-worker-lead`; `tone` requires a sincere character, not a suit.

What actually enforces it: **`identity.performance`**, not `identity.cast`. An entrance, an exit, a signature move and a chorus turn a suit into a costume. Kiran and Vaz had construction and still read as office workers; they had no stage role and no number.

What does **not** prevent it: any check. §5.4 says the gate proves anchors, body, 8 poses, 14 expressions - "that is why a film can pass 24 checks and still be ~25% of the channel", and `style:identity`'s required Uber failures are field, centroid, contrast, motifs and blue-on-blue, **not archetype**. A blazer and a lanyard on Rilla would pass every numeric band I can name.

**Verdict: the rule is right, the gate is blind.** Missing `checks.archetype` and a required `score.cast[].stageRole` + `features[3]` that a human signs.

### Blue-on-blue - *prevented for Uber's shape, not for the channel's own*

Fields: `palette.blueOnBlue (X)`; `figureBlueMax .30`; `blueShare [0,.20]`; `blueMedianMax .05`; `blueFrameMax .60 (V)`; `localContrastMin 20`; `forbidden: blue-on-blue`. Seven overlapping fields. This is the best-specified failure in the document.

The hole is in the definition, not the count: **"figure-blue > .30 **and** field hue 195-255 **and** |ΔL| < 18"** tests the **global field role**. The reference's own look is a cobalt skirt and boots on a **cobalt floor** under a red field - a blue-on-blue the rule will never fire on, because the "field" is red. A figure at .29 also passes; `blueFrameMax .60` also permits a whole blue act.

`checks.frames` already proposes "p5/p50/p95 + 3x3 region grid". The blue rule was not updated to use it.

**Verdict: Uber's failure is caught; the reference's own blue-on-blue risk is not.** Missing `palette.blueOnBlueProbe: "surrounding ring"` and `palette.blueFloorWithBlueFigure: false`.

### Side bars - *prevented, with a prose exemption the same shape as the bug*

Fields: `field.edgeBarMax .08`; `field.noCreamPlateWithWings (X)`; `field.fullBleed`; `composition.centroidX [.30,.75]`; `forbidden: side-bars`. Five fields, and my concept has 0 bars, so it passes trivially.

Holes: (a) `edgeBarMax` has no operational probe - it is a declaration of a designed bar, and the exemption "a designed bar is allowed only if it is part of the set" is prose. (b) Horizontal letterboxing is not covered. (c) A proscenium leg under 8% is a legal bar, and I designed two.

**Verdict: prevented for Uber's 19% wings; the "it's a wall" loophole survives in exactly the sentence Uber would use.** Missing `field.edgeBarProbe` (a flat-column test), `field.letterboxMax`, and `sets.proscenium.maxLegPct`.

## 5. What is still missing - exact fields

**Calibration and format (these change verdicts, not prose):**

1. `identity.filmBands.byFormat` (or `.basis: "performance-only"`) - `saturation [12,35]` is a 156 s mixed-film mean. The channel's own performance frames are **58.7-62.2**. A 30 s all-performance short fails the band while being more on-channel. This is the single most consequential gap.
2. `identity.edit.formats.teaser` / `shotsMin` per form - no way to declare 5 shots / 30 s, so a teaser is unwritable.
3. `identity.camera.shareSampleMin` + a per-share tolerance - at n = 5 every share is 20%, and `crashShare` / `tiltShare` (both 5-15%) are unsatisfiable by arithmetic.
4. `identity.performance.diagramShareMax: 0.2` (from 0.4) + `diagram.mustBeHeld` - 4/10 diagram shots still passes today.

**The channel's graphic spine (all currently unrepresentable):**

5. `identity.sets.floor.role` - the floor has geometry and no colour; the channel's is cobalt.
6. `identity.sets.backdrop` (or `motifs.setConstant`) - a graphic that appears in most shots (sun, fan) needs a third class: motif (2-5 uses, <=40%), device (a list), **set constant** (>=80%).
7. `identity.performance.stageDevice` is missing `sun-disc`, `fold-fan`, `arch-leg`.
8. `identity.palette.bluePlacement: ["costume","floor"]` - where blue belongs, not only where it is banned.
9. `identity.palette.blueOnBlueProbe: "surround-ring"` (and `checks.frames`' 3x3 grid applied to this rule).
10. `identity.palette.accentAsField` - resolves `fieldRoles ∋ accent` vs `accentPerFrame: 1`.
11. `identity.cast.costume.accentMax` - the foil may not wear the poison accent above a declared area.

**Layout and register:**

12. `identity.type.occlusion` - "the hook may be a set layer behind the cast, never over the face". The channel's signature layout.
13. `identity.composition.extremeSubject: [face, prop, mark]` - what an extreme close may be; a thumb is outside the reference's register.
14. `identity.field.edgeBarProbe`, `identity.field.letterboxMax`, `identity.sets.proscenium.maxLegPct`.
15. `identity.hud.class` + `variation.hudDiff` - the P(DOOM) *class* (a top-right escalating number) can be relabelled; only the label is banned.
16. `identity.performance.hostVocal` - a host inside a song film has no defined voice.
17. `identity.sound.musicParked` / `sound.mode: "temp-track"` - `songFilmDefault: song-led` **plus** parked music **plus** `voiceLedRequires: presenter-show` means the only buildable 30 s film today is a signed presenter-show. That is a live blocker, not a missing nuance.
18. `checks.archetype` - a human-signed archetype pass tied to `score.cast[].stageRole` and 3 named features. The one failure the document was written for is the one the gate cannot see.

## 6. If I revised once

Keep: the cast, the click grammar, the fan-as-clock, the tender beat, the self-click. Change, in order of cost:

1. Cut to 10-12 shots at 2.4-3.2 s, or drop the 30 s claim.
2. Cobalt grid floor + a torn cream floor lip - restore the channel's largest blue and its perspective.
3. A paper sun disc as a **set constant** behind the fan, not a motif.
4. Drop the acid act to an accent; the escalation goes tomato -> oxblood, and the resolve goes gold.
5. Put one hook **behind** the cast, occluded, at 180-220 px.
6. Relabel the meter as a printed call-sheet counter, not a top-right HUD - or move it to the floor, cut into the stage lip.

## 7. One line

The spec gave me the performer, the stage, the frame and the ban; it did not give me the **cobalt floor**, the **sun**, or a **saturation band that survives a short film** - and those three are why this reads as the same channel at 7 and not 9.
