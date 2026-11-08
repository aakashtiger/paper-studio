const fs=require('fs');
const raw=fs.readFileSync('assets/song.wav');let p=12,data;while(p<raw.length){const id=raw.toString('ascii',p,p+4),s=raw.readUInt32LE(p+4);if(id==='data'){data=raw.subarray(p+8,p+8+s);break;}p+=8+s+(s&1);}
const sr=44100,n=data.length/4;const x=new Float32Array(n);for(let i=0;i<n;i++)x[i]=(data.readInt16LE(i*4)+data.readInt16LE(i*4+2))/65536;
// simple one-pole lowpass at 120Hz
const a=1-Math.exp(-2*Math.PI*120/sr);const lp=new Float32Array(n);let y=0;for(let i=0;i<n;i++){y+=a*(x[i]-y);lp[i]=y;}
const fps=200,step=sr/fps,frames=Math.floor(n/step);const e=new Float32Array(frames);
for(let f=0;f<frames;f++){let s=0;for(let i=0;i<step;i++){const v=lp[Math.round(f*step+i)]||0;s+=v*v;}e[f]=Math.sqrt(s/step);}
// onset
const on=new Float32Array(frames);for(let f=1;f<frames;f++)on[f]=Math.max(0,e[f]-e[f-1]);
// peaks with min separation 0.15s
const peaks=[];for(let f=2;f<frames-2;f++){if(on[f]>on[f-1]&&on[f]>=on[f+1]&&on[f]>0.001){if(!peaks.length||f-peaks[peaks.length-1]>0.12*200)peaks.push(f);}}
console.log('kick peaks',peaks.length);
console.log(peaks.slice(0,80).map(f=>(f/fps).toFixed(3)).join(' '));
const diffs=[];for(let i=1;i<peaks.length;i++){const d=(peaks[i]-peaks[i-1])/fps;if(d>0.3&&d<0.7)diffs.push(d);}
diffs.sort((a,b)=>a-b);console.log('median interval',diffs[Math.floor(diffs.length/2)],'bpm',60/diffs[Math.floor(diffs.length/2)]);
// histogram intervals
const h={};for(const d of diffs){const k=Math.round(d*100);h[k]=(h[k]||0)+1;}console.log(Object.entries(h).sort((a,b)=>b[1]-a[1]).slice(0,12));
// scan bpm + phase scoring kick energy
let best=[0,0,0];for(let bpm=130;bpm<=134;bpm+=0.02){const per=60/bpm;for(let ph=0;ph<per;ph+=0.002){let s=0;for(let k=0;k<Math.floor((n/sr-ph)/per);k++){const t=ph+k*per;const f=Math.round(t*fps);s+=on[f]||0;}if(s>best[2])best=[bpm,ph,s];}}
console.log('best grid bpm,phase,score',best);
// chorus section 22.7-58.9: strongest phase
let b2=[0,0,0];for(let bpm=130;bpm<=134;bpm+=0.02){const per=60/bpm;for(let ph=0;ph<per;ph+=0.002){let s=0,c=0;for(let k=0;k<Math.floor(36.2/per);k++){const t=22.72+ph+k*per;const f=Math.round(t*fps);s+=on[f]||0;c++;}s/=c;if(s>b2[2])b2=[bpm,ph,s];}}
console.log('chorus1 relative grid',b2);
