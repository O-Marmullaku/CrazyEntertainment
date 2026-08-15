const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const gifs = [...html.matchAll(/<article\b[^>]*class="card reveal"[^>]*data-demo-gif="([^"]+)"/g)]
  .map((match) => match[1]);

assert.equal(gifs.length, 18, 'every card declares a demo GIF');
assert.equal(new Set(gifs).size, 18, 'every card has its own demo GIF');

for (const relative of gifs) {
  assert.equal(path.isAbsolute(relative), false, `${relative} must stay relative`);
  const bytes = fs.readFileSync(path.join(root, relative));
  assert.match(bytes.subarray(0, 6).toString('ascii'), /^GIF8[79]a$/, `${relative} is a GIF`);
  assert.equal(bytes.readUInt16LE(6), 640, `${relative} is 640px wide`);
  assert.equal(bytes.readUInt16LE(8), 360, `${relative} is 360px tall`);
  assert.ok(bytes.length <= 3 * 1024 * 1024, `${relative} exceeds 3 MiB`);
}

console.log('18 project demo GIFs verified');
