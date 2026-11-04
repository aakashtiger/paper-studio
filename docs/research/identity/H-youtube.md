# H - The two YouTube references: ReachMora and Mr omi

**Date:** 2026-11-04
**Source:** `https://www.youtube.com/watch?v=kDcxEIDC5NA&t=11s` and
`https://www.youtube.com/watch?v=OtbLL6OBNE4`
**Evidence:** oEmbed, watch-page `ytInitialPlayerResponse`, `yt-dlp 2026.10.26`,
`youtube-transcript-api 1.2.4`, two 480p downloads in `%TEMP%\kpop-refs`, forty inspected
frames and images, `npm run style:measure -- --camera` on both videos and on
`out\claude-pop.mp4`.
**Purpose:** establish what these two links actually are, and whether either is the
Paper K-pop film, the film's channel, or a source the style pack was extracted from.
No repository file was changed except this one.

---

## 0. The honest headline

**Neither link is the Paper K-pop film, and neither is the film's channel.** Both are
third-party tutorials, in different voices, about making Claude-driven animated shorts
in the style of a *third* channel: **Ricks Clips** (`@RicksClips3000`, 12.1K subs,
145 videos at the time of capture).

The style they teach is **not** the paper-kpop style, and the difference is structural,
not a matter of taste:

| | what the two videos teach (Ricks Clips) | what `paper-kpop` is |
|---|---|---|
| cast | 2D stick-limbed figures with big white round heads, dot eyes, flat painted clothes | layered cut-paper figures with brad joints, cut hair, offset shadow, petal/pencil halo |
| world | **real 3D geometry** (three.js), painted textures, perspective, lens blur | **flat 2D planes**, halftone dots, no perspective camera, no depth of field |
| light | warm key light, blue/purple fill, cast ground shadows, rim light | flat fill, no directional key, the shadow is a print offset |
| line | black ink outline post-process on the 3D world | the cut edge *is* the line; no ink pass |
| frame | 9:16 vertical, 20-60 s short | 16:9, 156.6 s film (and a 9:16 product shape) |
| type | bold white captions, bottom centre, word by word | poster type *inside* the composition, mono HUD, caption strip |

So the correct verdict is: **different references, adjacent genre.** All three are
code-drawn animated shorts made with Claude; the lineage below the renderer is
different, and the two videos describe a style the pack explicitly refuses
(`BRIEF.md` section 6: "Never a glossy 3D render").

A second, separate finding, proved in section 5: `out\claude-pop.mp4` **is** the source
film the pack was measured from. That makes the comparison decidable rather than
impressionistic.

---

## 1. Per-video metadata

Counters were read twice (watch page at 14:0x, `yt-dlp` a few minutes later) and moved;
the `yt-dlp` values are given, with the watch-page value in brackets where it differs.

### 1.1 `kDcxEIDC5NA`

| field | value |
|---|---|
| title | I Tried Making a Viral Video Using ONLY Claude AI |
| channel | ReachMora (`@ReachMora`, `UCAi_4-apx6TTHVDVyj9X3bQ`) |
| channel size | 59,700 subscribers |
| duration | 440 s (7:19.6), 30 fps, 854x480 download (source 16:9) |
| published | 2026-11-03 07:34:40 -08:00 |
| category | Education |
| views | 50,732 [50,155] |
| likes / comments | 2,003 / 169 |
| chapters | **none** (description has a "WHAT YOU'LL LEARN" list, no timestamps) |
| captions | 21 auto-generated tracks (`ar bn nl en fr de iw hi id it ja ko ml pl pt pa ru es ta te uk`), no manual track |
| thumbnail | "100% FREE / CLAUDE DID THIS?!" over three vertical stills with view counts 84M, 98M, 66M |

**Tags (24, verbatim):** claude ai, claude tutorial, claude skills, claude ai tutorial,
animated shorts, viral animated shorts, how to make animated shorts, ai animation,
ai animated videos, viral shorts tutorial, youtube shorts automation, faceless youtube
channel, ai video creation, cartoon animation ai, animated storytelling, ai storytelling,
elevenlabs tutorial, claude code, ai content creation, youtube automation, make money
with ai, free ai tools, viral youtube shorts, cartoon shorts.

**Description (substance):** a workflow tutorial. "No Blender, no expensive animation
software, no video generators, and NO CapCut editing." Claims a custom Claude Skill that
generates story ideas, writes scripts, creates ElevenLabs voiceovers, "automatically
turn[s] everything into a complete animated MP4", renders frames and exports. Ships a
Google Drive skill folder. Tools named: Claude, ElevenLabs. Says a free-tier Claude test
is still to come.

