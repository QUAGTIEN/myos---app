import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../out');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.json': 'application/json', '.txt': 'text/plain' };
http.createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400); response.end('Bad request'); return; }
  const file = path.resolve(root, '.' + pathname);
  if (!file.startsWith(root + path.sep) && file !== root) { response.writeHead(403); response.end('Forbidden'); return; }
  let selected = file;
  try { if (fs.statSync(file).isDirectory()) selected = path.join(file, 'index.html'); }
  catch { selected = path.extname(file) ? file : path.join(file, 'index.html'); }
  fs.stat(selected, (error, stat) => {
    if (error || !stat.isFile()) { response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }); fs.createReadStream(path.join(root, '404.html')).pipe(response); return; }
    response.writeHead(200, { 'Content-Type': mime[path.extname(selected)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' });
    fs.createReadStream(selected).pipe(response);
  });
}).listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173'));
