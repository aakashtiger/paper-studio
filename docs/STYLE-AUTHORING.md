# Style authoring

One page for the director. A style is a reusable look that can carry different
families, different photographs and different stories without being rebuilt for
each one. You do not write code. You answer twelve questions, then judge one
page.

Start from `styles/_template/`. The prompt to paste into your LLM is
`prompts/style-author.md`. For a sealed blind run, use
`prompts/blind-author.md`; it reads only `gate/blind/`.

## The seven steps

`brief → scaffold → author → check → choose/fix → judge card → approve`

| Step | What happens | Who does it |
|---|---|---|
| 1. Brief | Copy `styles/_template/BRIEF.md` to `styles/_briefs/<id>.md`. Answer all twelve questions there, then freeze the file. Only then run `npm run style:new -- <id> --brief styles/_briefs/<id>.md`. | you |
| 2. Scaffold | Copy the template into a new folder: `npm run style:new -- <id> --brief styles/_briefs/<id>.md` | you or your LLM |
| 3. Author | The LLM fills the six files in `styles/<id>/`. | your LLM |
| 4. Check | `npm run style:check -- styles/<id>` prints a report. | you or your LLM |
| 5. Choose / fix | Answer **YOU MUST CHOOSE** — including any choice the brief reserved for you. Ask the LLM to fix **BEFORE YOU APPROVE**. Re-check. | you and your LLM |
| 6. Judge card | Open `styles/<id>/card.html` at 900 × 700. Look at the hero, the promise, feels / never feels, the phone frame and the ANTI. | you |
| 7. Approve | Open the card, then run `npm run style:approve -- <id> --by "Your Name"` yourself. The LLM never runs it. | you only |

The check is not the finish. Approval is the finish: open the card, look at it,
then run `style:approve` yourself. That command rewrites the status markers and
the sign-off block, and binds the pack to your name.

An open **YOU MUST CHOOSE** item at REVIEWABLE is expected, not a defect. If the
brief explicitly reserves a choice for the director, the author leaves it open in
`governance.choices`; you answer it, then run `style:approve`. The author never
self-answers a reserved choice and never approves.

## Card blockers

Every family declared in `tokens.type.families` needs an `@font-face` rule in
`card.html` that resolves to its file. The card must also carry at least one
`data-status`, one `data-waiting` and one `data-signoff` element; keep all status
and waiting prose inside those markers so `style:approve` can rewrite it. A card
missing any of these cannot be approved.

## The twelve questions

Answer in plain language. Say what you want to see, not how to build it. Pick an
example or write your own. Never invent a name, date or family detail; those
arrive later in a real content brief.

If you are unsure at any question, write exactly: **“I don't know — show me two
options.”** The author must bring back two concrete options and one sentence on
the trade-off. A question is never answered by guessing.

1. **Occasion and audience.** What is this for, and who watches it?
   - A grandparents' 50th family archive, watched once by the family.
   - A wedding invitation for two hundred guests.
   - A memorial tribute for a small room.

2. **Story in one sentence.** What happened, and what should be remembered?
   - Fifty years of Sundays, told through eight photographs.
   - Two families become one over three days.
   - A quiet record of a house before it is sold.

3. **Cast and faces.** Who appears on camera, and how?
   - No on-camera cast. Photographs and captions only.
   - The couple, in two still portraits, with no talking heads.
   - One narrator's hands and voice; no faces.

4. **Shape and length.** What aspect, how many spreads or shots, and how long?
   - 1:1 book pages, eight spreads, 45 seconds.
   - 9:16, 30 seconds, six shots.
   - 16:9, 60 seconds, ten chapters.

5. **Feeling.** What three words should it feel like?
   - Warm, patient, handmade.
   - Intimate, joyful, unsentimental.
   - Precise, quiet, a little formal.

6. **Anti-feeling.** What must it never feel like?
   - A wedding invitation.
   - A slideshow.
   - An advert.

7. **Material and palette.** What is it made of, and what colours?
   - Warm off-white paper, ink, one muted terracotta accent, no gloss.
   - Deep green board, chalk, one brass accent.
   - Newsprint, red ink, one blue stamp.

8. **Type and words.** What faces, and how many words?
   - Serif display, quiet sans captions, 18 words maximum.
   - One serif throughout, 12 words maximum.
   - Condensed sans, 24 words maximum.

9. **Motion and pace.** How does it move, and how fast?
   - Slow page turns, still photographs, no camera shake.
   - Hard cuts on the beat, push-ins under four percent.
   - Held frames, one dissolve per act.

10. **Sound.** What do we hear, or not hear?
    - Room tone only, no music.
    - Solo piano, low and slow.
    - No sound at all.

11. **Refusals.** What is banned, and what is out of scope?
    - No gold, no sparkles, no gloss, no wedding stationery.
    - No stock footage, no voice-over, no trends.
    - No text over faces, no fast cuts.

12. **Tier and proof.** What tier is this, and how will we know it worked?
    - Classic tier; one proof frame per aspect; 20 words maximum.
    - Signature tier; three proof frames; a sound mix.
    - Custom tier; full conformance.

## The signature

Under `## Signature` in `STYLE.md`, write exactly three lines, in this order:

