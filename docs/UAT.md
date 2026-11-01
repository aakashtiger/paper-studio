# UAT — user acceptance testing

UAT is a checklist a non-programmer can run. If a check needs code reading, it is the wrong check.

Every feature gets:

1. A one-line user story.
2. Acceptance criteria written as observable statements.
3. A command or a screen where the criteria can be checked.
4. A sign-off line with a date and a name.

Automated checks live in CI. Manual checks live here.

## How to sign off

```
Feature:        wedding brief v0
Checked by:     <name>
Date:           YYYY-MM-DD
Result:         pass / fail
Notes:          <one line>
```

---

## W0.1 — Brief validation

**Story:** a couple's details can be captured and checked before anything is rendered.

- [ ] `npm run typecheck` exits with no errors.
- [ ] `npm run plan -- fixtures/wedding-min/brief.json` exits successfully.
- [ ] Removing `couple.partnerA.name` from the fixture causes a clear validation error naming the field.
- [ ] Changing `palette` to a value not in `capabilities.json` causes an error that lists the supported palettes.
- [ ] Changing `duration` to 31 causes a validation error.
- [ ] The plan contains one shot per selected recipe, in order, with no gaps in time.

## W0.2 — Plan correctness

**Story:** the plan is a faithful, deterministic translation of the brief.

- [ ] Running `npm run plan` twice produces identical output.
- [ ] The names in the plan match the brief exactly, including spelling.
- [ ] The date reads as a human date, not `2027-02-14`.
- [ ] The venue reads as `venue, city`.
- [ ] With no photos in the brief, the plan warns and substitutes a text shot.
- [ ] The shot durations sum to the requested duration.

## W1.1 — First render

**Story:** the plan becomes a watchable film.

- [ ] `npm run render -- fixtures/wedding-min` writes an MP4.
- [ ] The film is exactly the requested duration, within one frame.
- [ ] Names and date are legible on a phone at arm's length.
- [ ] Nothing is clipped at the edges in 9:16.
- [ ] Audio is present and not clipping.
- [ ] The film plays on mute and still communicates the essential details.

## W2.1 — Wedding film, real brief

**Story:** a real couple's film can be produced without bespoke work.

- [ ] All names spelled exactly as supplied.
- [ ] Every event date and venue correct.
- [ ] RSVP value works when tapped or scanned.
- [ ] Photos are treated, not pasted.
- [ ] No invented detail anywhere in the film.
- [ ] 9:16, 16:9 and still card all delivered.
- [ ] WhatsApp version plays inline in chat.
- [ ] The couple can request one change and see it without a full re-render.

## W2.2 — Revision

**Story:** a change is cheap.

- [ ] Change the date: only date-bearing shots re-render.
- [ ] Swap a photo: only photo shots re-render.
- [ ] Change palette: all shots re-render, but the project does not lose its seed.
- [ ] The previous version remains accessible.

## W3.1 — Service delivery

**Story:** a film can be sold, reviewed and delivered.

- [ ] Intake form captures every required field.
- [ ] Confirmation screen reads back names, date and venue before render.
- [ ] Review link opens without an account.
- [ ] A comment can be pinned to a timecode.
- [ ] Approval is recorded with a timestamp.
- [ ] Delivery kit contains all outputs in the spec.

## F1 — the first real film (*Same Alarm*)

**Story:** the director's idea becomes a one-minute film without anyone typing
animation code, and every claim the film makes can be checked by looking at one
command's output.

- [ ] `npm run film -- films/same-alarm/score.json` prints the film and exits 0.
- [ ] `npm run audit -- films/same-alarm/score.json` prints `"ok": true` with no
      errors and no warnings.
- [ ] `npm run film:chain -- films/same-alarm/score.json` runs to the end and the
      last line is the review, with `film:review --gate` **PASS**.
- [ ] `build/same-alarm/storyboard/storyboard.png` shows ten different frames,
      one per shot, in order: a phone at dawn, a corridor, a desk, the same desk,
      a supervisor, a window, the desk at night, the phone again, the desk, a
      card.
- [ ] The hour tab in the corner of each frame changes only where the brief's
      spine changes it, and reads the same hour twice (06:00 at the start and at
      the loop) because the day repeats.
- [ ] The paper stack is never smaller than it was in the shot before.
- [ ] The narration says "same alarm", "nine hours" and "still here" — the
      brief's three must-say lines — and the film says nothing the brief does not.
- [ ] `films/same-alarm/same-alarm.mp4` plays with sound, is 60 s long, and the
      last thing heard is the alarm it opened with.
- [ ] Watching it muted still tells the story: alarm, commute, desk, someone
      demanding, dark, alarm again.

## Regression

- [ ] Golden fixture renders to the committed hash on a clean machine.
- [ ] Every fixture in `fixtures/` produces a valid plan.
- [ ] No fixture requires network access.
