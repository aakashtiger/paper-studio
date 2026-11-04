# 0051 — The visual is authored before the recipe is chosen

**Status:** accepted · 4 Nov 2026
**Owners:** shared (`src/engine/visual.ts`, `src/engine/scenes.ts`, `src/engine/treatment.ts`), creative (`styles/paper-kpop/recipes/**`, `canvas/recipes.js`)
**Depends on:** 0025 (four documents), 0035 (scenes), 0041 (camera), 0048 (the character)

## Context

*The Uber Cut* passed every mechanical gate and still missed the point. The
final sheet was a sunburst title card, a sticker banner, a lamp, an office desk
and a stage — none of it about Uber. The documents had a `place`, a `summary`
and a `recipe`, but nowhere did they say **what the audience must see** or **why
that image serves this line**. The recipe was selected from the pack because it
existed, not because it could draw the subject. That is the core defect: the
scene→shot step had no visual idea in it.

The pack also had one default opening (`paper_open`, a circular sunburst) and a
lamp in its title/macro cards, so every film began with the pack's signature.

## Decision

- **A scene publishes its visual idea**: `subject`, `setting`, `action`, `props`
  (`SceneVisualSchema`).
- **A shot publishes its visual brief**: `shows`, `action`, `focus`, the
  narration `link`, and `why` this image serves that line (`ShotVisualSchema`).
  The recipe is chosen **after** the brief.
- **Every recipe declares its `subjects`** — the plain nouns it can draw:
  `phone`, `route`, `car`, `fare`, `coin`, `tile`, `network`, `nodes`, `wait`.
- **`npm run visual:check -- <score>`** refuses: a missing scene/shot visual; a
  line that is not in the scene; a line in a scene with no shot; a one-word
  reason; a recipe with no subjects; a brief whose subject the recipe cannot
  draw; a default opening (`openingDefault: true`); and one recipe doing more
  than 40% of the film.
- **`npm run recipes:list -- --subject "phone route"`** is the menu: it prints
  each recipe's subjects, slots and duration, so the choice is made from the
  visual, not from habit.
- `render:film` refuses without a passing `visual-check.json` tied to the score;
  `gate:7` has a `visual` row and prints **23 checks**.
- **The pack gains six explainer recipes**: `phone_route`, `city_route`,
  `fare_split`, `app_menu`, `network_web`, `money_flow`. They draw a phone map,
  a city route and car, a fare split, an app menu with four revenue tiles, a
  rider/driver network and coins moving to driver and platform. No lamp, no
  sunburst, no banner in the Uber film.
- `paper_open` is marked `openingDefault`: a film may still use it, but not as
  an unexamined first shot.

## Measured

- *The Uber Cut*: 10/10 shots have a visual brief; all six recipes declare
  subjects; `visual:check` **pass**; `gate:7` **PASS · 23 checks · nothing
  manual**; the first shot is a network map, not a title card.
- The final sheet now shows: network, app menu, phone route, city route, fare
  split, coins, four revenue tiles, two city routes, denser network, phone
  arrival. The lamp and banner are gone.
- The old Uber draft would fail `visual:missing` on all 10 shots and
  `visual:match` on the lamp/office shots; that is the intended refusal.
- 471 tests, typecheck clean, paper-kpop **REVIEWABLE**.

## What this does not do

- It is a **textual** relevance check, not a vision model. It proves the picture
  was asked for and the recipe can draw the named subject; a person still
  judges whether the image is good.
- The recipe `subjects` are declarations; a painter that draws a lamp while
  claiming `phone` would pass the text check and fail the eye. The final sheet
  is the eye.
- It does not auto-pick a recipe. The director chooses and writes `why`;
  `recipes:list` is a menu, not a replacement for taste.
- A 30 s, nine-line film still cannot carry 180–190 wpm; five lines is the
  passing shape (0049).
