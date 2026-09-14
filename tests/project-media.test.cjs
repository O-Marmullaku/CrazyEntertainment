'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, readCards, verify, synchronize, webpDimensions } = require('../tools/project-media.cjs');
const { WEBP, GIF } = require('./fixtures.cjs');
const html = `<article class="card" data-demo-gif="assets/projects/fixture/demo.gif"><h3>Fixture</h3><template class="project-media" data-images="missing" data-demo="missing"><div>${['background', 'icon', 'ui'].map((part) => `<img src="assets/projects/fixture/${part}.webp" width="1" height="1" alt="" />`).join('')}</div></template></article>`;

function fixture(callback) {
  const parent = path.join(ROOT, '.local');
  fs.mkdirSync(parent, { recursive: true });
  const directory = fs.mkdtempSync(path.join(parent, 'media-test-'));
  const assets = path.join(directory, 'assets/projects/fixture');
  fs.mkdirSync(assets, { recursive: true });
  try { callback(directory, assets); }
  finally { fs.rmSync(directory, { recursive: true, force: true }); if (!fs.readdirSync(parent).length) fs.rmdirSync(parent); }
}

test('missing originals are explicit; require-all fails and sync is idempotent', () => {
  fixture((root) => {
    assert.equal(verify(html, root)[0].imageState, 'missing');
    assert.throws(() => verify(html, root, true), /missing/);
    assert.equal(synchronize(html, root), html);
  });
});

test('partial layers remain inert; complete layers and demos enable independently', () => {
  fixture((root, assets) => {
    fs.writeFileSync(path.join(assets, 'icon.webp'), WEBP);
    assert.equal(synchronize(html, root), html);
    fs.writeFileSync(path.join(assets, 'demo.gif'), GIF);
    let updated = synchronize(html, root);
    assert.equal(readCards(updated)[0].state['data-images'], 'missing');
    assert.equal(readCards(updated)[0].state['data-demo'], 'ready');
    fs.writeFileSync(path.join(assets, 'background.webp'), WEBP);
    fs.writeFileSync(path.join(assets, 'ui.webp'), WEBP);
    updated = synchronize(updated, root);
    assert.equal(verify(updated, root, true)[0].imageState, 'ready');
    assert.equal(synchronize(updated, root), updated);
    fs.unlinkSync(path.join(assets, 'ui.webp'));
    assert.throws(() => verify(updated, root), /--sync/);
    assert.equal(verify(synchronize(updated, root), root)[0].imageState, 'missing');
  });
});

test('corrupt, mismatched and escaping media are rejected rather than silently enabled', () => {
  assert.deepEqual(webpDimensions(WEBP), [1, 1]);
  assert.throws(() => webpDimensions(Buffer.from('not a WebP')), /Invalid/);
  assert.throws(() => webpDimensions(WEBP.subarray(0, 20)), /Truncated/);
  fixture((root, assets) => {
    fs.writeFileSync(path.join(assets, 'icon.webp'), WEBP);
    assert.throws(() => synchronize(html.replace(/width="1"/g, 'width="2"'), root), /dimensions/);
    assert.throws(() => synchronize(html.replace('assets/projects/fixture/icon.webp', '../private.webp'), root), /relative/);
    fs.writeFileSync(path.join(assets, 'demo.gif'), Buffer.from('invalid'));
    assert.throws(() => synchronize(html, root), /GIF/);
  });
});
