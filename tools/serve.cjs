'use strict';
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif' };
const PAGES = new Set(['index.html', 'privacy.html', 'impressum.html', 'style.css', 'main.js', 'logo.png', 'favicon.png', 'CNAME', '.nojekyll']);

async function startServer({ root = ROOT, port = 8080, mount = '/' } = {}) {
  if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(mount)) throw new Error('Mount must start and end with / and contain simple path segments');
  const server = http.createServer(async (request, response) => {
    try {
      if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405).end(); return; }
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (!pathname.startsWith(mount)) { response.writeHead(404).end(); return; }
      const relative = pathname.slice(mount.length) || 'index.html';
      if (!PAGES.has(relative) && !/^assets\/projects\/[a-z0-9-]+\/(background|icon|ui)\.webp$|^assets\/projects\/[a-z0-9-]+\/demo\.gif$/.test(relative)) {
        response.writeHead(404).end(); return;
      }
      const bytes = await fs.readFile(path.join(root, relative));
      response.writeHead(200, { 'Content-Type': MIME[path.extname(relative)] || 'text/plain; charset=utf-8', 'Content-Length': bytes.length, 'Cache-Control': 'no-store' });
      response.end(request.method === 'HEAD' ? undefined : bytes);
    } catch (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 400).end();
    }
  });
  server.requestTimeout = 10000;
  server.headersTimeout = 10000;
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
  return { server, url: `http://127.0.0.1:${server.address().port}${mount}`, close: () => new Promise((resolve, reject) => { server.close((error) => error ? reject(error) : resolve()); server.closeAllConnections(); }) };
}
if (require.main === module) {
  const port = Number(process.env.PORT || 8080);
  if (!Number.isInteger(port) || port < 0 || port > 65535) { console.error('PORT must be 0–65535'); process.exitCode = 1; }
  else startServer({ port }).then(({ url }) => console.log(`Local preview: ${url}`)).catch((error) => { console.error(error.message); process.exitCode = 1; });
}
module.exports = { startServer };