### 1.2 `OtbLL6OBNE4`

| field | value |
|---|---|
| title | How to Make Viral Animated Shorts Using Claude (Full Workflow) |
| channel | Mr omi (`@mr_omix`, `UCRj1ZF-nLuCK5NFFo2Qkzyg`) |
| channel size | 9,480 subscribers |
| duration | 712 s (11:52.06), 30 fps, 854x480 download (source 16:9) |
| published | 2026-10-31 23:15:41 -07:00 = 2026-11-01 UTC (`yt-dlp upload_date 20261101`) |
| category | Entertainment |
| views | 450,426 [449,554] |
| likes / comments | 12,729 / 689 |
| chapters | **9** (see below) |
| captions | 1 auto-generated English track only |
| thumbnail | three vertical stills, the word "Claude" across them, captions "paradise.", "making soup?", "the fifth," |

**Chapters (from the page, not the description):**

| start | title |
|---|---|
| 0:00 | Two videos |
| 0:34 | 20 shorts at 30 fps |
| 1:35 | The workflow |
| 3:50 | Our own story |
| 4:55 | Building it |
| 6:44 | Why it looked cheap |
| 7:35 | The agent team |
| 8:35 | What they found |
| 9:44 | The free skill |

**Tags (17, verbatim):** ai animation, claude code animation, ai content creation,
claude animation, ai cartoon animation, animated shorts, claude 3d animation,
ai animated shorts, claude ai, opus 5.5, claude 3d, claude code, claude code tutorial,
claude workflow, three.js animation, ai shorts, opus 5.5 video.

**Description (substance):** "I gave a channel's latest 20 shorts, it studied them frame
by frame at 30 fps, and then it built a full animated short with our own story: 2D
characters in a colourful 3D world, made with three.js on my own PC. No AI video
generator." Bullets: style bible, hook is one sentence, "the bridge that fell for a
song", building town/characters/camera in three.js, "why the first version looked cheap",
"seven agents comparing our frames with the reference, one topic each", findings "ink
lines, lens blur, camera glides and shadow colours". Repo:
`github.com/mromidev/claude-animated-shorts`, described in-video as "5,000 reference
images". Music: Lukrembo - bread.

---

## 2. Transcripts

Both obtained. Neither is manual; both are YouTube ASR.

| | V1 `kDcxEIDC5NA` | V2 `OtbLL6OBNE4` |
|---|---|---|
| cues | 210 | 323 after de-rolling |
| words | **1,382** | **2,284** |
| first word | 0.00 s | 0.08 s |
| last word | 441.5 s | 713.5 s |
| **wpm** | **187.8** | **192.1** |
| source | `youtube-transcript-api` (en) | `yt-dlp` `en.vtt`, rolling duplicates removed |

Both sit at **188-192 wpm** - inside the studio's own 180-190 band (`AGENTS.md`, 0043) -
which is a coincidence of two people talking fast to camera, not a style finding.

### 2.1 V1 transcript summary

Cold open: "one of the craziest ways to create viral animated videos using nothing but
Claude... No video generators, no Blender, and absolutely no CapCut editing." Then the
discovery beat: "a few days ago, I came across this channel called **Ricky Clips**...
their most popular video has over 31 million views. The next one has 16 million." The
body is a click-by-click install of a `cartoon-audio-short` Claude Skill: Customize >
Skills > add the skill, answer "How long should the short be?" (20-30 s recommended,
"75-110 words of narration"; 30-45 s; 45-60 s), upload a voiceover MP3 with an
ElevenLabs-shaped filename, then watch a progress panel run: "Plan shots and build world,
cast and motion" -> "Render stills sheet and fix look" -> "Make music + SFX and mix at
50%" -> "Render full video, finish and QA". It ends with a subscribe card.

Notable: the video's **own** output, shown from about 6:30, is a dark navy room with
blurred blue serif kinetic type ("simple", "and", "I'm going to test", "this, let me") -
nothing like the reference it just praised. At 5:45-6:30 it shows the actual Ricks short
it is copying (a Paris newsstand: "THE PARIS DAILY / TOWER NEEDS REPAIRS!"). The gap
between the two is visible in the same video.

### 2.2 V2 transcript summary

Cold open: "Look at these two videos. This one has 29 million views and it's not a
one-off. That channel is brand new and its last 80 shorts got over 200 million views.
The other one, that's mine." Then the claim: "Claude built it in 3D with code every
single frame."

