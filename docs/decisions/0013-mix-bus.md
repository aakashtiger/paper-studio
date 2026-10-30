# 0013 — The mix bus

Status: accepted. Gate G6.

## Context

The board animatic mixed a recorded voice with a summed SFX bed and normalised
it with one `loudnorm` pass. That was enough to sign a board pass, but it had
real holes for a delivered film: no sidechain duck, so the paper hits fought
the narration; the voice kept its sub-80 Hz rumble; every cue shared one dry
space with no reverb; the tail ended on a hard cut; and the master measured
−15.1 LUFS / −1.0 dBTP, quieter than a delivery target and with almost no true
peak headroom. The score's cues carried `layers` as a note but nothing read it.

## Decision

One mix bus, `src/engine/mix.ts`, pure and deterministic. `npm run mix` is its
only front door.

- The voice is highpassed at 75 Hz (2nd-order Butterworth, Q = 0.707).
- Every cue is placed in its declared `band`, defaulting by kind.
- The 1–4 kHz band of each cue is ducked against a voice envelope measured in
  the same band, `duckDb` per cue, 3–8 dB by default, with a 5 ms attack and a
  150 ms release so the duck does not chatter.
- Every cue sends to one shared reverb return (Freeverb comb/allpass tuning,
  `room 0.82`, `damp 0.2`, `wet 0.32`), so the paper stage has one space.
- The last 0.5 s is cosine-faded to silence.
- ffmpeg's two-pass `loudnorm` masters the bus to −14.0 LUFS / ≤ −1.5 dBTP, and
  `ebur128` measures the result. `npm run mix` fails if it is out of tolerance.

The cue schema gains three optional fields: `band [lo, hi]`, `send` (0–1) and
`duckDb` (0–12). They are authored inputs, not invented by the engine.

## Consequences

- The mix is a build artifact with a report: `build/<id>/mix/mix-report.json`
  carries the measured loudness and the master hash.
- `render:film --audio build/<id>/mix/master.wav` is the delivered track.
- The bus is style-free: it knows frequency bands and a voice, not a palette or
  a shot. A music film without a voice simply skips the duck.
- `layers` remains design metadata. The synth already builds transient, body and
  tail into each kind; making the field gate synthesis is a later, separate job.
