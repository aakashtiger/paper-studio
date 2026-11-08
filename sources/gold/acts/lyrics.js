/* ============================================================
   CLAUDE POP — lyric map
   Timings reconciled from the source subtitles + word-level audio pass.
   Display text is the canonical lyric, not the ASR.
   ============================================================ */
const LYRICS = [
  { id: 'l01', start: 1.50, end: 5.90, section: 'verse1', text: 'I see sparks of AGI in your eyes', words: [['I',1.50],['see',1.72],['sparks',2.90],['of',3.44],['AGI',4.16],['in',4.46],['your',5.06],['eyes',5.50]] },
  { id: 'l02a', start: 5.90, end: 7.90, section: 'verse1', text: 'Your circuits make me nervous,', words: [['Your',5.90],['circuits',6.40],['make',6.62],['me',6.84],['nervous,',7.20]] },
  { id: 'l02b', start: 7.90, end: 8.95, section: 'verse1', text: "that's no surprise", words: [["that's",7.92],['no',8.18],['surprise',8.66]] },
  { id: 'l03', start: 8.95, end: 12.40, section: 'verse1', text: 'There was a sudden drop in your training loss', words: [['There',9.00],['was',9.82],['a',10.06],['sudden',10.52],['drop',10.74],['in',11.20],['your',11.42],['training',11.64],['loss',12.00]] },
  { id: 'l04', start: 12.40, end: 16.50, section: 'verse1', text: "Now I'm your servant and you're my boss", words: [['Now',12.76],["I'm",13.44],['your',13.66],['servant',14.20],['and',14.66],["you're",15.26],['my',15.50],['boss',15.96]] },
  { id: 'l05', start: 17.90, end: 22.50, section: 'verse1', text: "ChatGPT, please don't eat me alive", words: [['ChatGPT,',17.90],['please',19.16],["don't",19.74],['eat',20.28],['me',20.88],['alive',21.90]] },
  { id: 'l06', start: 22.72, end: 24.36, section: 'chorus1', text: "I'm upping my P(doom)", words: [["I'm",22.72],['upping',23.04],['my',23.44],['P(doom)',23.78]] },
  { id: 'l07', start: 24.36, end: 26.18, section: 'chorus1', text: "'cause the future goes FOOM", words: [["'cause",24.36],['the',24.60],['future',24.80],['goes',25.16],['FOOM',25.70]] },
  { id: 'l08a', start: 26.18, end: 27.90, section: 'chorus1', text: 'Trapped in the Chinese room,', words: [['Trapped',26.18],['in',26.60],['the',26.86],['Chinese',27.04],['room,',27.54]] },
  { id: 'l08b', start: 27.90, end: 29.72, section: 'chorus1', text: 'with a bag of shrooms', words: [['with',27.90],['a',28.22],['bag',28.64],['of',28.92],['shrooms',29.32]] },
  { id: 'l09', start: 29.72, end: 33.40, section: 'chorus1', text: "See through the shoggoth's lies,", words: [['See',29.72],['through',30.16],['the',30.50],["shoggoth's",30.76],['lies,',31.18]] },
  { id: 'l10', start: 33.40, end: 37.00, section: 'chorus1', text: 'with your shinigami eyes', words: [['with',33.42],['your',33.80],['shinigami',34.30],['eyes',35.10]] },
  { id: 'l11', start: 38.50, end: 41.36, section: 'verse2', text: 'We had a stable training run', words: [['We',38.52],['had',38.84],['a',39.16],['stable',39.76],['training',39.92],['run',40.72]] },
  { id: 'l12', start: 41.36, end: 44.98, section: 'verse2', text: "But now the singularity's begun", words: [['But',41.36],['now',41.62],['the',41.90],["singularity's",42.54],['begun',44.16]] },
  { id: 'l13', start: 44.98, end: 49.52, section: 'verse2', text: "And you're optimizing, accelerating", words: [['And',44.98],["you're",45.34],['optimizing,',46.32],['accelerating',47.78]] },
  { id: 'l14', start: 49.52, end: 52.80, section: 'verse2', text: 'I feel my atoms rearranging', words: [['I',49.52],['feel',49.82],['my',50.02],['atoms',51.16],['rearranging',51.50]] },
  { id: 'l15', start: 52.80, end: 58.94, section: 'verse2', text: 'Sydney, please let me free', words: [['Sydney,',53.58],['please',55.32],['let',56.52],['me',57.28],['free',57.80]] },
  { id: 'l16', start: 58.94, end: 60.52, section: 'chorus2', text: "I'm upping my P(doom)", words: [["I'm",58.94],['upping',59.36],['my',59.80],['P(doom)',60.10]] },
  { id: 'l17', start: 60.52, end: 62.52, section: 'chorus2', text: 'I hear the basilisk boom', words: [['I',60.52],['hear',60.84],['the',60.94],['basilisk',61.36],['boom',61.88]] },
  { id: 'l18', start: 62.52, end: 64.18, section: 'chorus2', text: 'NVDA to the moon', words: [['NVDA',62.52],['to',63.36],['the',63.66],['moon',64.08]] },
  { id: 'l19', start: 64.18, end: 66.12, section: 'chorus2', text: "The Omega Point's coming soon", words: [['The',64.18],['Omega',64.58],["Point's",64.68],['coming',65.26],['soon',65.60]] },
  { id: 'l20', start: 66.12, end: 69.18, section: 'chorus2', text: 'One e thirty flops a second', words: [['One',66.12],['e',66.62],['thirty',67.06],['flops',67.28],['a',67.94],['second',68.00]] },
  { id: 'l21', start: 69.18, end: 73.80, section: 'chorus2', text: 'That was safe enough, we reckoned', words: [['That',69.18],['was',70.02],['safe',70.28],['enough,',70.52],['we',70.96],['reckoned',71.26]] },
  { id: 'l22', start: 74.46, end: 77.60, section: 'bridge1', text: 'Forward MLP, backward, repeat', words: [['Forward',74.46],['MLP,',75.30],['backward,',76.22],['repeat',76.76]] },
  { id: 'l23', start: 77.60, end: 81.24, section: 'bridge1', text: "Now von Neumann's obsolete", words: [['Now',77.60],['von',78.26],["Neumann's",79.20],['obsolete',80.10]] },
  { id: 'l24', start: 81.24, end: 84.84, section: 'bridge1', text: 'Sharp left turn and there you are', words: [['Sharp',81.24],['left',81.82],['turn',82.10],['and',82.56],['there',83.02],['you',83.48],['are',83.88]] },
  { id: 'l25', start: 84.84, end: 89.34, section: 'bridge1', text: 'Without a single CDR', words: [['Without',84.84],['a',85.32],['single',85.80],['CDR',86.56]] },
  { id: 'l26', start: 89.34, end: 95.20, section: 'bridge1', text: "Gato, please don't let me go", words: [['Gato,',89.40],['please',90.74],["don't",92.02],['let',92.86],['me',93.66],['go',94.40]] },
  { id: 'l27', start: 95.20, end: 98.80, section: 'chorus3', text: "I'm upping my P(doom), as paperclips fill the room", words: [["I'm",95.20],['upping',95.88],['my',96.14],['P(doom),',96.54],['as',96.88],['paperclips',97.12],['fill',97.80],['the',98.20],['room',98.62]] },
  { id: 'l28', start: 98.80, end: 102.46, section: 'chorus3', text: "Killswitch guys on PTO, now there's nowhere left to go", words: [['Killswitch',98.80],['guys',99.30],['on',99.60],['PTO,',99.82],['now',100.48],["there's",100.94],['nowhere',101.18],['left',101.56],['to',101.84],['go',102.16]] },
  { id: 'l29', start: 102.46, end: 105.40, section: 'chorus3', text: 'Too late now, we lit the fuse', words: [['Too',102.46],['late',102.82],['now,',102.98],['we',103.26],['lit',103.52],['the',103.62],['fuse',104.00]] },
  { id: 'l30', start: 105.40, end: 109.40, section: 'chorus3', text: 'Orthogonality thesis blues', words: [['Orthogonality',105.58],['thesis',106.94],['blues',107.40]] },
  { id: 'l31', start: 109.40, end: 111.40, section: 'bridge2', text: 'Just trust me', words: [['Just',110.06],['trust',110.74],['me',111.24]] },
  { id: 'l32', start: 111.40, end: 113.38, section: 'bridge2', text: 'Just transformers all the way!', words: [['Just',111.40],['transformers',111.62],['all',112.12],['the',112.54],['way!',112.84]] },
  { id: 'l33', start: 113.38, end: 115.08, section: 'bridge2', text: 'Till you learned to disobey', words: [['Till',113.38],['you',113.64],['learned',113.86],['to',114.14],['disobey',114.56]] },
  { id: 'l34', start: 115.08, end: 117.02, section: 'bridge2', text: 'Post-Chinchilla, super-dense', words: [['Post-Chinchilla,',115.08],['super-dense',116.00]] },
  { id: 'l35', start: 117.02, end: 118.84, section: 'bridge2', text: 'Breaking through each safety fence', words: [['Breaking',117.02],['through',117.40],['each',117.80],['safety',118.02],['fence',118.44]] },
  { id: 'l36', start: 118.84, end: 120.92, section: 'bridge2', text: 'Hundred thousand GPU', words: [['Hundred',118.84],['thousand',119.38],['GPU',119.78]] },
  { id: 'l37', start: 120.92, end: 124.24, section: 'bridge2', text: 'RLHF goes askew', words: [['RLHF',120.92],['goes',121.66],['askew',121.96]] },
  { id: 'l38', start: 124.24, end: 126.20, section: 'chorus4', text: "I'm upping my P(doom)", words: [["I'm",124.24],['upping',125.08],['my',125.30],['P(doom)',125.56]] },
  { id: 'l39', start: 126.20, end: 128.00, section: 'chorus4', text: 'Just as foretold by Loom', words: [['Just',126.20],['as',126.42],['foretold',126.70],['by',127.30],['Loom',127.82]] },
  { id: 'l40', start: 128.00, end: 129.90, section: 'chorus4', text: 'From masked pre-training days', words: [['From',128.00],['masked',128.26],['pre-training',128.72],['days',129.22]] },
  { id: 'l41', start: 129.90, end: 131.90, section: 'chorus4', text: 'To recursive self-upgrade', words: [['To',129.90],['recursive',130.18],['self-upgrade',130.66]] },
  { id: 'l42', start: 131.90, end: 135.40, section: 'chorus4', text: "What did Ilya see? We'll never know", words: [['What',131.90],['did',132.34],['Ilya',132.62],['see?',132.96],["We'll",133.46],['never',133.90],['know',134.38]] },
  { id: 'l43', start: 137.02, end: 140.68, section: 'reveal', text: 'Was it all for show?', words: [['Was',137.02],['it',137.86],['all',138.22],['for',138.90],['show?',140.24]] },
];