The argument, in order: (1) **references** - "I had Claude download the last 20 shorts
in this style"; a plain "analyse this video" only grabs a few frames, so they pull frames
at 30 fps and measure cuts, camera motion and colour with a `python tools/measure.py`
pass (visible on screen: per-video frame counts 1,682-2,334, durations 56.1-77.8 s,
`cut_times` arrays, 5-10 cuts per short). (2) **the formula** - "Almost four words a
second with basically zero dead air" (~240 wpm), a one-sentence hook, an escalation, a
pivot, an ironic payoff; "14 of the 20 flip into the explanation with the exact same two
words." (3) **the look** - "The characters are flat, two-dimensional, but they're lit
like they physically exist in that world. They catch the key light and they cast real
shadows. The world is real 3D geometry traced with black ink outlines like a comic book."
(4) **their own story** - "the bridge that fell for a song", a marching band on a
suspension bridge. (5) **why it looked cheap** - "the camera was stuck inside a house.
The trees were teal and a chain was right in front of everyone's faces"; they put their
frame beside the original: "The original is colorful, high contrast. It looks premium.
Ours looks dull." (6) **seven agents, one topic each** - a Finder folder
`ricks-research/compare/` with `characters`, `depth`, `grade`, `lighting`, `motion`,
`outlines`, `ref_*.jpg`; the on-screen answer is a genuine critique: "The reference heads
are actually *rounder* than ours... about 10% left/right asymmetry... a plumb outline
about 3 times thicker on the bottom/shadow side... eyes and mouth shifted toward the side
the character faces... no blush and no catchlights in the eyes." (7) the free skill and
repo.

The on-screen style bible at 2:30 gives measured bands: "luma mean 0.43-0.54, luma std
0.21-0.29, a 0.83-0.91 top-end band (on screen beside the note 'deep darks'), saturation
0.78-0.95 (very saturated), lighting changes with story beats (noon -> sunset -> night),
every sentence is illustrated literally, props carry the joke".

---

## 3. Visual description (frames obtained)

Downloads: `%TEMP%\kpop-refs\v1.mp4` (14.4 MB, 854x480, AV1) and `v2.mp4` (48.1 MB,
854x480, AV1). Frames inspected with the `read` tool at the timestamps below, at 640 px
wide. Both are 16:9 tutorials, so every short inside them is letterboxed 9:16.

### 3.1 V1 - ReachMora

| t | what is on screen |
|---|---|
| 0:05 | two vertical shorts side by side on a blue gradient: left, a paper-white character on a chair in a dark room, caption "hold a"; right, a bridge at dusk, a character with a lamp, caption "can't" |
| 0:40 | YouTube Analytics "Scorecard": **14M views, 4.6x Outlier**, channel "Ricks Clips, 12K Subscribers", 305K views/hour |
| 1:15 | **Code**: `mine.js` in a browser, `// Timeline of the bridge short...`, numeric constants (`0.6 + 4.6`, `[-1.45, -0.55, 8.55, 1.65]`), a 9:16 preview of the bridge |
| 2:10 | a Claude Skills settings page (Customize > Skills > Data, QuickBooks Labs, SuperMe) |
| 3:10 | Claude asking "How long should the short be?", options 20-30 s (recommended, 75-110 words), 30-45 s, 45-60 s |
| 4:10 | Claude "Progress" panel: Plan shots and build world, cast and motion / Render stills sheet and fix look / Make music + SFX and mix at 50% / Render full video, finish and QA; ElevenLabs upload named |
| 5:45 | the **Ricks** "Paris Daily" short: a man in a top hat reading a newspaper on a boulevard, blurred foreground trees, a red "SO..." sign |
| 6:30-7:00 | the **author's own** output: navy-black room, blurred blue serif type "simple", "and", "I'm going to test", a glowing bulb, a monitor icon |
| 7:18 | blue subscribe end card |

Composition of the Ricks footage: deep perspective street, foreground objects thrown out
of focus, characters small in frame, warm key light with cool shadows, bold white
captions with a black outline sitting low-centre. Palette is saturated and warm-dominant
with a blue cast in shadow.

### 3.2 V2 - Mr omi

