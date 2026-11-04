# I — Frames: composition, palette, character placement and contrast of the canonical Paper K-pop film

**Date:** 2026-11-04
**Film:** `Y:\NewVideoTest\out\claude-pop.mp4` — 1920×1080, 30 fps, 4,699 frames, 156.63 s
**Frames:** `Y:\NewVideoTest\out\frames` (4,699 JPEGs), 162 sampled (3 per shot)
**Shot list:** `Y:\NewVideoTest\STORYBOARD.md` (54 shots), reconciled against ffmpeg scene detection and frame differencing
**Compared against:** the pack's six reference crops (`styles/paper-kpop/references/frames`, 720×720) and the Uber film (`build/uber-model/collage/`, 10 tiles + a 30-tile 1-second sheet)
**Data:** `docs/research/identity/I-frames.json` (per-shot rows, 162 samples, distributions, comparison, invariants)
**No repository file was changed except this report and its JSON.** Scratch measurement code lived in the OS temp directory.

---

## 0. What the frames say, in six numbers

| Finding | Measurement |
|---|---|
| The cast is the film | **49 of 54 shots** contain a drawn character; the other 5 are prop or void beats (sunflower, mug tower, iris, cube, door) |
| Characters are large, and their size is *varied* | height **p50 55.2%**, p25 28.9, p75 71.1, **sd 21.8**, range 13.0–91.9 |
| The camera looks at the middle of the frame | character centroid **x p50 0.55** (p10 0.33, p90 0.69); **38/49 in the centre third**, 6 right, 5 left |
| The field is an illustrated full-bleed world | **0 left edge bars, 1 right** in 54 shots; largest flat colour region **p50 14.4%**; **54 distinct field hexes for 54 shots** |
| Warm earth, not blue | warm share **p50 70%**, blue **p50 1%**, **p90 17%**; ink 27%, kraft 21%, orange 17%, red 13% |
| The figure always separates from what it sits on | **\|ΔL\| p50 46.6**, p25 27.6, p90 103.7; **1/49** blue-on-blue risks |

The Uber film is **not** smaller in the median — 57.8% sits 2.6 points above the canonical median
(55.2%). Its gap is **placement (x 0.136 vs 0.55), a fixed 38.5% of frame width given to two
saturated side bars (0% in the canonical), blue-on-blue (figure-blue 0.78 vs 0.03), and local
contrast (median 12.6 vs 46.6)**. It also has no scale range at all: 57.8% in all 30 sampled
seconds, where the canonical moves between 13% and 92%.

---

## 1. Method, and where it is uncertain

**Sampling.** Three frames per shot: start + 0.2 s, middle, end − 0.2 s. On shots shorter than
0.4 s the pad shrinks to 0.05 s. Frames were decoded at 1920×1080 and analysed at **480×270**
(reference crops at 480×480). The shot's subject box (annotated on the middle frame) is applied to
all three frames, so a camera move inside a shot leaves the box slightly off; the contrast numbers
are medians over the three samples.

