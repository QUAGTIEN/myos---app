// Local review server; only serves the standalone design artifact directory.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
http.createServer((request, response) => {
 let pathname;
 try { pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname); }
 catch { response.writeHead(400).end(); return; }
 const target=path.resolve(__dirname,'.'+(pathname==='/'?'/calendar-preview.html':pathname));
 if(!target.startsWith(__dirname+path.sep)){response.writeHead(403).end();return;}
 fs.readFile(target,(error,data)=>{
  if(error){response.writeHead(404).end();return;}
  const type={'.html':'text/html; charset=utf-8','.png':'image/png','.json':'application/json','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8'}[path.extname(target)]||'text/plain; charset=utf-8';
  response.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store'}).end(data);
 });
}).listen(3111,'127.0.0.1',()=>console.log('Design preview: http://127.0.0.1:3111/ — independent of MyOS'));