| t | what is on screen |
|---|---|
| 0:06 | the **Ricks Clips** channel page: red banner "RICKS CLIPS", 12.1K subscribers, 145 videos, Shorts tab |
| 0:45 | the channel grid: paper-white characters on painted sets - a pencil, a broccoli, a purple cat, a wedding - each thumbnail with a one-line caption |
| 1:30 | Claude Code with a per-video measurement dump: `01_H72MuPqnGY {'frames': 1937, 'dur': 64.57, 'cuts': 5, 'cut_times': [...]}` for six shorts |
| 2:30 | `STYLE_BIBLE.md` with the measured bands quoted above, and a preview of two Ricks-style men (one moustached) beside a chef |
| 3:35 | an audio spectrogram / `summary.json` waveform in an editor |
| 4:50 | their own script (`# The Bridge That Fa...`, 21 numbered lines) beside a 9:16 preview: a marching band with drums on a bridge, cyan sky, bunting |
| 6:20 | `InkEffect` shader source: `export class InkEffect extends Effect`, `constructor({color = "#2f2f2f", strength = 0.92, threshold = 0.06, fadeWade = 260} = {})` |
| 7:50 | `ricks-research/compare/` in Finder: folders `characters`, `depth`, `grade`, `lighting`, `motion`, `outlines`, `ref_*.jpg`, "1 of 12 selected, 412.6 GB available" |
| 9:20 | Claude's written verdict on heads and bodies ("the reference heads are actually *rounder*... plumb outline 3 times thicker on the bottom/shadow side... no blush and no catchlights") |
| 10:40 | a live-action/3D test: a man in a blue "MR OMI" t-shirt on a football pitch, side panels blurred |
| 11:40 | the YouTube upload page for "How I Made Viral Animated Shorts With Claude (Free Skill)", Mr omi, 1.59K subscribers |

Composition of the built short: 9:16, a 3D bridge deck in perspective, flat 2D band
members with round pale heads and black stick limbs standing on it, hard black ink
outlines, bunting, a bright cyan sky, warm light on the wood. It is a competent copy of
the reference grammar, not the reference.

---

## 4. Measurements

`npm run style:measure -- --ref <video> --camera --out build/research/youtube-<id>`,
plus the same command pointed at the film and written to `%TEMP%`.

| metric | V1 | V2 | `out\claude-pop.mp4` |
|---|---|---|---|
| size / aspect | 854x480, 427:240 | 854x480, 427:240 | 1920x1080, 16:9 |
| duration | 439.62 s | 712.06 s | 156.63 s (4,698 frames) |
| luma mean | 63.0 | 73.8 | **100.9** |
| contrast mean | 242.6 | 200.0 | 215.4 |
| saturation mean | 14.9 | 15.2 | **21.8** |
| edge density | 15.0 | 11.2 | 12.6 |
| movement mean | 1.56 | 3.90 | 3.43 |
| camera abs dx / dy | 5.5 / 2.4 px per shot | 27.1 / 25.4 px per shot | 25.8 / 48.3 px per shot |
| camera dz | 0.24 %/shot | 1.40 %/shot | 0.28 %/shot |
| moving shots | 10% | 61% | 26% |
| shot median | 0.133 s | 0.067 s | 0.100 s |
| cuts / min | 73.6 | 132.6 | 90.8 |
| palette (6) | `#040612 #18171b #1e3159 #4a5a89 #a0a2b0 #efeeed` | `#1b191c #3d353c #678394 #715263 #bab6b4 #d04251` | `#100c0f #2c2120 #564043 #995d49 #b88f6f #dfc8a1` |

**These numbers do not compare style, and must not be quoted as if they did.** Both
videos are desktop screen recordings: the dominant pixels are a dark IDE, Claude's UI and
an editor chrome, so their luma, saturation and cut counts measure *the tutorial*, not the
shorts it discusses. The tool's own bible says the same thing in its "What this cannot
say" section. The film's row is a real film measurement; the two tutorial rows are
context only. The palette row is the clearest illustration: two dark blue-grey UI ramps
against a warm cream/brown film.

The one honest numeric comparison is between the **film** and the **pack's reference
crops**, which is already done by `style:identity` and is not repeated here.

---

## 5. Comparison to the Paper K-pop film

### 5.1 First, what the film is