**Palette.** k-means (k = 14, seeded, CIELAB) on 12,000 sampled pixels, clusters merged at ΔE < 9,
then every pixel assigned. The top 8 clusters are reported with share and a role derived from HSV:
`ink` (V < 0.16), `cream` (S < 0.12, V > 0.72), `grey`, then hue bands red / oxblood / orange /
kraft / gold / acid / green / teal / blue / violet / pink. Warm = red + oxblood + orange + gold +
cream + kraft + teal (the brief's list). Blue = the blue band only (hue 188–252).

**Field.** The largest 8-connected component of a single palette colour. "Edge bars" are palette
components that touch a frame edge, span ≥85% of the frame height, occupy 3–45% of the width, are
saturated (S ≥ 0.35) and have a hard inner edge (ΔE ≥ 15 over 6 px). This rejects vignette ramps,
which a simple column-profile test does not.

**Subject.** **Annotated, not auto-detected.** On this art every colour-region detector I tried
either merged the figure with the props/type through the shared black outline, or lost the blue
parts of a figure standing in a blue bar. I therefore read one box per shot from 10%-gridded
contact sheets (3 frames per shot inspected) and used a face-anchored detector only as a second
opinion. 49 shots carry a character (or a group: shot 38 is a tower of SOLs); 5 do not.
**Uncertainty: ±3 points of frame height, ±0.01 of centroid, ±0.02 of width.** Boxes are in the
JSON as `subjectBox`, so any number here can be re-derived or corrected.

**Contrast.** Two measures:
- `deltaLumaVsRing` — the subject region (box minus field-coloured pixels) against a 30%-padded
  ring of field pixels around the box. This is the "figure vs the world" number.
- `localLumaDelta` — the non-dominant pixels *inside* the box against the dominant colour *inside*
  the box. This is the only fair measure when the figure stands inside a colour bar: it asks "how
  far is the figure from what is immediately behind it?", not "how far is the bar from the cream?".
  The Uber numbers below use this; using the ring measure on a figure standing in a 20% blue bar
  reports a meaningless −150 because it compares the bar with the cream plate.

**Edges.** Sobel magnitude, threshold 40. Outline width = dark runs (V < 0.32, L < 95) crossing
the silhouette on five horizontal scanlines, scaled to 1080p. In this art the stroke is often
merged with hair or a black prop, so the median is an upper bound and the p10 is the stroke proxy.

**Shadow.** A shift search (dx, dy ∈ −32…+32 px at 1080p, step 8) for the offset at which the
shifted silhouette lands on field pixels with the lowest mean luma. At 480×270 this is a weak
instrument; its results are reported with confidence and should not be used as a design rule.

**Text.** High-contrast small components (height 4–30 px at 480, width ≤ 34% of the frame) after
a 21-px median-background subtraction; clustered with a 3×11 dilation. This captures captions,
the corner bug and small labels. **Big display type is not measured by area** — its strokes are
large components and its counters are holes; it is visible in every contact sheet but the
stroke-share metric does not represent its area. No OCR was run.

**Reproducibility.** Seeded k-means, no wall clock, no network; the same frames and the same
sample reproduce the numbers by construction. The JSON records this run's exact values.

---

## 2. Shot boundaries

ffmpeg scene detection (`select='gt(scene,0.3)'`) returns **45** detections: **41** match a
storyboard boundary (median offset 0.03 s) and **4** are extras. Differencing the frames 0.06 s
either side of each of the other 12 storyboard boundaries resolves them:

| Result | Count | Boundaries |
|---|---|---|
| detected by ffmpeg | 41/53 | every boundary except the twelve below |
| hard cut missed by ffmpeg (\|frame diff\| > 12/255) | +9 | 8.95, 22.50, 29.72, 41.36, 52.80, 60.52, 73.80, 115.08, 117.02 |
| soft (5–12) | 2 | 7.90 (the "NO SURPRISE" sticker lands), 135.40 (door → breath) |
| not a visual cut (< 5) | 1 | 27.90 (the Chinese room melts into the shrooms — a continuous transform) |
| extra ffmpeg detections | 4 | 95.03 (a flash 5 frames before the 95.20 cut), 110.67, 133.80, 155.93 (fade to cream) |

So **50 of 53 storyboard boundaries are hard cuts**, 2 are soft dissolves and 1 is a melt. The
one melt is why a pure cut detector under-counts; the four extras are why it over-fires inside
flashes.

---

## 3. Distributions (49 character shots unless stated)

| Metric | n | mean | sd | min | p10 | p25 | p50 | p75 | p90 | max |
|---|---|---|---|---|---|---|---|---|---|---|
| character height, % of frame | 49 | 51.4 | 21.8 | 13.0 | 20.9 | 28.9 | **55.2** | 71.1 | 76.0 | 91.9 |
| character width, % of frame | 49 | 7.2 | 2.0 | 4.0 | 5.0 | 6.0 | 7.1 | 8.1 | 10.0 | 14.2 |
| centroid x | 49 | 0.54 | 0.15 | 0.13 | 0.33 | 0.51 | **0.55** | 0.59 | 0.69 | 0.88 |
| centroid y | 49 | 0.53 | 0.12 | 0.24 | 0.38 | 0.46 | **0.52** | 0.59 | 0.66 | 0.83 |
| subject screen share (area) | 49 | 0.030 | 0.018 | 0.008 | 0.010 | 0.010 | 0.030 | 0.040 | 0.070 | 0.089 |
| warm share | 49 | 0.58 | 0.33 | 0.04 | 0.08 | 0.24 | **0.70** | 0.89 | 0.97 | 0.99 |
| blue share | 49 | 0.044 | 0.079 | 0.00 | 0.00 | 0.00 | **0.01** | 0.03 | 0.17 | 0.46 |
| saturated share (S>0.35, V>0.15) | 49 | 0.47 | 0.29 | 0.02 | 0.07 | 0.17 | **0.50** | 0.69 | 0.89 | 0.96 |
| colour roles ≥1% | 49 | 5.2 | 1.3 | 3 | 3.8 | 4 | **5** | 6 | 7 | 8 |
| largest flat colour region | 49 | 0.21 | 0.18 | 0.03 | 0.04 | 0.07 | **0.14** | 0.26 | 0.46 | 0.76 |
| field colour share | 49 | 0.33 | 0.17 | 0.12 | 0.16 | 0.19 | 0.27 | 0.41 | 0.57 | 0.78 |
| \|local ΔL\| figure vs immediate surround | 47 | 53.1 | 35.5 | 3.2 | 18.0 | 27.6 | **46.6** | 63.1 | 103.7 | 184.3 |
| local hue Δ | 47 | 29.0 | 37.3 | 1.1 | 2.8 | 6.7 | 16.3 | 32.2 | 60.5 | 163.0 |
| figure share of its box | 47 | 0.50 | 0.18 | 0.01 | 0.21 | 0.41 | 0.52 | 0.63 | 0.70 | 0.74 |
| figure-blue share | 47 | 0.10 | 0.16 | 0.00 | 0.00 | 0.00 | 0.03 | 0.11 | 0.26 | 0.83 |
| edge density, figure | 49 | 0.37 | 0.22 | 0.00 | 0.07 | 0.14 | 0.38 | 0.53 | 0.68 | 0.82 |
| edge density, field | 49 | 0.15 | 0.11 | 0.03 | 0.05 | 0.07 | 0.12 | 0.20 | 0.28 | 0.55 |
| outline / ink band, px at 1080p | 29 | 16.8 | 12.2 | 4 | 5.6 | 8.0 | 12.0 | 20.0 | 40.0 | 44.0 |
| floor / horizon line, y% | 49 | 73.0 | 15.4 | 37.8 | 46.8 | 64.4 | **77.8** | 83.3 | 88.4 | 94.8 |
| small text share | 49 | 0.030 | 0.010 | 0.01 | 0.02 | 0.02 | 0.031 | 0.04 | 0.05 | 0.07 |
| bottom-band text share | 49 | 0.040 | 0.030 | 0.00 | 0.01 | 0.01 | 0.029 | 0.05 | 0.07 | 0.19 |
| top-right text share (bug) | 49 | 0.040 | 0.020 | 0.00 | 0.01 | 0.02 | 0.040 | 0.05 | 0.06 | 0.07 |
| frame mean luma | 49 | 96.9 | 52.6 | 21.1 | 36.2 | 53.2 | 91.1 | 147.2 | 180.1 | 190.8 |
| frame luma sd | 49 | 51.8 | 12.0 | 32.2 | 36.7 | 42.0 | 50.9 | 58.8 | 68.0 | 76.2 |

Height bands: **<35% = 16 shots, 35–55 = 8, 55–80 = 23, ≥80 = 2** (shots 21 and 38).
Zones: **left third 5, centre third 38, right third 6**.

---

## 4. Composition: where the cast stands

**The film is a stage, not a plate.** Characters stand on a floor line at **y 78% (p25 64, p75 83)**
with their body centroid at the vertical centre (**0.53**). That is a portrait grammar: the figure
occupies the middle of the frame, the type sits above and to the left, and the bottom 10–15% is a
stage, a subtitle band or a floor.

**Horizontal placement is centre-right.** p50 0.55, with the right third used 6 times and the left
third 5 times. The two extreme left placements (shots 36 and 45, x 0.13–0.14) are deliberate: the
club singer and the seer at the loom are staged at the edge of their worlds, with the empty field
carrying the rest. **No shot pins the cast to the outer 10% of the frame for a whole shot** — the
minimum centroid is 0.13 and that is one shot.

**Scale is the film's rhythm.** 23 of 49 shots are 55–80% tall, 16 are under 35%, 2 are over 80%.
A 60-second film with this grammar alternates close-ups (the face fills the height) with wide
stages (a 20%-tall figure on a big floor). The standard deviation (21.8) is the point: the film
changes scale constantly.

**Negative space.** The character occupies **3.0% of the frame area** (p25 1%, p75 4%). 97% of
the frame is field, type, prop or air. This is why the film reads as a poster: a tiny figure in a
large illustrated world.

**Floor line.** The strongest horizontal colour boundary in the lower frame sits at 77.8% (p25 64,
p75 83). It is the stage edge, the desk edge, the blue floor band — the line the feet stand on.
The p25 of 64% marks the close-ups and top-down shots where the strongest boundary is a desk or a
card edge rather than a floor.

---

## 5. Field and palette

**Full-bleed, illustrated, one world per shot.** 54 shots, **54 distinct field hexes**, 0 left
edge bars. The only right-side "bar" (shot 45) is a 44% dark-blue lighting falloff beside the
loom, not a layout device. The largest flat colour region is only **14.4%** of the frame
(p10 4.4, p90 46) because the backgrounds carry vignettes, halftone, paper texture, props and
type — they are painted, not filled.

**Warm earth dominates.** Mean role shares over the 49 character shots:

| role | mean share | role | mean share |
|---|---|---|---|
| ink | 27.3% | green | 3.8% |
| kraft | 20.7% | oxblood | 3.0% |
| orange | 16.9% | grey | 2.2% |
| red | 13.1% | teal | 1.8% |
| blue | 4.2% | acid | 1.6% |
| | | cream | 1.5% |
| | | violet 1.4, pink 1.3, gold 0.5 |

Warm earth (red + oxblood + orange + kraft + cream + gold + teal) is **57.5%** of the average
frame. Saturation is high but papery: **50% of pixels** pass S > 0.35 and V > 0.15 (p25 17%,
p75 69%). The film is not pastel and not neon; it is ink on coloured paper.

**Blue is an accent, not a field.** Median 1%, p90 17%. The exceptions are deliberate: shot 21
(the arena, 46% cobalt sky), shot 1 (18% blue stage floor), shot 9 (17%), shot 36 (14%, the
midnight jazz club), shot 45 (21%, the loom void). In all five the figure is red/cream against
the blue, not blue against blue.

**Field colours by role:** ink 20 shots (voids, dark rooms, night), kraft 9, orange 7, red 6,
green 3, acid 2, pink 2, cream 2, blue 1, oxblood 1, teal 1. The film spends a third of its
shots on dark fields, which is why the mean frame luma is only 91.

---

## 6. Contrast, and the one blue-on-blue risk

**Figure vs immediate surround: |ΔL| 46.6 (p25 27.6, p90 103.7), local hue Δ 16°.** The figure
is usually the brightest or darkest thing in its own box, and its local hue is at least 7° away
from what it sits on in 75% of shots. The low-contrast quartile (|ΔL| < 28) is mostly wide shots
where the box contains more field than figure, plus shot 26 (SOL against the vault door, 3.2) and
shot 40 (the chinchilla/type frame, 6.5).

**Edge density: 0.38 inside the figure vs 0.12 in the field — a 3.2× ratio.** The character is
where the detail is; the field is quiet. This is the mechanical signature of "the eye goes to the
figure".

**Blue-on-blue: 1/49 shots trips the risk rule in at least one of its three frames.** That shot is
34 (the paper-beach diptych), whose last sample turns overwhelmingly blue (blue share 0.88) with
|ΔL| 7.9 — a transition risk at the end of the shot, not a sustained one: the shot's median
figure-blue is 0.08. Everywhere else the blue is either a small costume accent or a field behind a
red/cream figure.

**The figure's blue share is 0.03 (p90 0.26).** The film is not afraid of blue, but it does not
dress the cast in it against a blue ground.

---

## 7. Edges, outline and shadow

**Outline.** The 10th percentile of the ink band at the silhouette is **5.6 px at 1080p**, which
is the intended vector stroke (≈0.5% of frame height). The median (12 px) and p90 (40 px) are
where the scanline crosses hair, a black prop or a heavy shadow shape, so they should not be read
as stroke width. The art uses a thin, consistent ink contour plus large solid ink masses.

**Shadow.** Not a reliable invariant. The shift search finds a median darkening of **−0.4 luma**
and **none** of 44 shots reaches the "high" threshold (ΔL < −12). The art draws flat paper shapes;
where a shadow exists it is a hard offset shape, not a soft cast shadow, and it is small relative
to the figure. **Do not build a shadow rule from this measurement.**

---

## 8. Text

**Small text (captions, watermark, labels) covers 3.1% of the frame** (p10 2%, p90 5%). The
bottom band (y > 78%) carries 2.9% (p90 7%); the top-right bug carries 4.0% (p90 6%) in nearly
every shot — the film is watermarked throughout.

**Display type is present but not area-measured here.** In the contact sheets it is a stacked
black block in the upper-left third (occasionally centre or right), often two or three words tall,
with the subtitle below-left. The stroke-share metric cannot turn that into an area without
segmenting letters from illustration, which this pass did not do. Treat the display type as
"present in most shots, upper-left, large" and not as a measured area.

One outlier: shot 9's bottom band measures 19% — the P(DOOM) meter and confetti sit in the lower
band with the subtitle, so the band share is not all text.

---

## 9. Per-shot table

`kind`: char = character/group, prop = prop or protagonist-as-prop, none = no character.
`H%` character height, `cx/cy` centroid, `|ΔL|` absolute local luma contrast, `field` largest flat
region, `warm/blue/sat` palette shares, `bar` edge-bar widths, `floor` floor-line y.

| # | dur | kind | H% | cx | cy | \|ΔL\| | field | warm | blue | sat | bar L/R | floor |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 00 | 1.50 | none | – | – | – | – | 0.91 | 0.06 | 0.00 | 0.02 | 0/0 | 37.8 |
| 01 | 4.40 | char | 73.0 | 0.60 | 0.46 | 53.3 | 0.12 | 0.76 | 0.18 | 0.49 | 0/0 | 81.5 |
| 02 | 2.00 | char | 43.0 | 0.43 | 0.66 | 20.6 | 0.18 | 0.95 | 0.01 | 0.17 | 0/0 | 70.0 |
| 03 | 1.05 | char | 27.0 | 0.68 | 0.51 | 89.1 | 0.26 | 0.96 | 0.01 | 0.13 | 0/0 | 70.0 |
| 04 | 3.45 | char | 31.9 | 0.55 | 0.26 | 40.1 | 0.17 | 0.98 | 0.01 | 0.04 | 0/0 | 82.2 |
| 05 | 4.10 | char | 67.0 | 0.62 | 0.47 | 55.3 | 0.12 | 0.85 | 0.01 | 0.90 | 0/0 | 77.0 |
| 06 | 1.40 | prop | – | – | – | – | 0.23 | 0.99 | 0.00 | 0.03 | 0/0 | 84.8 |
| 07 | 4.60 | char | 78.2 | 0.51 | 0.46 | 74.5 | 0.08 | 0.99 | 0.00 | 0.69 | 0/0 | 75.9 |
| 08 | 0.22 | none | – | – | – | – | 0.99 | 0.00 | 0.00 | 0.00 | 0/0 | 37.8 |
| 09 | 1.64 | char | 71.1 | 0.59 | 0.63 | 64.9 | 0.10 | 0.71 | 0.17 | 0.77 | 0/0 | 73.3 |
| 10 | 1.82 | char | 43.0 | 0.51 | 0.38 | 103.0 | 0.06 | 0.95 | 0.02 | 0.90 | 0/0 | 79.3 |
| 11 | 1.72 | char | 25.9 | 0.34 | 0.53 | 54.4 | 0.51 | 0.32 | 0.01 | 0.28 | 0/0 | 76.3 |
| 12 | 1.82 | char | 28.9 | 0.41 | 0.53 | 22.5 | 0.49 | 0.24 | 0.01 | 0.25 | 0/0 | 74.1 |
| 13 | 3.68 | char | 58.9 | 0.88 | 0.59 | 116.1 | 0.67 | 0.18 | 0.01 | 0.17 | 0/0 | 87.8 |
| 14 | 2.10 | char | 31.9 | 0.52 | 0.50 | 60.0 | 0.04 | 0.95 | 0.00 | 0.90 | 0/0 | 47.8 |
| 15 | 3.00 | char | 73.3 | 0.54 | 0.47 | 60.7 | 0.05 | 0.74 | 0.17 | 0.82 | 0/0 | 76.7 |
| 16 | 2.86 | char | 53.0 | 0.51 | 0.62 | 45.2 | 0.23 | 0.08 | 0.04 | 0.12 | 0/0 | 94.1 |
| 17 | 3.62 | char | 53.0 | 0.51 | 0.52 | 44.8 | 0.27 | 0.07 | 0.04 | 0.07 | 0/0 | 94.8 |
| 18 | 4.54 | char | 28.1 | 0.58 | 0.66 | 41.8 | 0.13 | 0.19 | 0.17 | 0.65 | 0/0 | 52.6 |
| 19 | 3.28 | char | 69.3 | 0.57 | 0.45 | 50.1 | 0.34 | 0.85 | 0.02 | 0.06 | 0/0 | 86.7 |
| 20 | 6.14 | char | 60.0 | 0.59 | 0.52 | 30.7 | 0.10 | 0.79 | 0.01 | 0.78 | 0/0 | 78.5 |
| 21 | 1.58 | char | 91.8 | 0.77 | 0.50 | – | 0.07 | 0.24 | 0.46 | 0.53 | 0/0 | 75.9 |
| 22 | 2.00 | char | 28.1 | 0.58 | 0.24 | 27.6 | 0.04 | 0.89 | 0.00 | 0.93 | 0/0 | 78.1 |
| 23 | 1.66 | char | 27.8 | 0.64 | 0.38 | 46.6 | 0.45 | 0.07 | 0.00 | 0.34 | 0/0 | 40.7 |
| 24 | 1.94 | char | 75.9 | 0.56 | 0.43 | 47.3 | 0.24 | 0.11 | 0.02 | 0.68 | 0/0 | 86.3 |
| 25 | 3.06 | char | 13.0 | 0.34 | 0.36 | 74.5 | 0.22 | 0.28 | 0.00 | 0.14 | 0/0 | 43.0 |
| 26 | 4.62 | char | 70.4 | 0.72 | 0.50 | 3.2 | 0.07 | 0.74 | 0.01 | 0.59 | 0/0 | 79.6 |
| 27 | 0.66 | char | 21.1 | 0.58 | 0.51 | 13.7 | 0.12 | 0.98 | 0.00 | 0.96 | 0/0 | 78.9 |
| 28 | 3.14 | char | 20.0 | 0.52 | 0.83 | 48.7 | 0.23 | 0.60 | 0.01 | 0.37 | 0/0 | 50.4 |
| 29 | 3.64 | char | 44.8 | 0.57 | 0.56 | 26.1 | 0.07 | 0.97 | 0.00 | 0.71 | 0/0 | 78.5 |
| 30 | 3.60 | char | 20.0 | 0.43 | 0.52 | 87.6 | 0.14 | 0.95 | 0.00 | 0.72 | 0/0 | 78.5 |
| 31 | 4.50 | char | 14.1 | 0.52 | 0.80 | 52.4 | 0.04 | 0.89 | 0.01 | 0.50 | 0/0 | 77.8 |
| 32 | 5.86 | char | 49.6 | 0.83 | 0.31 | 19.8 | 0.11 | 0.16 | 0.00 | 0.55 | 0/0 | 63.0 |
| 33 | 3.60 | char | 76.3 | 0.57 | 0.51 | 30.7 | 0.03 | 0.50 | 0.01 | 0.39 | 0/0 | 63.3 |
| 34 | 3.66 | char | 43.3 | 0.58 | 0.64 | 7.9 | 0.04 | 0.59 | 0.17 | 0.63 | 0/0 | 59.6 |
| 35 | 2.94 | char | 73.3 | 0.59 | 0.54 | 43.9 | 0.17 | 0.37 | 0.01 | 0.51 | 0/0 | 72.6 |
| 36 | 4.00 | char | 67.0 | 0.14 | 0.69 | 24.1 | 0.27 | 0.07 | 0.14 | 0.21 | 0/0 | 83.3 |
| 37 | 2.00 | char | 56.3 | 0.30 | 0.55 | 112.5 | 0.76 | 0.20 | 0.01 | 0.07 | 0/0 | 54.1 |
| 38 | 1.98 | char | 89.6 | 0.30 | 0.50 | – | 0.18 | 0.45 | 0.07 | 0.04 | 0/0 | 37.8 |
| 39 | 1.70 | char | 53.7 | 0.65 | 0.55 | 61.3 | 0.40 | 0.97 | 0.01 | 0.02 | 0/0 | 86.7 |
| 40 | 1.94 | char | 18.9 | 0.64 | 0.54 | 6.5 | 0.08 | 0.97 | 0.00 | 0.51 | 0/0 | 93.7 |
| 41 | 1.82 | prop | – | – | – | – | 0.29 | 0.57 | 0.00 | 0.27 | 0/0 | 78.5 |
| 42 | 2.08 | char | 57.0 | 0.52 | 0.66 | 48.4 | 0.43 | 0.04 | 0.01 | 0.11 | 0/0 | 85.6 |
| 43 | 3.32 | char | 57.0 | 0.65 | 0.62 | 46.3 | 0.23 | 0.75 | 0.03 | 0.06 | 0/0 | 90.7 |
| 44 | 1.96 | char | 77.0 | 0.58 | 0.45 | 104.8 | 0.04 | 0.60 | 0.00 | 0.51 | 0/0 | 83.0 |
| 45 | 1.80 | char | 58.1 | 0.13 | 0.56 | 23.2 | 0.32 | 0.07 | 0.21 | 0.37 | 0/44* | 85.9 |
| 46 | 1.90 | char | 23.0 | 0.55 | 0.77 | 29.7 | 0.14 | 0.70 | 0.00 | 0.67 | 0/0 | 64.4 |
| 47 | 2.00 | char | 75.2 | 0.53 | 0.50 | 121.0 | 0.03 | 0.95 | 0.01 | 0.89 | 0/0 | 90.7 |
| 48 | 3.50 | char | 55.2 | 0.30 | 0.58 | 27.6 | 0.70 | 0.23 | 0.00 | 0.22 | 0/0 | 41.9 |
| 49 | 1.62 | none | – | – | – | – | 0.41 | 0.06 | 0.00 | 0.07 | 0/0 | 79.3 |
| 50 | 3.66 | char | 74.8 | 0.73 | 0.46 | 184.3 | 0.18 | 0.44 | 0.03 | 0.41 | 0/0 | 41.1 |
| 51 | 5.32 | char | 74.1 | 0.52 | 0.46 | 36.2 | 0.11 | 0.83 | 0.01 | 0.88 | 0/0 | 82.2 |
| 52 | 5.00 | char | 65.2 | 0.52 | 0.53 | 95.8 | 0.06 | 0.65 | 0.01 | 0.62 | 0/0 | 83.3 |
| 53 | 5.60 | char | 29.6 | 0.42 | 0.60 | 15.4 | 0.19 | 0.81 | 0.01 | 0.49 | 0/0 | 65.9 |

\* shot 45's 44% right band is a dark-blue lighting falloff beside the loom, not a designed bar.
`|ΔL|` is missing for shots 21 and 38 because the figure dominates its own box (feet clipped in
21, a tower of figures in 38), so the local figure/background split collapses.

---

## 10. Reference crops vs canonical vs Uber — the exact gap

**Reference crops** (6, 720×720). Four are character close-ups, two are props:

| crop | kind | H% | cx | warm | blue | sat | flat field | mean luma |
|---|---|---|---|---|---|---|---|---|
| chorus-stage | character | 99.8 | 0.59 | 0.826 | 0.132 | 0.833 | 0.199 | 128.9 |
| desk-diorama | character | 82.9 | 0.43 | 0.911 | 0.029 | 0.161 | 0.446 | 193.3 |
| macro-prop | prop | – | – | 0.947 | 0.013 | 0.072 | 0.460 | 184.0 |
| open-sunflower | prop | – | – | 0.752 | 0.000 | 0.251 | 0.049 | 125.3 |
| portrait-paper-cast | character | 97.7 | 0.39 | 0.881 | 0.049 | 0.711 | 0.350 | 159.9 |
| throne-orbit | character | 94.8 | 0.85 | 0.910 | 0.056 | 0.871 | 0.188 | 70.3 |

The four character crops average **93.8% tall**, **warm 0.88**, **blue 0.067**, **saturated 0.64**.
They are the pack's "hero" framing: the cast fills the square.

**Uber** (10 collage frames at 640×360 from `collage.json`; layout is fixed):

| | value |
|---|---|
| left cobalt bar | **19.0%** of width (18.0–20.6) |
| right red bar | **19.5%** of width (16.6–22.7) |
| cream plate between them | ~61% |
| character height | **57.8%** in all 10 (and all 30 final-sheet frames) |
| character centroid | **x 0.136, y 0.678** — inside the blue bar |
| figure-blue share | **0.78** (0.06–0.98) |
| local luma contrast | **+0.2 to +43, median 12.6** (figure always slightly lighter than the bar) |
| blue-on-blue flagged | **7/10** collage tiles, **25/30** final-sheet frames |
| warm / blue / sat | 0.783 / **0.192** / 0.477 |
| largest flat field | 0.268 |
| frame mean luma | 146.8 |
| 30-frame sheet (1 s apart) | blue 0.175, warm 0.788, flat field 0.276, \|ΔL\| median 10.4, figure-blue 0.821 |

**Deltas.** Negative = Uber lower.

| metric | canonical | reference | Uber | Uber − canonical |
|---|---|---|---|---|
| character height, % | 55.2 median (51.4 mean) | 93.8 mean (char crops) | 57.8 | **+2.6 median / +6.4 mean** |
| height range across the film | 13.0–91.9 (sd 21.8) | – (stills) | 57.8 fixed in every sampled frame | **no range** |
| centroid x | 0.55 | 0.566 | 0.136 | **−0.40** |
| warm share | 0.70 median / 0.58 mean | 0.871 | 0.782 | +0.08 |
| blue share | 0.01 median / 0.044 mean | 0.047 | 0.179 | **+0.135** |
| saturated share | 0.50 | 0.483 (0.644 char crops) | 0.477 | −0.023 |
| largest flat field | 0.14 | 0.282 | 0.268 | **+0.128** |
| \|local ΔL\| median | 46.6 | −104 … +88 signed (3 measurable) | 12.6 | **−34.0** |
| figure-blue share | 0.03 | ~0 (not measured; visually 0–0.1) | 0.783 | **+0.75** |
| blue-on-blue | 1/49 (2%) | 0/4 | 7/10 (25/30 = 83%) | **+68 pts (% of samples)** |
| side bars | 0 left, 0 designed right | 0 | **19.0% left, 19.5% right** | **+38.5 pts of width** |
| mean luma | 91.1 | 143.6 | 146.8 | +55.7 |
| distinct field colours | 54 in 54 shots | 6 in 6 | 1 plate in 30 s | – |

**Reading the gap.**

1. **Scale is not the problem; range is.** The Uber figure at 57.8% is 2.6 points *above* the
   canonical median (55.2%). But the canonical swings from 13% to 92% (sd 21.8, 23 shots at
   55–80%, 16 under 35%, 2 over 80%); the Uber is pinned at 57.8% for every sampled second. The
   film has a *size* but no *rhythm of sizes*.
2. **Placement is the largest single gap.** x 0.136 vs 0.55 (−0.40) puts the cast inside the
   left bar for the whole film. The canonical never does this: 38/49 are centre-third, and the
   two left-edge shots (36, 45) are deliberate one-offs with the rest of the frame empty.
3. **The plate is the second.** 38.5% of every Uber frame is two saturated bars; the canonical
   gives 0% to bars and lets the illustrated field reach every edge. The flat plate also raises
   the mean luma by 56 (cream dominates) and flattens the largest colour region from 14% to 27%.
4. **Blue-on-blue costs the figure.** With the character standing in a 19% cobalt bar, its blue
   body is 12 luma from the bar and 3° in hue; 78% of its pixels are blue. The canonical's
   figure is 46.6 luma from its surround and 3% blue. This is why the Uber figures read as
   silhouettes with a face, not as drawn characters.
5. **The reference crops are more extreme than the film.** At 93.8% and 0.64 saturation, the six
   crops are hero close-ups, not the film's average. Judging the Uber film against the crops
   alone would say "everything is too small and too pale"; judging it against the film says
   "the scale is right, the placement and the plate are wrong". The film is the correct
   reference for composition; the crops are the correct reference for surface.

---

## 11. Composition invariants, with proposed bands

Bands are derived from the 49 character shots (p10–p90 unless stated) and rounded to values a
validator can use. Confidence is about *this* measurement, not about whether the rule is good art.

| id | invariant | proposed band | measured | confidence |
|---|---|---|---|---|
| I1 | a drawn cast member is present | ≥85% of shots | 49/54 (91%) | high |
| I2 | character height, hero shots | 55–90% of frame height | p50 55.2, p75 71.1, p90 76.0, max 91.9 | high |
| I3 | character height, wide/insert | 13–35%, never below 12% | min 13.0, p10 20.9, p25 28.9 | high |
| I4 | character centroid x | 0.30–0.75 in ≥80% of shots | p10 0.33, p50 0.55, p90 0.69; centre 38/49 | high |
| I5 | character centroid y | 0.38–0.66 | p10 0.38, p50 0.52, p90 0.66 | high |
| I6 | floor/horizon under the cast | y 0.65–0.88 in ≥70% of shots | p25 0.64, p50 0.78, p75 0.83 | medium |
| I7 | field reaches the frame edges | side bar ≤8% of width; 0 in ≥90% of shots | 0 left, 0 designed right in 54 | high |
| I8 | largest flat colour region | 4–46% of frame | p10 4.4, p50 14.4, p90 46 | medium |
| I9 | warm earth share | 40–90% | p25 24, p50 70, p75 89 | high |
| I10 | blue share | ≤20% (p90); ≤5% median | p50 1, p75 3, p90 17 (arena 46) | high |
| I11 | colour roles ≥1% | 4–7 | p25 4, p50 5, p75 6 | high |
| I12 | saturated pixel share | 35–70% | p25 17, p50 50, p75 69 | medium |
| I13 | figure vs immediate surround | \|ΔL\| ≥20 in ≥75% of shots; median ≥35 | p25 27.6, p50 46.6, p90 103.7 | medium-high |
| I14 | no blue figure on a blue field | 0 shots with figure-blue >0.30, field hue 195–255, \|ΔL\| <18 | 1/49 trips in one frame (shot 34, its last frame) | high |
| I15 | small text area | 2–6% of frame; bottom band ≤6% (p90) | p50 3.1, p90 5.0; bottom p50 2.9, p90 7 | medium |
| I16 | silhouette ink stroke | 3–6 px at 1080p | p10 5.6 px; median 12 where hair is crossed | low-medium |
| I17 | cast shadow | optional; if present, hard and ≤2% of height | median ΔL −0.4; 0/44 high confidence | low |

**How to use them.** I1–I7 are structural and should be hard checks in a film preflight. I8–I12
are style bands and belong to the style pack, not the engine. I13–I14 are the anti-mush rule:
a figure that is within 20 luma of what it sits on, in a blue-on-blue palette, is the exact
failure the Uber film exhibits. I15 is a text-density guard. I16–I17 are too weak to enforce.

---

## 12. What this does not measure

- **Per-region composition.** These numbers are global and box-level. They cannot say where the
  ink is inside the figure, which way the light falls, or whether a hand is a plank.
- **Display type area.** Measured only as stroke share for small text; big type is described from
  the contact sheets, not segmented.
- **Depth and parallax.** The floor line is a row-gradient heuristic, not a 3D solve. It finds the
  strongest horizontal colour boundary, which is usually the stage edge but sometimes a subtitle
  pill.
- **Motion.** Three frames per shot cannot measure camera travel or animation; that is the job of
  `probe:motion` and `camera:check` on the score side.
- **Shadow direction** at 480×270 is unreliable; only the absence of a strong cast shadow is a
  defensible reading.
- **Colour management.** Luma and hue are computed on 8-bit sRGB decoded by ffmpeg from a
  bt709 limited-range stream; the numbers are consistent across frames and films but are not
  colorimetric measurements of the paper.
- **The Uber film's own authoring.** The tiles are what the render delivered; the gap is a
  measurement of the picture, not a diagnosis of which line of code put the character there.

---

## 13. Files

| path | what |
|---|---|
| `docs/research/identity/I-frames.json` | 54 per-shot rows (median + 3 samples each), 162 frame rows, distributions, 6 reference rows, 10 Uber tiles + 30-frame sheet summary, comparison deltas, 17 invariants |
| `docs/research/identity/I-frames.md` | this report |
| `Y:\NewVideoTest\out\frames\f00000.jpg … f04698.jpg` | the decoded frames measured |
| `build/uber-model/collage/frames/t-*.png` | the 10 Uber frames measured |
| `build/uber-model/final-sheet.png` | the 30-tile 1-second sheet |
