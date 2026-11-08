import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
const ROOT = process.cwd(), PORT = 8123;
const MIME = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.ttf':'font/ttf','.png':'image/png','.jpg':'image/jpeg','.mp4':'video/mp4','.mp3':'audio/mpeg','.json':'application/json','.wav':'audio/wav' };
createServer((req,res)=>{
  let p = decodeURIComponent(req.url.split('?')[0]); if (p==='/') p='/studio.html';
  const f = join(ROOT,p);
  if(!f.startsWith(ROOT)||!existsSync(f)||statSync(f).isDirectory()){res.statusCode=404;res.end('404');return;}
  res.setHeader('Content-Type',MIME[extname(f)]||'application/octet-stream');
  res.setHeader('Cache-Control','no-store'); res.end(readFileSync(f));
}).listen(PORT,'127.0.0.1',()=>console.log(`CLAUDE POP studio → http://127.0.0.1:${PORT}/studio.html`));
