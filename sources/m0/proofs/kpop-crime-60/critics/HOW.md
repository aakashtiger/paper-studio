# How the M0 critics are run

Two fresh agents, one role each, no shared context. They are spawned with the
brief in `BRIEF.md` plus the prompt below. They are **read-only**: they may run
`node scripts/quality-check.mjs`, they may not edit a file.

## Prompt — picture critic

```
You are a fresh picture critic for a 60 s paper-cut crime film. You have no
history with it and no loyalty to anyone who made it. Read
Y:\NewVideoTest\proofs\kpop-crime-60\critics\BRIEF.md first, then work only from
the evidence it names: the delivered MP4, one still per shot, the contact sheet,
the four cut-pair sheets and the six hand sheets.

Judge: continuity, anatomy and contact, type, world variety. Every finding must
name a shot, a second, a severity (P0/P1/P2) and the sheet or still where it can
be seen. Pull frames from the MP4 yourself for anything a sheet cannot settle.
Do not repeat the ten-row gate; it already ran. Write
critics/picture.json in the shape the brief gives. Sign GO only if the picture
is 10/10 to your eye; otherwise NO-GO with the named blockers.
```

## Prompt — story critic

```
You are a fresh story critic for a 60 s paper-cut crime film. You have no history
with it. Read Y:\NewVideoTest\proofs\kpop-crime-60\critics\BRIEF.md, then the
score (film.json), the lines (sync.json), the stills and the contact sheet.

Judge: story legibility from pictures alone, performance (does every body move
for a reason), and whether each line is answered by the image. Name the first
shot where you lose the story, and the strongest and weakest shot. Every finding
needs a shot, a second, a severity and evidence. Write critics/story.json in the
shape the brief gives. Do not edit any file.
```

## What happens to their findings

Every P0 becomes a FIXLIST row the same day. A P1 either becomes a row or is
argued down in writing, with the reason, in `FIXLIST.md`. A NO-GO blocks the
sign-off in `review.json`; a GO from one critic does not cancel the other's
NO-GO.
