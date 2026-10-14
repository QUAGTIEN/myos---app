import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../out');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.json': 'application/json', '.txt': 'text/plain' };
http.createServer((request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return;
  }
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
    const headers = {
      'Content-Type': mime[path.extname(selected)] ?? 'application/octet-stream',
      'Cache-Control': 'no-cache', 'Accept-Ranges': 'bytes', 'Content-Length': stat.size,
    };
    let start = 0;
    let end = stat.size - 1;
    // Browsers seek and loop MP4 footage with single byte-range requests.
    if (request.headers.range && request.method === 'GET') {
      const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
      if (range && (range[1] || range[2])) {
        start = range[1] ? Number(range[1]) : Math.max(0, stat.size - Number(range[2]));
        end = range[1] && range[2] ? Math.min(Number(range[2]), end) : end;
      }
      if (!range || (!range[1] && !range[2]) || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= stat.size) {
        response.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }); response.end(); return;
      }
      headers['Content-Range'] = `bytes ${start}-${end}/${stat.size}`;
      headers['Content-Length'] = end - start + 1;
    }
    response.writeHead(headers['Content-Range'] ? 206 : 200, headers);
    if (request.method === 'HEAD' || !stat.size) { response.end(); return; }
    fs.createReadStream(selected, { start, end }).on('error', () => response.destroy()).pipe(response);
  });
}).listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173'));