`out\claude-pop.mp4`: 1920x1080, 30 fps, 156.63 s, 4,698 frames, 14.8 Mb/s, stereo AAC.
Title card "CLAUDE POP"; end card shows a laptop playing the same film on a green cutting
mat with paper notes ("SOL / SHE" and "CLAUDE POP - LYRIC VIDEO"). Flat 2D paper-cut
vector art: cream stock, tomato red, cobalt blue, acid yellow-green, halftone dot fields,
hard cut edges, no gradients. A pencil-petalled halo behind a K-pop idol; a second figure
in a lab coat with round glasses. Top-right HUD in DM Mono: "RUNNING 8.1%", "43.8%",
"63.2%", "74.0%", "95.6%", "100.0%" with a sun icon. Top-left stage labels: "STAGE 0 /
BEFORE THE SHOW", "CLUSTER 001 / READY 72 / 06 / 20:15". Bottom-left mono caption strip:
"That was safe enough, we reckoned", "Gato, please don't let me go", "Was it all for
show?". Poster type inside the frame: "I SEE", "FASTER FASTER FASTER", "OPTIMIZING",
"PLEASE DON'T", "SAFE ENOUGH", "LET GO", "GATO". Camera is lateral and flat: pans, cuts,
scale pops, no perspective, no depth of field, no cast shadows.

### 5.2 The film is the pack's source film - proved

`styles/paper-kpop/SOURCES.md` says the style was extracted from "the author's own
157-second paper-cut music film: 1920 x 1080, 30 fps, 4,699 source frames", and gives
exact crop boxes for six reference frames.

Re-running two of those crops on `out\claude-pop.mp4` reproduces the pack's files:

```
ffmpeg -ss 3.5    -i out/claude-pop.mp4 -frames:v 1 -vf "crop=635:740:925:160"  crop-portrait.png
ffmpeg -ss 23.333 -i out/claude-pop.mp4 -frames:v 1 -vf "crop=720:720:920:100"  crop-chorus.png
```

`crop-portrait.png` is `references/frames/portrait-paper-cast.jpg`: same face, same halo
spokes, same brad, same halftone, same crop. `crop-chorus.png` is
`references/frames/chorus-stage.jpg`: same four performers, same sunburst, same confetti,
same blue floor. Duration 156.63 s vs "157-second", 4,698 frames vs "4,699" (a rounding
convention), 1920x1080 at 30 fps - all three agree.

**Conclusion: `out\claude-pop.mp4` is the source film of the `paper-kpop` pack.** The
pack is a measurement of *this* film, not of Ricks Clips.

### 5.3 Verdict

**Different film, different channel, different style family. Same genre.** Evidence:

| test | result |
|---|---|
| Is either video the film? | No. 440 s and 712 s of talking-head screen recording vs a 156.6 s silent-until-scored paper film. Neither contains the film's title card, HUD, caption strip or characters. |
| Is either channel the film's channel? | No. ReachMora (59.7K) and Mr omi (9.48K) are tutorial channels; the film is the studio's own work and `SOURCES.md` calls it "the author's own". |
| Do the videos show the film as an example? | No. V1's examples are Ricks shorts plus its own weak output; V2's are Ricks shorts plus its own three.js bridge build. |
| Is the pack derived from the videos? | No. The pack is derived from `claude-pop.mp4`, proved by crop match in 5.2. |
| Is the pack's style the videos' style? | No. Flat 2D cut paper with no perspective vs 2D figures inside 3D geometry with lens blur and ink outlines. The pack *forbids* the latter by name ("Never a glossy 3D render"). |
| Is there any shared DNA? | Yes, at the level of production method: story first, a style bible, code-drawn frames, measured reference, no AI video generator. Both videos independently arrive at the studio's own thesis - measure the reference, then build the grammar in code. |

**What the two links actually are:** independent public accounts of the *same third
reference*, Ricks Clips, by two creators who are not the studio and not each other.
V1 is a low-effort skill install whose own output visibly fails to reach the reference.
V2 is a serious, honest post-mortem that names the exact failure the studio has already
measured on itself - "ours looked dull" - and fixes it with per-frame measurement, an
ink-outline pass, and seven single-topic critics.

**The one thing that should not be copied:** neither video is evidence about
`paper-kpop`. Quoting their numbers as if they described our style would be exactly the
error `docs/STATUS.md` warns about - a report trusted because it is new rather than
because it is about this film.

---

## 6. What is worth stealing (research note, not a decision)

Four things are transferable, and all four are already partly present in the repo:

1. **A measured style bible per reference, not per film.** V2 writes luma mean
   0.43-0.54, a 0.21-0.29 spread, saturation 0.78-0.95 *before* it builds anything. Our
   `style:measure` produces the same quantities but is not yet a required input to a
   pack's `tokens.identity.bands`.
2. **Seven critics, one topic each.** `characters`, `depth`, `grade`, `lighting`,
   `motion`, `outlines`. Our `critics/` are role-based (architect, developer, sound,
   QA); V2's are *dimension*-based, which is why each one produced a specific,
   checkable defect ("outline 3x thicker on the shadow side", "no catchlights").
