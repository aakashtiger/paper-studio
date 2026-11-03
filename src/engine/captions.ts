/**
 * Captions are chunks, not whole narration lines.
 *
 * A narration line can be twenty words because the voice needs a sentence; a
 * caption can be eight because a phone reader needs a chunk. The score stores
 * one caption per chunk, with an id of `<line>.<n>`; the caption check accepts a
 * chunk when its words are a contiguous run of its line's words and its window
 * sits inside the line.
 */

export function splitCaption(text: string, maxWords: number): string[] {
  if (!(maxWords > 0)) throw new Error(`maxWords must be positive, got ${maxWords}`);
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const chunks: string[] = [];
  for (let index = 0; index < words.length; index += maxWords) {
    chunks.push(words.slice(index, index + maxWords).join(" "));
  }
  return chunks;
}

/** Is `caption` a contiguous word run of `line`, ignoring whitespace? */
export function isCaptionChunk(line: string, caption: string): boolean {
  const lineWords = line.trim().split(/\s+/).filter(Boolean);
  const captionWords = caption.trim().split(/\s+/).filter(Boolean);
  if (captionWords.length === 0 || captionWords.length > lineWords.length) return false;
  for (let start = 0; start <= lineWords.length - captionWords.length; start++) {
    if (captionWords.every((word, offset) => lineWords[start + offset] === word)) return true;
  }
  return false;
}
