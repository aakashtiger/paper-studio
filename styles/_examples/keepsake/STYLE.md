# Keepsake — Style Prompt

**Family:** paper
**Version:** 0.1.0
**Status:** reviewable
**Master aspect:** 1:1
**Duration:** 45 s
**Category:** Family archive

> A 1:1 family-archive book film: one photograph tipped onto warm paper per spread, a dense caption, room tone and slow page turns. It feels like an album kept in a cupboard, not a film made to impress a room.

Human brief structure adapted from the Lemo-Opuscar `STYLE.md` template (MIT). No Lemo demo story, imagery, code or palette is reused.

---

## 1. Essence, and what it is not

- **One sheet of warm, fibrous paper** under everything. The paper is the ground, the margin and the eraser.
- **One photograph per spread**, tipped in with a visible paper border; one dense caption beneath it. No cast, no music, no gloss.
- **Patient and unsentimental.** The page is read before it turns.
- **Five defining traits:** paper ground; tipped print with a visible border; caption as annotation; one muted clay accent; a slow page turn.
- **Not** a wedding invitation, a memorial card, a slideshow, an advert, a scrapbook, a glossy photo book, or a vertical reel.

## Signature

- **Shot:** a still 1:1 page held for the reading hold, one photograph untouched and one dense caption at reading size; a slow push-in under four percent is allowed on the title only, never on a photograph.
- **Transition:** a `page_turn` at the end of every spread, turning from the left edge at reading pace; a `hold` at the close; no cut.
- **Texture:** paper fibre at twelve percent with a soft top-left shadow at eighteen percent; never digital grain, gloss or a metallic sheen.

Provisional page-turn speed: 1.6 s. The director may choose 1.2 s in `capabilities.governance.choices` as `page-turn-speed`.

## 2. Materials & rendering

- Warm off-white uncoated paper, 120 gsm, visible fibre, matte. No coating, no gloss, no lamination.
- A photograph is a print, tipped onto the page, with a 3–4% paper border on all four sides. It never bleeds.
- Layers, in order: paper, photograph, ink, fibre. The gutter shadow is a tone of ink, not a fifth colour.
- Light comes from the top left; shadow softness 0.65, opacity 0.18. No ambient occlusion, no coloured light, no specular highlight.
- The paper is generated, not a stock texture: fibre at 12%, soft mottling, no digital noise. The seed controls the fibre and shadow offsets.
- No floating elements, no collage, no torn edges, no tape, no stickers. Everything sits on one sheet.
- The page turn is a hinge at the gutter; the paper behaves like a sheet, not a card.

## 3. Colour logic

- Six roles: `paper`, `ink`, `clay`, `linen`, `slate`, `umber`.
- Two palettes: `sunday-paper` (warm afternoon) and `winter-window` (cooler morning). The default is `sunday-paper`.
- Paper is the light; never pure white. Ink is a warm near-black. `clay` is the single accent; `linen` is the soft neutral; `slate` is matte stone; `umber` is the shadow tone.
- Maximum four colours per frame. A photograph counts as one colour; the gutter shadow is a tone of ink, not a fifth.
- The accent is reserved for one recurring element: the date rule, the monogram, or a small mark. It is never a background.
- No gold, brass, foil, metallic sheen, neon, gradient sky, or colour on colour without contrast.
- The palette may shift between morning and afternoon, but the logic does not: paper ground, ink type, one clay accent.

## 4. Type & subtitles

- Instrument Serif for display and monogram; Space Grotesk for body, caption and label. No third family.
- Scale: display 72, body 24, caption 14, label 14, monogram 18. The caption never goes below 14 px at 390 px.
- Captions: one or two sentences, 18 words maximum, three lines maximum at the declared measure. No all-caps paragraphs. No text over a face.
- Labels and dates use Space Grotesk at 14 px, tracked slightly; the monogram uses Instrument Serif at 18 px.
- The caption is the subtitle. There is no separate voice-over; if a spoken version is added, hold each line at least 1.8 s or the spoken line + 0.6 s.
- Titles sit inside the 7% top margin; captions sit inside the 8% bottom margin and the caption-safe bottom 12%.
- The type is set on the paper, not in a box, not on a plate, not over the photograph.

## 5. Motion quality

- The page is still. The only motion in a spread is the page turn and, on the title only, a push-in under 4% that finishes before the first turn.
- Timing: 60 BPM, a 5.6 s reading hold and a 1.6 s page turn (7.2 s loop). The director may choose a 1.2 s turn at the same hold.
- Easing: `linear`, `easeOut`, `easeInOut`. No bounce, overshoot, elastic, spring, shake, parallax or object motion.
- The page turn starts at the left edge, hinges at the gutter, and lands without overshoot. The close holds.
- Photographs never move, scale, pan or push. A photograph that moves is a different style.
- The hold is the point: the caption must be fully readable before the turn begins.