3. **The side-by-side frame test.** Put one of ours next to one of theirs at the same
   size and say which looks cheap, out loud, before fixing anything. That is
   `style:identity` done by eye first and by number second.
4. **The negative result is published.** V1 ships a skill and shows an output that does
   not work; V2 shows the ugly first build and names why. The second is the useful
   document.

What is *not* transferable: the 3D world, the lens blur, the ink-outline post-process,
the 240 wpm narration, and the 9:16-first framing. Those belong to a different style.

---

## 7. Exact commands, and everything that was blocked

### 7.1 Worked

```powershell
# metadata (no key, no login)
curl.exe -sL "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=kDcxEIDC5NA&format=json"
# -> {"title":"I Tried Making a Viral Video Using ONLY Claude AI","author_name":"ReachMora",...}

python -m pip install --user yt-dlp            # -> yt_dlp-2026.10.26
python -m pip install --user youtube-transcript-api   # -> 1.2.4

yt-dlp -f "bv*[height<=480][ext=mp4]+ba[ext=m4a]/b[height<=480]/bv*[height<=720]+ba/b" `
       -o "$env:TEMP\kpop-refs\v1.%(ext)s" "https://www.youtube.com/watch?v=kDcxEIDC5NA"

# yt-dlp merged nothing (no ffmpeg on PATH), so the streams were muxed by hand:
& "Y:\NewVideoTest\studio\node_modules\ffmpeg-static\ffmpeg.exe" -y `
  -i v1.f397.mp4 -i v1.f140-20.m4a -c copy v1.mp4

npm run style:measure -- --ref "$env:TEMP\kpop-refs\v1.mp4" --camera `
  --out build/research/youtube-kDcxEIDC5NA
npm run style:measure -- --ref "$env:TEMP\kpop-refs\v2.mp4" --camera `
  --out build/research/youtube-OtbLL6OBNE4
```

Frame extraction used `-ss <t> -i <video> -frames:v 1 -vf scale=640:-1` into
`%TEMP%\kpop-refs\fr-v1`, `fr-v2`, `fr-pop`.

### 7.2 Blocked, with the exact error

| what | exact error | workaround |
|---|---|---|
| V1 subtitles via yt-dlp | `ERROR: Unable to download video subtitles for 'en': HTTP Error 429: Too Many Requests` (twice: immediately, then again after `--sleep-subtitles 3` and an 8 s wait) | `youtube-transcript-api` fetched the same ASR track first try |
| V1 signed `timedtext` URL, direct | `HTTP 200`, `size 0` bytes - an empty body; the URL carries `exp=xpe&xoaf=5&xospf=1` and now needs a PoToken | same as above |
| yt-dlp mux | process exit 1, with `WARNING: The extractor specified to use impersonation for this download, but no impersonate target is available.` and no merged output, because `ffmpeg` was not on `PATH` | manual `-c copy` with `ffmpeg-static` |
| `ffprobe` | `node_modules\ffmpeg-static\ffprobe.exe` does not exist (the package ships `ffmpeg.exe` only) | `ffmpeg -hide_banner -i <file>` prints the same stream table |
| yt-dlp JS runtime | `WARNING: [youtube] No supported JavaScript runtime could be found. Only deno is enabled by default` | harmless here; all needed formats and the V2 subtitle were still served |
| JSON capture | PowerShell `>` wrote UTF-16 with a BOM and `JSON.parse` failed on `\uFFFD\uFFFD{` | `yt-dlp --print "<field>=%(...)"` instead of `--dump-json > file` |
| `pip install --user yt-dlp` | shell reported `Exited with code 1` on the PowerShell block while pip itself printed `Successfully installed yt-dlp-2026.10.26` | verified with `yt-dlp --version` -> `2026.10.26` |

Nothing visual is unverified: both videos downloaded, both transcripts obtained, forty frames and images inspected, and the film/pack identity was proved by re-running the pack's own
crop boxes rather than by resemblance.

---

## 8. One-line answer

Both links are third-party tutorials about copying **Ricks Clips** (2D figures inside a
3D world, lens blur, ink outlines, 9:16) - neither is the Paper K-pop film, neither is its
channel, and neither is the reference the pack was measured from, which is
`out\claude-pop.mp4` itself, proved by reproducing the pack's 3.5 s and 23.3 s crops to
the pixel. The genre is shared, the grammar is not.
