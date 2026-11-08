const fs=require('fs');const tr=JSON.parse(fs.readFileSync('assets/transcript.json','utf8'));
const onsets=tr.words.map(w=>w.start).filter(t=>t>1);
function score(bpm,phase,div=4){const per=60/bpm/div;let s=0;for(const t of onsets){const k=(t-phase)/per;const d=Math.abs(k-Math.round(k))*per;s+=Math.min(d,0.08)**2;}return s/onsets.length;}
let best=[0,0,1e9];for(let bpm=70;bpm<=150;bpm+=0.01){for(let ph=1.4;ph<1.4+60/bpm;ph+=0.01){const s=score(bpm,ph,4);if(s<best[2])best=[bpm,ph,s];}}
console.log('best word-grid 16ths',best,'per',60/best[0]);
for(const d of [2,4,8]){let b=[0,0,1e9];for(let bpm=70;bpm<=150;bpm+=0.01){for(let ph=1.4;ph<1.4+60/bpm;ph+=0.01){const s=score(bpm,ph,d);if(s<b[2])b=[bpm,ph,s];}}console.log('div',d,b);}
// print residuals for 88, 132
for(const bpm of [86,87,88,89,90,132]){const per=60/bpm;let bestp=[0,1e9];for(let ph=0;ph<per;ph+=0.005){let s=0;for(const t of onsets){const k=(t-ph)/per;const d=Math.abs(k-Math.round(k))*per;s+=Math.min(d,.1)**2;}s/=onsets.length;if(s<bestp[1])bestp=[ph,s];}console.log('bpm',bpm,'phase',bestp[0].toFixed(3),'rms',bestp[1].toFixed(5));}