## 6. Camera grammar

| Move | What it expresses | Can serve |
|---|---|---|
| Locked page | attention; reading time | a portrait; a caption; a date |
| Slow push-in (≤4%, title only) | the reader leaning in | a name; a place; a year |
| Page turn | a new entry; time passing | a new decade; a new place; a new person |
| Hold at the close | arrival; the last word | a monogram; a date; a final line |

- No pans, tilts, orbits, handheld, Dutch angle, focus pulls or parallax.
- The camera is the reader's eye, not a performer.
- Framing: one hero element per page; 7% side margins; 8% bottom margin; nothing in the gutter; never crop the print border.
- Allowed transitions: `page_turn` and `hold`. No cut, dissolve, wipe, iris or match cut.

## 7. Sound palette

- Room tone only: a clock, a kettle, a chair, a garden at low level. No music, no voice-over, no sound design.
- Silence is allowed and preferred on the first and last spread. The close holds a 0.2 s silent tail after the last page.
- The page turn may carry a quiet paper sound, but it is room tone, not an effect.
- Mix: quiet and close, around −16 LUFS; no added reverb, no compression pumping, no music ducking because there is no music.
- If a director wants music or voice, that is a different format or a variant, not this style.

## 8. Native moves

- **The tipped print.** A photograph placed on paper with a visible border; it never bleeds. *Fits content like:* a portrait; a house; a single object; a place.
- **The page turn.** A hinge at the gutter, one page at a time. *Fits content like:* a new decade; a new room; a new person; a season.
- **The caption as annotation.** A dense line under the print, set like a note in an album. *Fits content like:* a memory; a date; a place; a name.
- **The held close.** The last page holds on a monogram, a date, or one line. *Fits content like:* an anniversary; a dedication; a final photograph.
- **The paper border.** The print is an object on a page, not a full-bleed image. *Fits content like:* a precious photograph; a document; a postcard.
- **The gutter shadow.** A soft fold that says "book." *Fits content like:* a two-page spread; a page turn; a closed album.

## 9. Pitfalls of the medium

- The photograph bleeds or loses its 3–4% border; the page becomes a photo book.
- The caption runs over a face or past three lines; the reading hold breaks.
- A second photograph or a sticker enters the spread; the page becomes a collage.
- The photograph is counted twice in the four-colour rule, or the gutter shadow becomes a fifth colour.
- `slate` is rendered as metal; gold, brass or foil appears.
- The page turn is under 1.2 s, or becomes a cut; the film reads as a slideshow.
- The caption is centred as a paragraph, or set in all caps.
- The paper fibre is too strong or the grain is digital; the page looks like a filter.
- A stock-photo smile, confetti, sparkles, washi tape or a polaroid frame appears.
- The frame uses memorial-card language: a black border, a single rose, "in loving memory."
- The title uses `content.subtitle` for the place instead of `content.venue`; the venue is dropped from the plan.

## 10. Engine

- The style is a pack, not code. Recipes:
  - `recipes/keepsake_title.json` — title, names, date, place, monogram.
  - `recipes/keepsake_spread.json` — one photograph, one caption.
  - `recipes/keepsake_detail.json` — a detail photograph, a supporting caption.
  - `recipes/keepsake_close.json` — body, monogram, date, hold.
- Runtime primitives: `layer`, `shape`, `path`, `text`, `image`, `camera`, `effect`, `transition`. No `group`; no unknown keys.
- Assets: `frame.page-edge`, `texture.paper-fibre`. The paper texture is generated deterministically from the seed; no stock image, no network.
- Fonts: `assets/fonts/InstrumentSerif-Regular.ttf`, `assets/fonts/SpaceGrotesk.ttf` (OFL 1.1). The card loads them with `@font-face`.
- The 27 decisions live in `tokens.json` and `capabilities.json`; this document is the human brief. The validator reads the machine files, not this prose.

## 11. Variation space

The director decides the family, the place, the years, the photographs, the captions, the opening, the ending, the palette (`sunday-paper` or `winter-window`), the page-turn choice, and the monogram. All far from the demo fixtures:

- **Three structures:** a year of Sundays, one spread per season; one object through time, one spread per decade; a house before it is sold, one room per spread.
- **Three openings:** a closed album cover opens to the title; a close-up of a photograph corner pulls back to the page; a single object on blank paper, the caption appears.
- **Three endings:** the last page holds on the monogram and date; the album closes on a final line; the empty room remains, the object stays.

The brief fixtures (the Whitfield and Alvarez examples) are tests, not the style. Do not reuse their names, places or captions.

## Refusals

