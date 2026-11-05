# 0057 - The style is construction, not a cast

**Status:** accepted, 2026-11-05. This clarifies Paper K-pop 0.2.0; it does not
create a new identity.

## The problem

0053 encoded the cast as `archetype: "paper-pop-performer"`,
`principals.max: 2` and a closed `stageRoles` list, and `style-identity` /
`preflight` compared every library character against that one archetype. That
made a style's identity depend on **which character** was in the film. It also
made a four-character or divine cast impossible without calling it a new style.

The user's correction is right: props, sets, backgrounds, characters and
environments depend on the video. The style owns the **construction**:
cut paper, layered 2.5D, torn/cut edges, brads, one hard key and contact shadow,
drawn-cartoon face, 3 head layers, 3 hair layers, visible hands with fingers,
paper props and practical light. The film owns **who** is in it and **what**
world it is.

## Decision

- **Archetype is film-local.** A pose file still declares one, but the style
  does not compare it to a fixed string. It must be non-empty.
- **Stage roles are film-local.** `star`, `divine`, `mortal`, `attendant`,
  `vahana`, etc. are examples. A character needs at least one role; the style
  does not close the list.
- **Cast size is 1-4 principals.** The format no longer caps the film at two.
- **Appearance is the construction contract.** `faceStyle`, `headLayers`,
  `hairLayers`, `bradMetal` and `fingers` must match the style. This is what
  keeps a new Lakshmi, a human, or a creature still Paper K-pop.
- **Props, sets, backgrounds and recipes are film-owned.** A film may add them
  to the pack's vocabulary when the topic needs them. The pack's frame bands,
  field bands, composition rhythm, camera grammar, palette roles, light,
  shadow, halftone and forbidden list still protect the look.
- **No new identity pack.** The film stays `paper-kpop@0.2.0`. `paper-myth` is
  withdrawn as an identity; a myth film is a Paper K-pop film with film-local
  characters and props.

## Measured/proved

- `tokens.identity.cast` now says `archetype: "paper-puppet"`,
  `principals: {min:1,max:4}`, `appearance.fingers: true`, and the roles include
  `divine`, `mortal`, `attendant`, `vahana`.
- `capabilities.limits.maxCast` is 4.
- `style-identity` and `preflight` accept any non-empty archetype/role if the
  appearance matches.
- A film-local `paper-divine` character passes; a character with
  `fingers: false` fails.
- `npm test` includes both cases.

## The first film under this rule

***Lakshmi and the Lights*** (`films/lakshmi-diwali/`) is a `paper-kpop@0.2.0`
film, not a new pack. It is 60 s, 13 shots, 159 words at 81% voiced, with four
film-local characters (Lakshmi, Vishnu, Householder, Child), 11 poses and 14
expressions each, and 13 film-local recipes. The recipes live in the pack's
`recipes/` vocabulary because the resolver and the painter read one directory;
the 0.2.0 gate now lists **35** recipes (22 pack + 13 film) and proves all 35
fit their text in both aspects at the 14 px floor. `capabilities.proof.frames`
names all 35. No sealed plan names a myth recipe.

The delivered picture is
`sha256:94635053253d76b596ba797c05699f6907522b3b45e4aa6088152b2ae188e435`.
`gate:7` is **PASS, 28 checks**, and `film:review --gate --reuse` is **PASS**,
both tied to that picture. `audit:body` passes 4/4 cast members; `audit:reaction`
has one word-bound event (the rangoli turns on `v06` at 31.80 s, **+0.0
frames**). The score audit has four warnings, all the library's known
`asleep`/`slump` silhouette similarity; they are warnings, not findings.

## Staging slots are not recipe slots

`stage.*` (`field`, `floorY`, `device`, `spot`) is the painter's staging
namespace. It is read by the backend, not by a recipe's composition, so
`resolveTreatment` no longer warns that a recipe has not declared it. A film may
use the staging vocabulary without editing every recipe. This removes 52
false warnings from *Lakshmi and the Lights*; the four remaining warnings are
the library's known `asleep`/`slump` silhouette similarity, not a film defect.

## What this does not change

- The frame bands (luma/saturation/edges), field bands, composition, local
  contrast, cast size 1-4, joints, hands, face, palette roles, shadow, halftone,
  camera grammar and forbidden list.
- The 0056 visual contract: exact phrase, one device, no repeats, a body that
  acts, no text on a face.
- The style is still recognisably Paper K-pop; it is not a generic paper style.
  The construction and the light are what make it the channel.
