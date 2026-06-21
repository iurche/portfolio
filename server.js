const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Load .env
try {
  const env = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  for (const line of env.split('\n')) {
    const [k, ...v] = line.split('=');
    if (k && v.length) process.env[k.trim()] = v.join('=').trim();
  }
} catch {}

const chatHandler = require('./api/chat.js');

const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif':  'image/gif',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
};

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url);
  const pathname = parsed.pathname;

  // API route
  if (pathname === '/api/chat') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try { req.body = JSON.parse(body); } catch { req.body = {}; }
      chatHandler(req, res);
    });
    return;
  }

  // Static files
  let filePath = path.join(__dirname, pathname === '/' ? '/index.html' : pathname);
  if (!path.extname(filePath)) filePath += '.html';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Portfolio running at http://localhost:${PORT}`);
});