- No gloss, foil, gold, brass or metallic sheen in any frame.
- No more than four colours in a frame; a photograph counts as one colour.
- No fast cuts, no dissolves on the beat, no camera shake, no bounce and no overshoot.
- No push-in faster than four percent, and no push-in on a photograph.
- No on-camera cast, no talking heads, no narrator and no hands arranging objects.
- No music, no voice-over and no sound design; room tone or silence only.
- No stock-photo smiles, confetti, sparkles or wedding-stationery motifs.
- No text over a face, no all-caps paragraphs and no caption over 18 words.
- No type smaller than 14 px at 390 px width.
- No memorial-card language, no date-in-gold and no auto-advance.

## Not for

- Weddings and wedding stationery.
- Memorials and funerals.
- Birthdays, parties and other celebrations.
- Corporate work, product launches and advertorials.
- Sports, fast-cut music videos and social-first trend films.

## Questions

- **Q: The brief reserves the page-turn speed. What do we do with it?** **A:** The recorded choice lives in `capabilities.governance.choices` as `page-turn-speed`, with options `1.2 s` and `1.6 s`. The card's phone shows both readings at the same 5.6 s hold; the director's resolution is recorded in the same block. Reason: the brief asks the director to choose before signing.
- **Q: Does "eight spreads" mean eight recipe files?** **A:** No. Four reusable shot contracts — title, photograph spread, detail spread and close — carry the eight spreads. Reason: a style is a reusable system, and the brief fixes one film, not eight bespoke layouts. This reading keeps the style usable for another family.
- **Q: Which six colour roles should the style declare?** **A:** `paper`, `ink`, `clay`, `linen`, `slate` and `umber`. There is no `metal` role; `slate` is matte stone and carries any neutral need. Reason: the brief bans metallic sheen, and the authoring guide says `metal` is a slot, not a material.
- **Q: Does a photograph count as one colour?** **A:** Yes. State it in the invariants so a frame with paper, ink, clay and a photograph is exactly four colours. Reason: the brief sets a four-colour cap and a photograph cannot be free.
- **Q: What licence does the authored pack carry?** **A:** CC0-1.0, inherited from the sealed template; the pack itself carries no third-party assets. Reason: the control style is an internal scaffold, and the template lineage is the only licence evidence supplied.
- **Q: There is no cleared reference image. What is the reference?** **A:** A described public-domain family-album page, labelled `REFERENCE — described, not reproduced`, with the card taking the margins and the one-photo page, not the content. Reason: no rights-cleared image exists in the sealed run.
- **Q: Which proof frames should be declared?** **A:** `keepsake_title`, `keepsake_spread` and `keepsake_close`, all at 1:1. Reason: the brief asks for one title spread, one caption-heavy spread and one close.
- **Q: How dense is a "dense caption"?** **A:** One or two full sentences, 18 words maximum, set at 14 px or larger. The card holds an exactly 18-word specimen at 14 px on a 390 px page. Reason: the brief gives 18 words as the ceiling.
- **Q: Do the title and close carry photographs?** **A:** No. The title is names, title, place and date with a rule; the close is a short caption, monogram, date and rule. The six middle spreads carry the photographs. Reason: the brief says the first spread is the title, the last is a short close, and the six in between are photographs with captions.
- **Q: What is the smallest type on a 390 px phone?** **A:** 14 px. Captions, labels and the page kicker never go below it; the animated phone specimen uses 14 px captions. Reason: the brief's refusal list and the template both set 14 px as the floor.
- **Q: How do eight spreads fit 45 seconds?** **A:** 45 s is the film's duration, not a fixed per-spread grid. The card holds a spread for 5.6 s and turns for 1.6 s (7.2 s loop); the film's eight spreads are allocated by the format, and the director's page-turn choice changes the turn while the caption stays readable. Reason: the brief fixes 45 s and eight spreads but reserves the turn speed, so the arithmetic cannot be settled by the author.
- **Q: May the style use a cut or a dissolve?** **A:** No. The allowed transitions are `page_turn` and `hold`; the title and middle spreads turn, and the close holds. Reason: the brief asks for slow page turns and bans fast cuts, and a smaller transition set is easier to reproduce.
- **Q: Should the card show both 1.2 s and 1.6 s turns?** **A:** Yes. The primary 390 px phone shows the required 5.6 s hold, 1.6 s turn and 7.2 s loop; a small comparison below it animates the 1.2 s option at the same 5.6 s hold. Reason: the brief says it wants to see both at check.
- **Q: What should the card footer say before approval?** **A:** `REVIEWABLE` in both `data-status` markers and "unsigned · waiting for the director's eyes" in both `data-waiting` markers. It never says "not approved" and never claims approval. Reason: the sealed prompt fixes the review state and the director signs.
