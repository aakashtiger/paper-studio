window.KPOP_LINES = [
  {
    text: "On the first night, a knife in the rain.",
    start: 0.2, end: 2.9,
    words: [
      { w: "On", t: 0.3, d: 0.3 }, { w: "the", t: 0.6, d: 0.3 }, { w: "first", t: 0.9, d: 0.3 }, { w: "night", t: 1.2, d: 0.3 },
      { w: "a", t: 1.5, d: 0.3 }, { w: "knife", t: 1.8, d: 0.3 }, { w: "in", t: 2.1, d: 0.3 }, { w: "the", t: 2.4, d: 0.3 }, { w: "rain", t: 2.7, d: 0.3 },
    ],
  },
  {
    text: "Nine days he ran; the city closed behind him.",
    start: 3.2, end: 5.9,
    words: [
      { w: "Nine", t: 3.3, d: 0.3 }, { w: "days", t: 3.6, d: 0.3 }, { w: "he", t: 3.9, d: 0.3 }, { w: "ran", t: 4.2, d: 0.3 },
      { w: "the", t: 4.5, d: 0.3 }, { w: "city", t: 4.8, d: 0.3 }, { w: "closed", t: 5.1, d: 0.3 }, { w: "behind", t: 5.4, d: 0.3 }, { w: "him", t: 5.7, d: 0.3 },
    ],
  },
  {
    text: "In a rented room, he watched the calendar turn.",
    start: 6.2, end: 8.9,
    words: [
      { w: "In", t: 6.3, d: 0.3 }, { w: "a", t: 6.6, d: 0.3 }, { w: "rented", t: 6.9, d: 0.3 }, { w: "room", t: 7.2, d: 0.3 },
      { w: "he", t: 7.5, d: 0.3 }, { w: "watched", t: 7.8, d: 0.3 }, { w: "the", t: 8.1, d: 0.3 }, { w: "calendar", t: 8.4, d: 0.3 }, { w: "turn", t: 8.7, d: 0.3 },
    ],
  },
  {
    text: "They took him in the rain, and the cuffs closed.",
    start: 9.2, end: 11.9,
    words: [
      { w: "They", t: 9.3, d: 0.28 }, { w: "took", t: 9.58, d: 0.28 }, { w: "him", t: 9.86, d: 0.28 }, { w: "in", t: 10.14, d: 0.28 },
      { w: "the", t: 10.42, d: 0.28 }, { w: "rain", t: 10.7, d: 0.28 }, { w: "and", t: 10.98, d: 0.28 }, { w: "the", t: 11.26, d: 0.28 },
      { w: "cuffs", t: 11.54, d: 0.28 }, { w: "closed", t: 11.82, d: 0.28 },
    ],
  },
  {
    text: "The cell was small, and the days were long.",
    start: 12.2, end: 14.9,
    words: [
      { w: "The", t: 12.3, d: 0.3 }, { w: "cell", t: 12.6, d: 0.3 }, { w: "was", t: 12.9, d: 0.3 }, { w: "small", t: 13.2, d: 0.3 },
      { w: "and", t: 13.5, d: 0.3 }, { w: "the", t: 13.8, d: 0.3 }, { w: "days", t: 14.1, d: 0.3 }, { w: "were", t: 14.4, d: 0.3 }, { w: "long", t: 14.7, d: 0.3 },
    ],
  },
  {
    text: "The court read the file and named the sentence.",
    start: 15.2, end: 17.9,
    words: [
      { w: "The", t: 15.3, d: 0.3 }, { w: "court", t: 15.6, d: 0.3 }, { w: "read", t: 15.9, d: 0.3 }, { w: "the", t: 16.2, d: 0.3 },
      { w: "file", t: 16.5, d: 0.3 }, { w: "and", t: 16.8, d: 0.3 }, { w: "named", t: 17.1, d: 0.3 }, { w: "the", t: 17.4, d: 0.3 }, { w: "sentence", t: 17.7, d: 0.3 },
    ],
  },
  {
    text: "At dawn, the yard, and the bell.",
    start: 18.2, end: 20.9,
    words: [
      { w: "At", t: 18.3, d: 0.3 }, { w: "dawn", t: 18.6, d: 0.3 }, { w: "the", t: 18.9, d: 0.3 }, { w: "yard", t: 19.2, d: 0.3 },
      { w: "and", t: 19.5, d: 0.3 }, { w: "the", t: 19.8, d: 0.3 }, { w: "bell", t: 20.1, d: 0.3 },
    ],
  },
];
window.KPOP_WORDS = window.KPOP_LINES.flatMap((l) => l.words);
window.KPOP_SHOTS = [
  { id: "s1", start: 0, end: 3, line: 0 },
  { id: "s2", start: 3, end: 6, line: 1 },
  { id: "s3", start: 6, end: 9, line: 2 },
  { id: "s4", start: 9, end: 12, line: 3 },
  { id: "s5", start: 12, end: 15, line: 4 },
  { id: "s6", start: 15, end: 18, line: 5 },
  { id: "s7", start: 18, end: 21, line: 6 },
];
window.KPOP_DURATION = 21.0;