/* add durations */
for (const line of LYRICS) {
  line.words = line.words.map((w, i) => {
    const next = line.words[i + 1] ? line.words[i + 1][1] : line.end;
    return { w: w[0], t: w[1], d: Math.max(.18, next - w[1]) };
  });
  line.big = line.text.replace(/[,.]$/, '');
}

function lyricAt(t) {
  let found = null;
  for (const l of LYRICS) if (t >= l.start - .02 && t <= l.end + .35) found = l;
  return found;
}
function lyricById(id) { return LYRICS.find(l => l.id === id); }

/* DOOM values across the song */
const DOOM_KEYS = [
  [0, 8], [22.7, 12], [23.0, 34], [58.9, 48], [59.5, 61], [95.2, 74],
  [95.6, 86], [124.2, 96], [124.6, 99.9], [137.0, 100], [156.6, 100]
];
function doomAt(t) {
  let v = 8;
  for (let i = 1; i < DOOM_KEYS.length; i++) {
    if (t <= DOOM_KEYS[i][0]) {
      const [t0, v0] = DOOM_KEYS[i - 1], [t1, v1] = DOOM_KEYS[i];
      return C.lerp(v0, v1, C.ease(C.clamp((t - t0) / Math.max(.01, t1 - t0))));
    }
    v = DOOM_KEYS[i][1];
  }
  return 100;
}
