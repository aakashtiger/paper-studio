/**
 * Words, in the script's spelling, with the times a reader actually heard.
 *
 * Speech recognition returns what it heard — "1919" as "nineteen nineteen", a
 * name spelled its own way. The picture needs the *script's* words, because the
 * captions and the type come from the script. So the recogniser's words are
 * attached back onto the script's words: matched words keep their heard span;
 * a run the recogniser split or merged shares the heard span by word length;
 * a word it missed shares the gap between its neighbours.
 *
 * Everything here is pure and deterministic, so the timing can be tested
 * without a model. The models only supply `heard`.
 */

export type HeardWord = { word: string; start: number; end: number };
export type TimedWord = { word: string; start: number; end: number };

/** Lowercase, letters and digits only. "Nineteen-nineteen" → "nineteennineteen". */
export function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

/** Longest matching blocks between two token lists, as [aStart, bStart, length]. */
export function matchingBlocks(a: string[], b: string[]): Array<[number, number, number]> {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      dp[i]![j] = a[i] === b[j] ? (dp[i + 1]![j + 1] ?? 0) + 1 : Math.max(dp[i + 1]![j] ?? 0, dp[i]![j + 1] ?? 0);
    }
  }
  const pairs: Array<[number, number]> = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      pairs.push([i, j]);
      i += 1;
      j += 1;
    } else if ((dp[i + 1]![j] ?? 0) >= (dp[i]![j + 1] ?? 0)) {
      i += 1;
    } else {
      j += 1;
    }
  }
  const blocks: Array<[number, number, number]> = [];
  for (const [x, y] of pairs) {
    const last = blocks[blocks.length - 1];
    if (last && last[0] + last[2] === x && last[1] + last[2] === y) last[2] += 1;
    else blocks.push([x, y, 1]);
  }
  return blocks;
}

const round3 = (value: number) => Number(value.toFixed(3));

/**
 * Attach heard times onto the script's words. Returns one timed word per
 * script word that has content, in script order.
 */
export function attachWords(scriptWords: string[], heard: HeardWord[], duration: number): TimedWord[] {
  const kept = scriptWords.filter((word) => normalizeWord(word) !== "");
  if (kept.length === 0) return [];
  const a = kept.map(normalizeWord);
  const b = heard.map((word) => normalizeWord(word.word));
  const times: Array<[number, number] | null> = kept.map(() => null);

  const blocks = matchingBlocks(a, b);
  for (const [start, heardStart, length] of blocks) {
    for (let k = 0; k < length; k += 1) {
      const word = heard[heardStart + k]!;
      times[start + k] = [word.start, word.end];
    }
  }

  // A run of script words the recogniser did not match shares the heard span
  // roughly in proportion to how long each word is.
  const runs: Array<{ i1: number; i2: number; j1: number; j2: number }> = [];
  let prev = { i: 0, j: 0 };
  for (const [start, heardStart, length] of blocks) {
    if (prev.i < start) runs.push({ i1: prev.i, i2: start, j1: prev.j, j2: heardStart });
    prev = { i: start + length, j: heardStart + length };
  }
  if (prev.i < kept.length) runs.push({ i1: prev.i, i2: kept.length, j1: prev.j, j2: heard.length });

  for (const run of runs) {
    if (run.j2 <= run.j1) continue; // no heard words to share; filled below
    const from = heard[run.j1]!.start;
    const to = heard[run.j2 - 1]!.end;
    const weights = kept.slice(run.i1, run.i2).map((word) => Math.max(1, normalizeWord(word).length));
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    let cursor = 0;
    weights.forEach((weight, index) => {
      const start = from + ((to - from) * cursor) / total;
      const end = from + ((to - from) * (cursor + weight)) / total;
      times[run.i1 + index] = [round3(start), round3(end)];
      cursor += weight;
    });
  }

  // Anything still untimed shares the gap between its timed neighbours.
  let index = 0;
  while (index < times.length) {
    if (times[index] !== null) {
      index += 1;
      continue;
    }
    let end = index;
    while (end < times.length && times[end] === null) end += 1;
    const from = index > 0 ? times[index - 1]![1] : 0;
    const to = end < times.length ? times[end]![0] : duration;
    const count = end - index;
    for (let k = 0; k < count; k += 1) {
      times[index + k] = [round3(from + ((to - from) * k) / count), round3(from + ((to - from) * (k + 1)) / count)];
    }
    index = end;
  }

  return kept.map((word, position) => ({ word, start: times[position]![0], end: times[position]![1] }));
}

