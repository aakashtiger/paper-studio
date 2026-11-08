/* KPOP proof lyric map — the measured Understudy read, trimmed to 10.2 s. */
const KPOP_LYRICS = [
  {
    id: 'v01', start: 0.18, end: 3.10,
    text: 'Every night, the cue lamp calls one name.',
    words: [
      ['Every', 0.18], ['night,', 0.76], ['the', 1.30], ['cue', 1.36],
      ['lamp', 1.54], ['calls', 1.74], ['one', 2.00], ['name.', 2.26],
    ],
  },
  {
    id: 'v02', start: 5.16, end: 6.40,
    text: 'Tonight, Nova is the star.',
    words: [['Tonight,', 5.16], ['Nova', 5.66], ['is', 5.76], ['the', 5.96], ['star.', 6.14]],
  },
  {
    id: 'v03', start: 8.85, end: 10.20,
    text: 'But the wings were empty.',
    words: [['But', 8.85], ['the', 9.01], ['wings', 9.15], ['were', 9.37], ['empty.', 9.61]],
  },
];

for (const line of KPOP_LYRICS) {
  line.words = line.words.map((word, i) => {
    const next = line.words[i + 1] ? line.words[i + 1][1] : line.end;
    return { w: word[0], t: word[1], d: Math.max(0.18, next - word[1]) };
  });
  line.big = line.text.replace(/[.,]$/, '');
}

function lyricAt(t) {
  let found = null;
  for (const line of KPOP_LYRICS) if (t >= line.start - 0.02 && t <= line.end + 0.3) found = line;
  return found;
}