```
- **Shot:** ...
- **Transition:** ...
- **Texture:** ...
```

One line each, with the bold label. Name a shot, a transition and a texture, and
say what each refuses. The Transition line must name an allowed token from
`tokens.motion.transitions` (for keepsake, `page_turn` or `hold`). Keep any
page-turn speed paragraph after the three lines.

## Definitions the template does not repeat

- **Six colour roles.** The names are yours. `metal` is a slot, not a material; if the brief bans metal, make it a matte neutral and say so.
- **A photograph counts as one colour** if the style says so. State it in the invariants.
- **Above the fold** means 900 × 700 CSS px on a desktop viewport.
- **Phone frame** means exactly 390 CSS px wide.
- **Proof frames** are recipe ids, not files or beat roles.
- **Answered taste choices** live in `governance.decisions` with `answer`, `reason`, `decidedBy`, `decidedAt`. If you keep them under `choices`, set `resolved: true`. In a sealed run the author records the choices the brief leaves to them; in a real run the LLM must ask the director and wait.
- **Brief-reserved choices** stay open in `governance.choices` with `question`, `options` and `where` — no `answer`, no `resolved`. Stop at REVIEWABLE with the open choice. The director answers it before `style:approve`; the author never self-answers and never approves.
- Place and years use `content.venue` and `content.date`; there is no separate place slot in S1a.
- **Fonts.** Name each family's file, licence and role in `tokens.type.families`; the card loads the file with an `@font-face` rule, and a missing rule blocks approval.
- **The engine-free rule** catches library names such as `Three.js`, `WebGLRenderer` and `p5.brush`, not ordinary words like "three".

## The 11-part human brief

`STYLE.md` follows the Lemo-Opuscar structure, because it is a better human brief than a flat list of invariants. The machine still reads the 27 decisions in `tokens.json` and `capabilities.json`; this is the part a person reads.

| # | Section | What it holds |
|---|---|---|
| 1 | Essence, and what it is not | 3–5 defining traits; the styles it is easily confused with |
| 2 | Materials & rendering | The physical medium and how code imitates it; surfaces, edges, light, layers |
| 3 | Colour logic | Roles, ratios, what the accent is for, what may never be coloured |
| 4 | Type & subtitles | Faces, roles, sizes, reading-time rules, where text lives |
| 5 | Motion quality | Frame rate, easing, what moves, what never moves |
| 6 | Camera grammar | A vocabulary of moves, not a route; allowed and forbidden transitions |
| 7 | Sound palette | Instruments, foley materials, silence, mix character |
| 8 | Native moves | The moments only this medium can do, with three content examples each |
| 9 | Pitfalls of the medium | Mistakes that come from the medium, each with its fix |
| 10 | Engine | Which recipes and runtime primitives draw the style |
| 11 | Variation space | What the director may change; three structures, openings and endings |

The validator also requires four headings, which sit alongside the eleven:

- `## Signature` — the shot, transition and texture people remember
- `## Refusals` — at least five concrete bans
- `## Not for` — at least three formats or occasions this style is wrong for
- `## Questions` — the author's log of gaps and decisions

## Gallery metadata

`style.json` is optional gallery metadata: slug, name, category, summary, uses, aspects, durations, maximum words, status, licence, card path, human brief and machine contract. It is for the app, the marketplace and the style gallery. The validator does not read it yet.

## What the report means

| Status | What it means | What you do |
|---|---|---|
| **DRAFT** | Something mechanical is missing or broken. The card is not ready to judge. | Fix the list under BEFORE YOU APPROVE, then re-check. |
| **REVIEWABLE** | The machine check is clean; any brief-reserved choice is still open. The style is waiting for your eyes. | Answer YOU MUST CHOOSE, then judge the card. |
| **APPROVED** | You signed it. The pack is bound to your signature. | Make the film. Any later change reopens it as REVIEWABLE. |

Two headings in the report matter most:

- **BEFORE YOU APPROVE** is mechanical. Missing files, broken references, wrong
  counts. Your LLM can fix these; you do not need an opinion.
- **YOU MUST CHOOSE** is taste. Speed, weight, warmth, caption density. The LLM
  must ask you and wait. It must never pick for you.

Also read:

- **WORTH KNOWING** — warnings. They do not block.
- **WHAT I COULD NOT CHECK** — taste, phone legibility, motion feel. That is
  your job.

## The rubric

A good style is:

- **Content-free.** It never contains a real name, date, venue or family detail.
  Those live in the brief.
- **Engine-free.** It says "slow page turn", not "easeOut cubic-bezier". A
  renderer can change without changing the style.
- **Specific.** "Warm paper, one terracotta accent, no gloss" is testable.
  "Beautiful and emotional" is not.
- **Refusal-led.** At least five things are banned, and the bans are visible.
  The refusals do more work than the adjectives.
- **Reproducible.** The same brief, style version and variation number (seed)
  produce the same film. The style owns the rules; the seed owns the variation.

## The five commands

```bash
npm run style:new -- <id> --brief <file>
npm run style:check -- <path>
npm run style:approve -- <id> --by "<name>"
npm run style:resolve -- --style <path> --seed <n> --brief <a> --format <a> --brief <b> --format <b>
npm run style:seal
```
