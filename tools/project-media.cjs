'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ROOT = path.resolve(__dirname, '..');

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w-]+)\s*=\s*"([^"]*)"/g)].map((m) => [m[1], m[2]]));
}

function readCards(html) {
  return [...html.matchAll(/<article\b([^>]*)>([\s\S]*?)<\/article>/g)]
    .filter((m) => /\bcard\b/.test(attributes(m[1]).class || ''))
    .map((m) => {
      const attr = attributes(m[1]);
      const template = m[2].match(/<template\b([^>]*)>([\s\S]*?)<\/template>/);
      assert.ok(template, 'Each card needs its inert media template');
      const images = [...template[2].matchAll(/<img\b([^>]*)>/g)].map((image) => attributes(image[1]));
      return { html: m[0], name: m[2].match(/<h3>([^<]+)<\/h3>/)[1], gif: attr['data-demo-gif'], live: attr['data-demo-url'], template: template[0], state: attributes(template[1]), images };
    });
}

function localPath(root, relative) {
  assert.match(relative, /^assets\/projects\/[a-z0-9-]+\/(background|icon|ui)\.webp$|^assets\/projects\/[a-z0-9-]+\/demo\.gif$/, `Not an approved relative project-media path: ${relative}`);
  return path.join(root, relative);
}

// Header/structure checks only; provenance, visual quality and full decoding
// still need review in a browser after restoring authentic source media.
function webpDimensions(bytes) {
  assert.ok(bytes.length >= 20 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP', 'Invalid WebP header');
  assert.equal(bytes.readUInt32LE(4) + 8, bytes.length, 'Truncated WebP container');
  let dimensions;
  let hasBitstream = false;
  for (let offset = 12; offset < bytes.length;) {
    assert.ok(offset + 8 <= bytes.length, 'Truncated WebP chunk header');
    const kind = bytes.toString('ascii', offset, offset + 4);
    const size = bytes.readUInt32LE(offset + 4);
    const start = offset + 8;
    assert.ok(start + size <= bytes.length, 'Truncated WebP chunk');
    if (kind === 'VP8X') {
      assert.ok(size >= 10, 'Invalid VP8X dimensions');
      dimensions = [bytes.readUIntLE(start + 4, 3) + 1, bytes.readUIntLE(start + 7, 3) + 1];
    } else if (kind === 'VP8L') {
      assert.ok(size >= 5 && bytes[start] === 0x2f, 'Invalid VP8L bitstream');
      const bits = bytes.readUInt32LE(start + 1);
      dimensions ||= [(bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1];
      hasBitstream = true;
    } else if (kind === 'VP8 ') {
      assert.ok(size >= 10 && bytes.subarray(start + 3, start + 6).equals(Buffer.from([0x9d, 0x01, 0x2a])), 'Invalid VP8 bitstream');
      dimensions ||= [bytes.readUInt16LE(start + 6) & 0x3fff, bytes.readUInt16LE(start + 8) & 0x3fff];
      hasBitstream = true;
    }
    offset = start + size + (size % 2);
    assert.ok(offset <= bytes.length, 'Missing WebP chunk padding');
  }
  assert.ok(dimensions && hasBitstream, 'Expected a static WebP image');
  return dimensions;
}

function inspectMedia(html, root = ROOT) {
  return readCards(html).map((card) => {
    assert.equal(card.images.length, 3, `${card.name}: three source layers`);
    const slug = card.gif?.split('/')[2];
    const names = new Set();
    const available = card.images.map((image) => {
      const filename = localPath(root, image.src);
      assert.equal(image.src.split('/')[2], slug, `${card.name}: mixed project media`);
      names.add(path.basename(filename));
      if (!fs.existsSync(filename)) return false;
      const dimensions = webpDimensions(fs.readFileSync(filename));
      assert.deepEqual(dimensions, [Number(image.width), Number(image.height)], `${image.src}: dimensions must match the retained source geometry`);
      return true;
    });
    assert.deepEqual([...names].sort(), ['background.webp', 'icon.webp', 'ui.webp']);
    const gifPath = localPath(root, card.gif);
    const gifAvailable = fs.existsSync(gifPath);
    if (gifAvailable) {
      const bytes = fs.readFileSync(gifPath);
      assert.ok(bytes.length >= 14, `${card.gif}: truncated GIF`);
      assert.match(bytes.toString('ascii', 0, 6), /^GIF8[79]a$/, `${card.gif}: GIF header`);
      assert.deepEqual([bytes.readUInt16LE(6), bytes.readUInt16LE(8)], [640, 360], `${card.gif}: expected 640×360`);
      assert.equal(bytes[bytes.length - 1], 0x3b, `${card.gif}: missing GIF trailer`);
      assert.ok(bytes.length <= 3 * 1024 * 1024, `${card.gif}: exceeds 3 MiB`);
    }
    return { ...card, imageState: available.every(Boolean) ? 'ready' : 'missing', demoState: gifAvailable ? 'ready' : 'missing' };
  });
}

function synchronize(html, root = ROOT) {
  const media = inspectMedia(html, root); // Validate everything before changing any source.
  for (const card of media) {
    const replacement = card.template.replace(/data-images="(?:ready|missing)"/, `data-images="${card.imageState}"`).replace(/data-demo="(?:ready|missing)"/, `data-demo="${card.demoState}"`);
    html = html.replace(card.template, replacement);
  }
  return html;
}

function verify(html, root = ROOT, requireAll = false) {
  const media = inspectMedia(html, root);
  for (const card of media) {
    assert.equal(card.state['data-images'], card.imageState, `${card.name}: run node tools/project-media.cjs --sync after changing media`);
    assert.equal(card.state['data-demo'], card.demoState, `${card.name}: run node tools/project-media.cjs --sync after changing media`);
    if (requireAll) {
      assert.equal(card.imageState, 'ready', `${card.name}: original thumbnail layers are missing`);
      assert.equal(card.demoState, 'ready', `${card.name}: original demo is missing`);
    }
  }
  return media;
}

if (require.main === module) {
  try {
    const args = process.argv.slice(2);
    assert.ok(args.every((arg) => ['--sync', '--require-all'].includes(arg)), 'Usage: node tools/project-media.cjs [--sync] [--require-all]');
    const filename = path.join(ROOT, 'index.html');
    let html = fs.readFileSync(filename, 'utf8');
    if (args.includes('--sync')) {
      const updated = synchronize(html);
      if (updated !== html) fs.writeFileSync(filename, updated);
      html = updated;
    }
    const media = verify(html, ROOT, args.includes('--require-all'));
    console.log(`${media.length} media declarations verified: ${media.filter((m) => m.imageState === 'ready').length} thumbnails and ${media.filter((m) => m.demoState === 'ready').length} GIFs available; remaining cards use explicit fallbacks.`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { ROOT, attributes, readCards, localPath, webpDimensions, inspectMedia, synchronize, verify };
