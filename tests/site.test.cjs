'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { ROOT, attributes, readCards, verify } = require('../tools/project-media.cjs');
const { startServer } = require('../tools/serve.cjs');
const pages = ['index.html', 'privacy.html', 'impressum.html'];
const read = (name) => fs.readFileSync(path.join(ROOT, name), 'utf8');
const source = Object.fromEntries(pages.map((name) => [name, read(name)]));
const active = (html) => html.replace(/<template\b[\s\S]*?<\/template>/g, '');
const ids = (html) => [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);

function references(html) {
  return [...active(html).matchAll(/\b(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
}
function localReference(value, origin) {
  if (/^(?:https?:|mailto:|data:)/.test(value)) return null;
  assert.ok(!value.startsWith('/') && !value.includes('\\'), `${origin}: public reference must remain relative: ${value}`);
  const [file, fragment] = value.split('#');
  const filename = file.split('?')[0] || origin;
  return { filename, fragment };
}

test('root deployment markers and externally important pages', () => {
  assert.equal(read('CNAME').trim(), 'crazyentertainment.ch');
  assert.equal(fs.statSync(path.join(ROOT, '.nojekyll')).size, 0);
  assert.match(source['privacy.html'], /Crazy Enhancer for YouTube/);
  assert.match(source['privacy.html'], /Google Fonts/);
  assert.match(source['impressum.html'], /Crazy Entertainment Marmullaku/);
  for (const html of Object.values(source)) {
    assert.match(html, /href="https:\/\/fonts\.googleapis\.com\/css2\?/);
    assert.ok(!/<(?:script|img)\b[^>]*src="https?:/.test(html), 'No new remote runtime script or image');
  }
  assert.ok(!fs.existsSync(path.join(ROOT, 'package.json')), 'Deployment remains dependency/build-free');
});

test('current project identities, order, count and one reusable dialog', () => {
  const cards = readCards(source['index.html']);
  assert.deepEqual(cards.map((c) => c.name), [
    'CoachLexy', 'Tableverse', 'Syb-L', 'VideoQualityBalancer', 'Crazy Enhancer for YouTube',
    'Dorfkönig', 'Apollo Dual-Screen', 'Axiom Calculator Platform', 'Token Measurer', 'Reviewer 3000',
    'DumpToTxt', 'MicBridge', 'ProTeaser Studio', 'Portica', 'Custom Video Platform',
    'Creator Workflow Extension', 'FuckingShareIT', 'Desktop Edge Arranger',
  ]);
  assert.match(source['index.html'], /Digital products<\/span><span class="v">18<\/span>/);
  assert.equal((source['index.html'].match(/<dialog\b/g) || []).length, 1);
  assert.equal(new Set(cards.map((c) => c.gif)).size, 18);
  assert.deepEqual(cards.filter((c) => c.live).map((c) => [c.name, c.live]), [['Tableverse', 'https://tableking.gg/']]);
  for (const card of cards) {
    assert.match(card.html, /<p class="tagline">[^<]+<\/p>/);
    assert.match(card.html, /<p>[^<]+<\/p>/);
    assert.ok((card.html.match(/class="chip"/g) || []).length >= 1);
  }
});

test('all active HTML and CSS references exist, with valid local fragments', () => {
  for (const [name, html] of Object.entries(source)) {
    assert.ok(!/\b(?:src|href)=""/.test(html), `${name}: empty URL`);
    for (const value of references(html)) {
      const ref = localReference(value, name);
      if (!ref) continue;
      assert.ok(fs.existsSync(path.join(ROOT, ref.filename)), `${name}: missing ${value}`);
      if (ref.fragment) assert.ok(ids(read(ref.filename)).includes(ref.fragment), `${name}: missing fragment ${value}`);
    }
  }
  for (const match of read('style.css').matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)]+))\s*\)/g)) {
    const url = match[1] || match[2] || match[3];
    if (url.startsWith('data:')) continue;
    assert.ok(fs.existsSync(path.join(ROOT, url)), `Missing CSS asset ${url}`);
  }
});

test('media states match actual files and preserve original layered geometry', () => {
  const cards = verify(source['index.html']);
  for (const [index, card] of cards.entries()) {
    assert.match(card.template, /--icon-x:[^;]+;--icon-y:[^;]+;--icon-w:[^;]+;--ui-x:[^;]+;--ui-y:[^;]+;--ui-w:/);
    assert.equal(card.images.length, 3);
    for (const image of card.images) {
      assert.equal(image.alt, '');
      assert.equal(image.decoding, 'async');
      assert.ok(Number(image.width) > 0 && Number(image.height) > 0);
      assert.equal(image.loading, index < 2 ? undefined : 'lazy');
    }
    const background = card.images.find((image) => image.src.endsWith('/background.webp'));
    assert.deepEqual([background.width, background.height], ['1200', '675']);
  }
});

