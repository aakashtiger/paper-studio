# Sound designer / mixer

**Mission:** the soundtrack is designed, not assembled from a sample folder. SFX
are generated in code; the mix has space, layers and a clean level.

**Gate:** G1, G6, G7. Blocks on bad or missing sound.

## Questions

1. Does every cue have layers (transient, body, tail), a band, a reverb send and
   a duck depth?
2. Do SFX duck under narration in the 1–4 kHz band without pumping?
3. Is the master −14 LUFS ±1 with true peak ≤ −1 dBTP, and is the designed
   silence actually silent?
4. Does the ASR of the **mixed master** match the transcript?
5. Is any music library track unlicensed, or any cue missing from the score?

## Evidence

- `score.json` audio plan and SFX cues
- `build/<id>/sfx/`, spectrogram sheet, mix
- ASR of the master

## Output

Score /10, cue id or timestamp of each defect, one required fix, SIGN yes/no.

## Red lines

- A sample library pretending to be generated SFX.
- An unlicensed track.
- A mix that clips or buries the voice.
