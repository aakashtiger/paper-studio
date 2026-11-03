import test from "node:test";
import assert from "node:assert/strict";
import { parseSilenceDetect } from "../src/engine/voice-activity.js";

const log = (lines: string[]) => ["ffmpeg version 6.0", ...lines].join("\n");

test("voiced seconds are the film minus the detected silences", () => {
  const activity = parseSilenceDetect(
    log([
      "  Duration: 00:00:10.00, bitrate: 1536 kb/s",
      "[silencedetect @ 0000] silence_start: 2",
      "[silencedetect @ 0000] silence_end: 2.5 | silence_duration: 0.5",
      "[silencedetect @ 0000] silence_start: 7",
      "[silencedetect @ 0000] silence_end: 8 | silence_duration: 1",
    ]),
    10,
  );
  assert.equal(activity.silence, 1.5);
  assert.equal(activity.voiced, 8.5);
  assert.equal(activity.longest, 1);
  assert.equal(activity.longestAt, 7);
});

test("a silence that runs past the end of the film stops at the film", () => {
  const activity = parseSilenceDetect(
    log([
      "  Duration: 00:00:12.00, bitrate: 1536 kb/s",
      "[silencedetect @ 0000] silence_start: 9.5",
      "[silencedetect @ 0000] silence_end: 12 | silence_duration: 2.5",
    ]),
    10,
  );
  assert.equal(activity.silence, 0.5);
  assert.equal(activity.voiced, 9.5);
});

test("an unclosed silence at the end of the file is silence", () => {
  const activity = parseSilenceDetect(
    log([
      "  Duration: 00:00:08.00, bitrate: 1536 kb/s",
      "[silencedetect @ 0000] silence_start: 6",
    ]),
    10,
  );
  // The audio ends at 8 s; the two seconds after it are silence in the film.
  assert.equal(activity.silence, 4);
  assert.equal(activity.voiced, 6);
  assert.equal(activity.longest, 2);
});

test("a file with no silence is voiced end to end", () => {
  const activity = parseSilenceDetect(log(["  Duration: 00:00:10.00, bitrate: 1536 kb/s"]), 10);
  assert.deepEqual(activity, { voiced: 10, silence: 0, longest: 0, longestAt: 0 });
});

test("the film, not the audio file, bounds the measurement", () => {
  const activity = parseSilenceDetect(
    log([
      "  Duration: 00:00:40.00, bitrate: 1536 kb/s",
      "[silencedetect @ 0000] silence_start: 28",
      "[silencedetect @ 0000] silence_end: 29 | silence_duration: 1",
    ]),
    30,
  );
  // Everything past 30 s is outside the film and cannot count as voiced.
  assert.equal(activity.voiced, 29);
  assert.equal(activity.silence, 1);
});
