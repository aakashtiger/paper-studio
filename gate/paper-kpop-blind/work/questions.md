# Questions — Last Cue

The pack fixes the grammar; these are the questions it leaves. None of them changes the pack. Each is either the director's open choice, a contract gap, or a provisional reading recorded in `treatment.md`.

## 1. `paper-shadow` — the open choice

Does the paper cast a shadow? **Collage** gives every layer a soft contact shadow and a visible cut edge; **Print** keeps the layers flat with the same visible cut edge and gives only the type a hard offset shadow. I have not answered this. The film is built to hold both: the close's diorama is read from overlapping cut edges and will take either finish, and the type shadow is fixed in both. The director must choose before sign-off.

## 2. The stage meter

`stage_wide` requires a black sticker meter with "a beat count and a four-role bar in DM Mono", and `tokens.medium.hud.meter` says the four roles come from the format's `palette` field (default `day-stage`). Day-stage names six roles; a frame may carry four; my stage frame uses paper, ink, red and acid. Which four does the bar show — the frame's four, or a fixed palette four that includes blue and accent? Is "88" the BPM or the beat count? Does the meter's acid readout count against the frame's four? I have drawn the bar from the frame's four and read 88 as the BPM; if the bar must show a fixed four that includes blue and accent, the stage frame would carry more than four roles.

## 3. The lyric band's red

`portrait_iris` sets the band op `color: red`. `STYLE.md` calls the band "a torn ink or red strip, role-tinted by the treatment". Is red fixed by the recipe, or may the treatment tint the band ink and free red for the costume? I kept red, because the recipe writes it and the band is the frame's red plate.

## 4. Ink type on the accent core

`paper_open` sets the title `color: ink` over a `core-burst` in `accent`. The text-fill decision covers red fields (paper type) and paper fields (ink type), but not the accent/gold field. Is ink-on-gold the intended fill, or should the core become paper or red behind the title? I kept the recipe's ink; the cream lip and the hard ink shadow read on gold.

## 5. The iris and the hold

The pack names `iris` and `hold` as transitions but gives no duration, easing or share of the shot. `paper_open` and `portrait_iris` both leave on an iris; `pullback_close` ends on a hold. Does the iris close to paper or ink and the next shot cut in, or does it open onto the next image? How much of the 5.199 s close is the hold? I planned the iris on the gold core (shot 1) and the face (shot 3), and a pull-back then hold at the close; the pack defines neither.

## 6. The rotated sticker's shadow

`sticker_slam` rotates the sticker 4° and the body text 4°. The type shadow is "one fixed offset for the whole stack", down and right. Does the shadow rotate with the sticker/text, or stay screen-down-right? At 4° the difference is visible, and "fixed" could mean either.

## 7. The caption outside the band

The caption is one value used in the lyric band (two lines allowed), the macro caption and the stage lower caption. The stage caption box is 0.06 h (about 42 px at 390 px wide); the macro box is 0.10 h. Is the two-line allowance band-only? My seven-word line wraps to two lines in the stage box or auto-fits just under 16 px; both clear the 14 px floor, but the pack does not say which.

## 8. The `palette` field

`STYLE.md` says the format may carry a `palette` field so the meter can read the four roles. The `inputs/APPLICATION.md` format shape does not list it; the pack's own APPLICATION example includes it. Is it resolver passthrough metadata like `loudness`, or is it read by the meter? I include `"palette": "day-stage"`; if the resolver rejects unknown format fields, it should be dropped.

## 9. The voice and the caption

The pack says the caption may be an original vocal line and that voice is an optional performance track, not a content slot. Is the caption meant to be heard (one short line), or only printed? If heard, where does it sit — the portrait band, the stage, or the close? The pack gives no voice timing. I have treated the caption as the printed lyric line and committed no voice.

## 10. The 30 s / 88 BPM end

The plan sums to 30.000 s, but the pack's 0.21 s offset puts the 88 BPM beats at 0.210, 0.892, … and the next beat after 30.000 at 30.210. The plan's cut points are not all on the grid. S2 quantises cuts to the grid; does the final 30.000 s hold, and how far may a cut move? The treatment quotes plan seconds, not frame-exact seconds.

## 11. The title's line break

The style says display lines break "where the paper would cut, not where a text box ends". `paper_open` has one title text op; `content.title` is "Last Cue". Does the treatment pin the break as LAST / CUE, or does auto-fit decide? I have directed the two-line stack; the pack has no per-slot line-break field.

## 12. Halftone screen

`tokens.medium.halftone` sets `alpha: 0.5` and gives the angle as `0.2` with no unit; the recipes set the halftone effect `opacity` to 0.18–0.24 and `amount` to 0.5–0.6. Is 0.2 radians or degrees, and do the opacities multiply (an effective 0.09–0.12) or does the recipe opacity replace the token alpha? The dot's strength changes the stage and the sticker. I read the recipe opacity as the layer opacity and the token alpha as the dot's own alpha; the pack does not state the composition.
