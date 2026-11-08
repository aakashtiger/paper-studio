const fs = require('fs');
const { execFileSync } = require('child_process');
const ff = require('ffmpeg-static');
execFileSync(ff, ['-y','-hide_banner','-loglevel','error','-i','ref/PDoomVideo/assets/pdoom.mp3','-ar','44100','-ac','1','temp_ref.wav']);
function readWav(path){const b=fs.readFileSync(path);let p=12,d;while(p<b.length){const id=b.toString('ascii',p,p+4),s=b.readUInt32LE(p+4);if(id==='data'){d=b.subarray(p+8,p+8+s);break;}p+=8+s+(s&1);}const n=d.length/2;const a=new Float32Array(n);for(let i=0;i<n;i++)a[i]=d.readInt16LE(i*2)/32768;return a;}
const a=readWav('temp_ref.wav');
// our song is stereo; read and mix
const raw=fs.readFileSync('assets/song.wav');let p=12,data;while(p<raw.length){const id=raw.toString('ascii',p,p+4),s=raw.readUInt32LE(p+4);if(id==='data'){data=raw.subarray(p+8,p+8+s);break;}p+=8+s+(s&1);}
const n=data.length/4;const b=new Float32Array(n);for(let i=0;i<n;i++)b[i]=(data.readInt16LE(i*4)+data.readInt16LE(i*4+2))/65536;
const N=Math.min(a.length,b.length);
function corr(lag){let s=0,sa=0,sb=0,c=0;for(let i=Math.max(0,lag);i<Math.min(N,N+lag);i++){const x=a[i],y=b[i-lag];s+=x*y;sa+=x*x;sb+=y*y;c++;}return s/Math.sqrt(sa*sb);}
let best=[0,0];for(let lag=-4410;lag<=4410;lag+=10){const c=corr(lag);if(c>best[1])best=[lag,c];}
console.log('best lag (samples @44.1k):',best, 'sec', best[0]/44100);
console.log('corr at 0:',corr(0));
// line starts from repo: 1.5 etc. Print RMS around 0-3s
for(let t=0;t<4;t+=0.25){let s=0,c=0;for(let i=Math.floor(t*44100);i<Math.floor((t+0.25)*44100);i++){s+=b[i]*b[i];c++;}console.log(t.toFixed(2), (20*Math.log10(Math.sqrt(s/c)+1e-9)).toFixed(1));}
