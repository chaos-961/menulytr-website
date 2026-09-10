// Minimal static file server (no dependencies). Usage: node serve.js [dir] [port]
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(process.argv[2] || __dirname);
const port = Number(process.argv[3] || process.env.PORT || 8090);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath.endsWith('/')) urlPath += 'index.html';
  const file = path.normalize(path.join(root, urlPath));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    fs.createReadStream(file).pipe(res);
  });
}).listen(port, () => console.log(`Serving ${root} at http://localhost:${port}`));