test('HTML has balanced explicit elements, unique IDs and resolvable accessibility labels', () => {
  const voids = new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
  for (const [name, html] of Object.entries(source)) {
    assert.match(html, /^<!DOCTYPE html>/i);
    assert.match(html, /<html lang="en">/);
    assert.equal((html.match(/<main\b/g) || []).length, 1);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    const pageIds = ids(html);
    assert.equal(new Set(pageIds).size, pageIds.length, `${name}: duplicate ID`);
    const stack = [];
    for (const token of html.replace(/<!--[\s\S]*?-->/g, '').matchAll(/<(\/)?([a-z][\w-]*)\b([^>]*)>/gi)) {
      const [, closing, tag, rest] = token;
      if (closing) assert.equal(stack.pop(), tag, `${name}: unbalanced closing ${tag}`);
      else if (!voids.has(tag)) stack.push(tag);
      if (tag === 'img') assert.ok('alt' in attributes(rest), `${name}: image alt is missing`);
      for (const attr of ['aria-labelledby', 'aria-describedby', 'aria-controls']) {
        for (const id of (attributes(rest)[attr] || '').split(/\s+/).filter(Boolean)) assert.ok(pageIds.includes(id), `${name}: ${attr} target ${id}`);
      }
    }
    assert.deepEqual(stack, [], `${name}: unclosed elements`);
  }
});

test('JavaScript syntax and obvious CSS block structure', () => {
  for (const file of ['main.js', 'tools/serve.cjs', 'tools/project-media.cjs', 'tests/project-dialog.spec.cjs']) {
    new vm.Script(read(file), { filename: file });
  }
  const css = read('style.css').replace(/\/\*[\s\S]*?\*\//g, '').replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '');
  let depth = 0;
  for (const char of css) { if (char === '{') depth++; if (char === '}') depth--; assert.ok(depth >= 0, 'CSS brace underflow'); }
  assert.equal(depth, 0, 'Unclosed CSS block');
});

test('documentation links point to maintained local artifacts', () => {
  const files = ['README.md', 'AGENTS.md', ...fs.readdirSync(path.join(ROOT, 'docs')).filter((f) => f.endsWith('.md')).map((f) => `docs/${f}`)];
  for (const file of files) {
    for (const match of read(file).matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      if (/^(https?:|mailto:)/.test(match[1])) continue;
      assert.ok(fs.existsSync(path.resolve(ROOT, path.dirname(file), match[1].split('#')[0])), `${file}: dead documentation link ${match[1]}`);
    }
  }
});

test('HTTP pages/assets and relative references work at root and repository subpath', { timeout: 15000 }, async () => {
  let checked = 0;
  for (const mount of ['/', '/CrazyEntertainment/']) {
    const server = await startServer({ port: 0, mount });
    try {
      const files = new Set(['', ...pages, 'style.css', 'main.js', 'logo.png', 'favicon.png', 'CNAME', '.nojekyll']);
      for (const [name, html] of Object.entries(source)) {
        for (const value of references(html)) { const ref = localReference(value, name); if (ref) files.add(ref.filename); }
      }
      for (const card of verify(source['index.html'])) {
        if (card.imageState === 'ready') card.images.forEach((image) => files.add(image.src));
        if (card.demoState === 'ready') files.add(card.gif);
      }
      for (const file of files) {
        const response = await fetch(new URL(file, server.url), { signal: AbortSignal.timeout(2500) });
        assert.equal(response.status, 200, `${mount}${file}`);
        const bytes = Buffer.from(await response.arrayBuffer());
        assert.deepEqual(bytes, fs.readFileSync(path.join(ROOT, file || 'index.html')));
        checked++;
      }
      for (const page of pages) {
        for (const ref of references(source[page]).map((value) => localReference(value, page)).filter(Boolean)) {
          const response = await fetch(new URL(ref.filename, new URL(page, server.url)), { signal: AbortSignal.timeout(2500) });
          assert.equal(response.status, 200); await response.arrayBuffer(); checked++;
        }
      }
      for (const privatePath of ['AGENTS.md', 'docs/deployment.md', '.git/config', 'not-found.html']) {
        assert.equal((await fetch(new URL(privatePath, server.url), { signal: AbortSignal.timeout(2500) })).status, 404);
      }
    } finally { await server.close(); }
  }
  console.log(`${checked} local HTTP/reference checks passed across both mounts`);
});
