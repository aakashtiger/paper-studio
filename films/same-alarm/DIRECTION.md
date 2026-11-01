# Same Alarm — direction

The film the brief asks for: **the life of a corporate slave from morning to
night, one minute, new characters.** Paper collage, 16:9, 60 s, 30 fps,
narration, generated SFX, no music.

Everything the film asserts about Kiran and Vaz is written in `brief.json` and
nowhere else. This file is how the film is *made*, not what it *claims*.

## The argument

A day is a loop, and the film is a loop. It opens on an alarm and closes on the
same alarm, in the same room, with the same phone; the difference is the hand.
The first time it comes down. The last time it stops above the phone and the
alarm keeps ringing — and the day starts again on the card.

The hour is printed on the frame as a torn paper tab, and it is the only clock:
06:00, 07:20, 09:00, 13:00, 16:00, 18:00, 21:00, 06:00, 09:00. Those hours come
from the brief's spine, not from the painter. **Nine hours** is therefore exactly
the desk, 09:00 to 18:00, and the film shows 21:00 after it.

Five things are true of the film and nothing else is:

1. The **hour is a paper label** cut into the top-left margin, and the phone's
   own screen prints the same hour because the score's caption says it.
2. The **office is a light**, not a company. No logo, no brand, no city, no
   salary, no payslip, no family. A desk, a chair, a monitor, a stack, a window,
   a fluorescent bar, a lamp.
3. **Vaz** is a supervisor and does three things: arrives, points at the stack,
   leaves without a word. Nothing about Vaz is explained.
4. The **paper stack only grows.** It never shrinks, in any shot, for sixty
   seconds. It is the film's only running gag and its only clock, and its height
   is derived from the film's `build` events, not typed in.
5. **Nobody speaks.** The narration is the film's voice; Kiran never says a word
   and the film never puts one in his mouth.

## Shot list

| # | recipe | length | hour | what happens |
|---|---|---|---|---|
| s01 | `alarm_close` | 4.0 | 06:00 | a bedroom before dawn: bed, nightstand, lamp, a phone ringing; a sleeve arrives from the right and the hand comes down on it |
| s02 | `corridor_walk` | 5.5 | 07:20 | a corridor of identical doors scrolls left; Kiran walks and never arrives |
| s03 | `desk_wide` | 6.5 | 09:00 | the desk under a fluorescent bar, the window behind; the stack is one sheet; he sits into the work |
| s04 | `desk_wide` | 6.0 | 13:00 | the same frame, four hours later; the stack is a pile; he has not sat up |
| s05 | `supervisor_point` | 6.5 | 16:00 | Vaz enters from the right, points at the stack, leaves; Kiran's shoulders drop |
| s06 | `window_dusk` | 6.5 | 18:00 | one window goes grey to orange to grey; the nine hours are over; the desk is still full |
| s07 | `desk_night` | 7.5 | 21:00 | the fluorescent bar is off, one lamp is on, the city is lit, the stack is taller than he is, and he goes down onto the desk |
| s08 | `loop_close` | 6.0 | 06:00 | the same nightstand, the same ring; the hand comes up over the phone and **does not come down** |
| s09 | `desk_wide` | 6.5 | 09:00 | the next morning, the same desk, the same hour, the stack already taller |
| s10 | `loop_card` | 5.0 | — | SAME ALARM, one line, a paper bell; the alarm rings once under the card and the frame goes quiet |

Total 60.0 s. Median shot 6.25 s (`score.edit.medianShot`).

## Narration (7 lines, each placed at its authored second)

| id | at | text | why here |
|---|---|---|---|
| v01 | 0.8 | "Same alarm." | the first thing the film says is the last thing it says |
| v02 | 6.4 | "Same corridor, same doors." | over the corridor, while the figure never arrives |
| v03 | 12.4 | "Nine hours under a light that never changes." | over the desk at 09:00, so the line is true when it is said |
| v04 | 24.6 | "Someone always needs it sooner." | over Vaz pointing at the stack |
| v05 | 33.0 | "The room empties." | over the dusk window, as the light leaves |
| v06 | 37.5 | "Still here." | over the dark desk, past the end of the day |
| v07 | 55.8 | "Same alarm." | over the closing nightstand; the loop shuts |

Every line is spoken straight. No line is a punchline; the cut is. The narration
is Kokoro (`af_heart`) through the local bridge, the clock is measured on the
audio, and the word times come from local Whisper.

## Look

Paper cut-out, one key light, torn edges, eyelets, a halftone grain over the
whole frame. The palette is the pack's; the film adds no colours.

- **Bedroom (s01, s08):** the wall and the bed fall away from the lamp; the phone
  is the brightest thing in the frame because it is the only thing asking for
  attention. The arm is the only saturated blue in the room, and it is the only
  thing in the film that acts on the alarm.
- **Corridor (s02):** flat, endless, and the same door repeated. The floor seams
  move faster than the doors, so the corridor has depth without perspective.
- **Office (s03–s07, s09):** one room, one window, one desk. The window's sky is
  the hour the shot prints, so the room is lit by its own clock. At night the
  desk falls to ink, the monitor and the lamp become the only light, and the city
  in the window is the only thing outside the frame that is awake.
- **Card (s10):** cream paper, one red bell, two lines of type. Nothing else.

## Sound

No music. The film is scored by its own foley, generated in code: an alarm hum, a
slap on the phone, the room tone of an office, footsteps in a corridor, paper, a
fluorescent buzz that is a room tone and not a cue, a door, a lamp switch, and
the alarm again under the card. Each cue is bound to the picture event that
causes it (`event: { shot, index }`), so a cut cannot drift from its sound and a
re-time of the score moves the cue with the picture.

The master is one measured gain and a true-peak limiter; the delivered file is
measured again after the mux.

## What the film may not do

- No second character on screen with Kiran except Vaz, and Vaz only in s05.
- No leg below the desk: the desk recipes frame from the waist up. A desk
  occludes, and a seated leg rig is a rig problem this film does not need.
- No music, no logo, no brand, no city, no number on a payslip.
- No shot may show the stack smaller than the shot before it.
- No invented text on a prop: the phone prints the hour the score gives it, and
  the card prints the film's own title and line.
- No pose the cast library does not have, and no silent fallback to `idle`. A
  performance the score asks for is a pose someone authored.
