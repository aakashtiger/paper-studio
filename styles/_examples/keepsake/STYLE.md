# Keepsake — style contract

**Family:** paper
**Version:** 0.1.0
**Status:** reviewable

## Intent

Keepsake is a reusable style for short family archive films that are watched once, in one room, by the family. It is a book page, not a poster and not a slideshow: warm off-white paper, dark ink, one muted terracotta mark, a still photograph and a dense caption that can be read before the page turns. It should feel warm, patient and unsentimental — like an archive someone kept in a cupboard — and it must never feel glossy, ceremonial, rushed or like a wedding invitation.

## Invariants

1. **One sheet, one frame.** Every element sits on one warm off-white paper sheet; nothing floats, nothing shines and nothing is collaged.
2. **One photograph, one idea.** A spread holds at most one photograph and one caption. The title and close are type and rule only.
3. **Four colours at most.** Paper, ink, clay and one neutral, or a photograph. A photograph counts as one colour in that count.
4. **Still photographs.** Photographs do not move, shake or push. Only the title may take a push-in under four percent, and it finishes before the first page turn.
5. **Read before the turn.** The caption is fully readable before the page turn begins. The page is held for the reading hold, and the turn is the only motion in the spread.
6. **Type stays quiet.** Instrument Serif carries names and dates; Space Grotesk carries captions, labels and body. Nothing is smaller than 14 px at 390 px, and there are no all-caps paragraphs.
7. **No metal.** The neutral role is matte slate stone. There is no gold, brass, foil or metallic sheen anywhere.

## Signature

- **Shot:** a still 1:1 page held for the reading hold, one photograph untouched and one dense caption at reading size; a slow push-in under four percent is allowed on the title only, never on a photograph.
- **Transition:** a `page_turn` at the end of every spread, turning from the left edge at reading pace; a `hold` at the close; no cut anywhere.
- **Texture:** paper fibre at twelve percent with a soft top-left shadow at eighteen percent; never digital grain, gloss or a metallic sheen.

The page-turn speed is the director's choice, recorded in `capabilities.governance.choices` as `page-turn-speed`. The card's phone animates 1.6 s and the comparison shows 1.2 s at the same 5.6 s hold.

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