export type NarrationLine = { id: string; text: string; start: number; duration: number; hold?: number };

/**
 * The clock, derived from the transcript: each narration line takes its start
 * and duration from the words the reader actually spoke, not from a typed
 * guess. Words are consumed in order, so the line texts must match the script.
 */
export function deriveClockLines(
  lines: Array<{ id: string; text: string; hold?: number }>,
  words: TimedWord[],
): NarrationLine[] {
  const out: NarrationLine[] = [];
  let cursor = 0;
  for (const line of lines) {
    const tokens = line.text.split(/\s+/).filter((token) => token !== "");
    const span = words.slice(cursor, cursor + tokens.length);
    cursor += tokens.length;
    if (span.length === 0) continue;
    const start = span[0]!.start;
    const end = span[span.length - 1]!.end;
    out.push({ id: line.id, text: line.text, start: round3(start), duration: round3(end - start), ...(line.hold !== undefined ? { hold: line.hold } : {}) });
  }
  return out;
}

export type SnapShot = { id: string; start: number; duration: number };

/**
 * Snap shot boundaries onto phrase beats.
 *
 * A boundary within `window` seconds of a beat (the start of a spoken line)
 * moves to it; a boundary further away is left where the director put it. The
 * film length is preserved: moving one boundary stretches the shot before it
 * and shrinks the shot after it.
 */
export function snapShots(shots: SnapShot[], beats: number[], window = 0.35): { shots: SnapShot[]; moved: Array<{ id: string; from: number; to: number }> } {
  const starts = shots.map((shot) => shot.start);
  const moved: Array<{ id: string; from: number; to: number }> = [];
  const snapped = [...starts];
  for (let index = 1; index < snapped.length; index += 1) {
    const boundary = snapped[index]!;
    const nearest = beats.reduce<number | null>((best, beat) => {
      if (best === null) return beat;
      return Math.abs(beat - boundary) < Math.abs(best - boundary) ? beat : best;
    }, null);
    if (nearest !== null && Math.abs(nearest - boundary) <= window && nearest > snapped[index - 1]!) {
      snapped[index] = round3(nearest);
      moved.push({ id: shots[index]!.id, from: round3(boundary), to: round3(nearest) });
    }
  }
  const total = shots.reduce((sum, shot) => sum + shot.duration, 0);
  const out = shots.map((shot, index) => {
    const start = snapped[index]!;
    const end = index + 1 < snapped.length ? snapped[index + 1]! : round3(total);
    return { id: shot.id, start, duration: round3(end - start) };
  });
  return { shots: out, moved };
}

/** Fraction of the script's words the recogniser heard, 0–1. */
export function coverage(scriptWords: string[], heard: HeardWord[]): number {
  const wanted = scriptWords.map(normalizeWord).filter(Boolean);
  if (wanted.length === 0) return 1;
  const blocks = matchingBlocks(wanted, heard.map((word) => normalizeWord(word.word)));
  const matched = blocks.reduce((sum, block) => sum + block[2], 0);
  return matched / wanted.length;
}

/**
 * The script words the recogniser did not hear, in script order. Read by the
 * ASR report, so a name that was swallowed is named rather than counted.
 */
export function unheard(scriptWords: string[], heard: HeardWord[]): string[] {
  const kept = scriptWords.filter((word) => normalizeWord(word) !== "");
  const blocks = matchingBlocks(kept.map(normalizeWord), heard.map((word) => normalizeWord(word.word)));
  const matched = new Set<number>();
  for (const [start, , length] of blocks) {
    for (let k = 0; k < length; k += 1) matched.add(start + k);
  }
  return kept.filter((_, index) => !matched.has(index));
}
