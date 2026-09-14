'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { startServer } = require('../tools/serve.cjs');
const { ROOT, attributes } = require('../tools/project-media.cjs');
const { GIF } = require('./fixtures.cjs');
let chromium;
try { ({ chromium } = require(process.env.CE_PLAYWRIGHT_MODULE || 'playwright')); }
catch { console.error('Browser checks need an external Playwright installation. Set CE_PLAYWRIGHT_MODULE to its module directory; see README.md.'); process.exit(1); }
const offline = process.env.CE_OFFLINE === '1';
const selected = process.env.CE_SUITE || 'all';
assert.ok(['all', 'layout', 'media', 'navigation'].includes(selected), 'CE_SUITE must be all, layout, media or navigation');
const viewports = [{ width: 1440, height: 900 }, { width: 1280, height: 720 }, { width: 390, height: 844 }];
const source = (name) => fs.readFileSync(path.join(ROOT, name), 'utf8');
const gif = `data:image/gif;base64,${GIF.toString('base64')}`;
const invalid = 'data:image/gif;base64,aW52YWxpZA==';
const svg = (width, height) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#263c45"/><text x="10%" y="50%" fill="white" font-size="24">Test fixture</text></svg>`)}`;
let browser;
let server;
let temporaryDirectory;
let baseUrl;
let phase = 'startup';
const deadline = setTimeout(() => { console.error(`Browser suite exceeded 150 seconds in ${phase}. Rerun with CE_SUITE to isolate the failure.`); process.exit(1); }, 150000);

function instrument(html, { fixture = false, broken = false } = {}) {
  if (fixture) {
    html = html.replace(/data-images="(?:missing|ready)"/g, 'data-images="ready"').replace(/data-demo="(?:missing|ready)"/g, 'data-demo="ready"');
    html = html.replace(/<img\b[^>]*src="assets\/projects\/[^>]*>/g, (tag) => {
      const attrs = attributes(tag);
      const data = broken && attrs.src.endsWith('/ui.webp') ? invalid : svg(attrs.width, attrs.height);
      return tag.replace(/src="[^"]+"/, `src="${data}"`);
    });
    html = html.replace(/data-demo-gif="[^"]+"/g, `data-demo-gif="${broken ? invalid : gif}"`);
  }
  if (offline) {
    html = html.replace(/<link\b[^>]*>/g, '').replace(/<script\b[\s\S]*?<\/script>/g, '');
    for (const name of ['logo.png', 'favicon.png']) html = html.replaceAll(`src="${name}"`, `src="data:image/png;base64,${fs.readFileSync(path.join(ROOT, name)).toString('base64')}"`);
  }
  return html;
}

async function load(viewport, { name = 'index.html', script = true, before, fixture = false, broken = false, reducedMotion = 'reduce' } = {}) {
  const context = await browser.newContext({ viewport, reducedMotion });
  const page = await context.newPage();
  page.setDefaultTimeout(3000);
  page.setDefaultNavigationTimeout(6000);
  const runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  await page.route('https://fonts.googleapis.com/**', (route) => route.fulfill({ contentType: 'text/css', body: '' }));
  await page.route('https://fonts.gstatic.com/**', (route) => route.fulfill({ body: '' }));
  await page.route('https://tableking.gg/**', (route) => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Demo test fixture</title><button>Fixture control</button>' }));
  let html = instrument(source(name), { fixture, broken });
  if (!script) html = html.replace(/<script\b[\s\S]*?<\/script>/g, '');
  if (offline) {
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 6000 });
    await page.addStyleTag({ content: source('style.css') });
    if (before) await page.evaluate(before);
    if (script && name === 'index.html') await page.addScriptTag({ content: source('main.js') });
  } else {
    if (before) await page.addInitScript(before);
    const url = new URL(name, baseUrl).href;
    await page.route(url, (route) => route.fulfill({ contentType: 'text/html', body: html }));
    await page.goto(url, { waitUntil: 'domcontentloaded' });
  }
  return { page, context, finish: async () => { assert.deepEqual(runtimeErrors, [], 'No JavaScript runtime exceptions'); await context.close(); } };
}
async function shot(page, name) {
  if (!process.env.CE_SCREENSHOT_DIR) return;
  fs.mkdirSync(process.env.CE_SCREENSHOT_DIR, { recursive: true });
  await page.screenshot({ path: path.join(process.env.CE_SCREENSHOT_DIR, `${name}.png`), timeout: 6000 });
}
async function opened(page) { await page.waitForFunction(() => document.querySelector('#project-dialog').open && document.querySelector('#project-dialog').classList.contains('is-visible')); }
async function close(page, card, method = 'Escape') {
  if (method === 'button') await page.locator('.project-dialog-close').click();
  else await page.keyboard.press(method);
  await page.waitForFunction(() => !document.querySelector('#project-dialog').open && document.querySelector('.project-dialog-stage').childElementCount === 0);
  assert.equal(await card.evaluate((node) => document.activeElement === node), true, 'Focus returns to the invoking card');
  assert.equal(await page.locator('.project-dialog-stage > *').count(), 0, 'Closing removes all media');
  assert.equal(await page.locator('body').evaluate((body) => body.classList.contains('project-open')), false);
}
async function noOverflow(page) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'No document horizontal overflow');
  assert.equal(await page.locator('#project-dialog').evaluate((dialog) => !dialog.open || dialog.scrollWidth <= dialog.clientWidth + 1), true, 'No dialog horizontal overflow');
}

async function layout() {
  for (const viewport of viewports) {
    phase = `layout ${viewport.width}×${viewport.height}`;
    const { page, finish } = await load(viewport);
    const cards = page.locator('.card');
    assert.equal(await cards.count(), 18);
    assert.equal(await page.locator('.card[role="button"][tabindex="0"][aria-haspopup="dialog"]').count(), 18);
    assert.equal(await page.locator('dialog').count(), 1);
    assert.equal(await page.locator('.project-dialog-stage > *').count(), 0, 'Media creation is lazy');
    await shot(page, `home-${viewport.width}x${viewport.height}`);
    for (let index = 0; index < 18; index++) {
      const card = cards.nth(index);
      await card.click(); await opened(page);
      const expected = await card.locator('h3').textContent();
      assert.equal(await page.locator('#project-dialog-title').textContent(), expected);
      assert.equal(await page.locator('#project-dialog-description').textContent(), await card.locator(':scope > p:not(.tagline)').textContent());
      assert.deepEqual(await page.locator('.project-dialog-chips .chip').allTextContents(), await card.locator('.chip').allTextContents());
      assert.equal(await page.locator('.project-dialog-close').evaluate((button) => button === document.activeElement), true);
      await noOverflow(page);
      if (viewport.width > 820) {
        const fit = await page.locator('.project-dialog-copy').evaluate((copy) => ({ client: copy.clientHeight, scroll: copy.scrollHeight }));
        assert.ok(fit.scroll <= fit.client + 1, `${expected} copy fits at ${phase}: ${JSON.stringify(fit)}`);
        const edges = await page.locator('.project-dialog-shell').evaluate((shell) => {
          const a = shell.getBoundingClientRect(), b = shell.querySelector('.project-dialog-stage').getBoundingClientRect();
          return [Math.abs(a.top - b.top), Math.abs(a.right - b.right), Math.abs(a.bottom - b.bottom)];
        });
        assert.ok(edges.every((gap) => gap <= 1), 'Full-bleed desktop stage');
      } else {
        assert.equal(await page.locator('.project-dialog-shell').evaluate((shell) => getComputedStyle(shell).gridTemplateAreas), '"stage" "copy"');
        const bounds = await page.locator('#project-dialog').boundingBox();
        assert.ok(bounds.width <= viewport.width && bounds.height <= viewport.height + 1);
      }
      if (index === 0) await shot(page, `dialog-${viewport.width}x${viewport.height}`);
      await close(page, card, index % 2 ? 'button' : 'Escape');
    }
    // Both keyboard activation keys and a genuine backdrop click.
    for (const [index, key] of [[0, 'Enter'], [2, 'Space']]) {
      const card = cards.nth(index); await card.focus(); await page.keyboard.press(key); await opened(page);
      for (let tab = 0; tab < 3; tab++) { await page.keyboard.press('Tab'); assert.equal(await page.locator('dialog').evaluate((dialog) => dialog.contains(document.activeElement) || document.activeElement === document.body), true, 'Native modal never tabs into background content (browser chrome may receive focus)'); }
      if (viewport.width > 820) {
        const box = await page.locator('dialog').boundingBox();
        await page.mouse.click(Math.max(1, box.x - 5), box.y + 10);
        await page.waitForFunction(() => !document.querySelector('dialog').open);
        assert.equal(await card.evaluate((node) => node === document.activeElement), true);
      } else await close(page, card);
    }
    await finish(); console.log(`PASS ${phase}: 18 cards, copy, media cleanup, keyboard, focus and responsive layout`);
  }
}

async function media() {
  phase = 'media decoding, fallback and restored layer geometry';
  for (const viewport of viewports) {
    const { page, finish } = await load(viewport, { fixture: true });
    for (let index = 0; index < 18; index++) {
      const card = page.locator('.card').nth(index); await card.click(); await opened(page);
      if (index === 1) {
        assert.equal(await page.locator('.project-dialog-frame').getAttribute('src'), 'https://tableking.gg/');
        assert.equal(await page.locator('.project-dialog-frame').getAttribute('title'), 'Tableverse live demo');
        assert.equal(await page.locator('.project-dialog-live-link').getAttribute('href'), 'https://tableking.gg/');
        await page.locator('.project-dialog-fallback').click();
        assert.equal(await page.locator('.project-dialog-close').evaluate((node) => node === document.activeElement), true, 'Manual fallback preserves focus');
      }
      await page.waitForFunction(() => { const image = document.querySelector('.project-dialog-demo'); return image?.complete && image.naturalWidth === 640; });
      if (viewport.width > 820) {
        const fit = await page.locator('.project-dialog-copy').evaluate((copy) => ({ client: copy.clientHeight, scroll: copy.scrollHeight }));
        assert.ok(fit.scroll <= fit.client + 1, `Restored icon/copy fits: card ${index + 1}, ${viewport.width}×${viewport.height}, ${JSON.stringify(fit)}`);
      }
      await noOverflow(page); await close(page, card);
    }
    if (viewport.width === 1440) {
      const card = page.locator('.card').first(); await card.scrollIntoViewIfNeeded();
      await page.mouse.move(1, 1); await page.waitForTimeout(300);
      const icon = card.locator('.thumbnail-layer--icon'), ui = card.locator('.thumbnail-layer--ui');
      const a = await icon.boundingBox(), b = await ui.boundingBox();
      await icon.hover(); await page.waitForTimeout(300);
      assert.ok((await icon.boundingBox()).width > a.width * 1.14, 'Independent icon hover remains strong');
      assert.ok((await ui.boundingBox()).width < b.width * 1.03, 'Icon hover leaves UI at rest');
      await ui.hover(); await page.waitForTimeout(300);
      assert.ok((await ui.boundingBox()).width > b.width * 1.06, 'Independent UI hover remains strong');
      assert.ok((await icon.boundingBox()).width < a.width * 1.03, 'UI hover leaves icon at rest');
    }
    await finish(); console.log(`PASS media: all 18 restored-fixture previews at ${viewport.width}×${viewport.height}`);
  }
  {
    const { page, finish } = await load(viewports[0], { fixture: true, broken: true });
    const card = page.locator('.card').first(); await card.click(); await opened(page);
    await page.locator('.project-dialog-unavailable').waitFor({ state: 'visible' });
    assert.equal(await page.locator('.project-dialog-stage img').count(), 0, 'Broken media never leaves a broken image element in the stage');
    await close(page, card); await finish(); console.log('PASS broken image/GIF fallback');
  }
  {
    phase = 'stalled live iframe focus regression (eight-second bounded fallback)';
    const { page, finish } = await load(viewports[0], { before: () => {
      // Keep the real iframe element but suppress load/error delivery to model a
      // stalled embed deterministically without depending on an external site.
      document.addEventListener('load', (event) => { if (event.target.classList?.contains('project-dialog-frame')) event.stopImmediatePropagation(); }, true);
      document.addEventListener('error', (event) => { if (event.target.classList?.contains('project-dialog-frame')) event.stopImmediatePropagation(); }, true);
    } });
    const card = page.locator('.card').nth(1); await card.click(); await opened(page);
    await page.locator('.project-dialog-frame').evaluate((frame) => frame.focus());
    assert.equal(await page.locator('.project-dialog-frame').evaluate((frame) => document.activeElement === frame), true);
    await page.locator('.project-dialog-unavailable').waitFor({ state: 'visible', timeout: 10000 });
    assert.equal(await page.locator('.project-dialog-close').evaluate((button) => document.activeElement === button), true, 'Automatic fallback restores focus before removing a focused iframe');
    assert.equal(await page.locator('.project-dialog-live-link').isVisible(), true, 'Full live-demo link survives fallback');
    await close(page, card); await finish(); console.log('PASS stalled-iframe timeout and focus regression');
  }
  {
    phase = 'late image events and poster fallback';
    const { page, finish } = await load(viewports[0], { fixture: true, before: () => {
      const native = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
      Object.defineProperty(HTMLImageElement.prototype, 'src', { ...native, set(value) {
        if (this.classList.contains('project-dialog-demo')) setTimeout(() => native.set.call(this, value), 250);
        else native.set.call(this, value);
      } });
    } });
    const first = page.locator('.card').first(); await first.click(); await opened(page);
    await page.locator('.project-dialog-poster').waitFor({ state: 'visible' });
    await close(page, first);
    const third = page.locator('.card').nth(2); await third.click(); await opened(page);
    await page.waitForTimeout(350);
    assert.equal(await page.locator('.project-dialog-demo').getAttribute('alt'), 'Syb-L interface demo', 'Late previous image cannot replace the current project');
    await close(page, third); await finish(); console.log('PASS immediate poster and stale-load isolation');
  }
}

async function navigation() {
  phase = 'mobile navigation and progressive enhancement';
  const { page, finish } = await load(viewports[2]);
  assert.equal(await page.locator('#navlinks').evaluate((links) => links.inert), true);
  await page.locator('#burger').click();
  assert.equal(await page.locator('#burger').getAttribute('aria-expanded'), 'true');
  await page.locator('#navlinks a').first().focus(); await page.keyboard.press('Escape');
  assert.equal(await page.locator('#burger').evaluate((button) => document.activeElement === button), true);
  assert.equal(await page.locator('#navlinks').evaluate((links) => links.inert), true);
  await page.setViewportSize(viewports[0]);
  assert.equal(await page.locator('#navlinks').evaluate((links) => links.inert), false);
  await finish();
  for (const name of ['privacy.html', 'impressum.html']) {
    for (const viewport of [viewports[0], viewports[2], { width: 320, height: 640 }]) {
      const { page, finish } = await load(viewport, { name });
      assert.equal(await page.locator('main h1').isVisible(), true);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${name}: no overflow at ${viewport.width}`);
      for (const link of await page.locator('.nav-links a, .back, .foot-links a').all()) {
        const box = await link.boundingBox(); assert.ok(box && box.x >= -1 && box.x + box.width <= viewport.width + 1, `${name}: navigation stays on screen`);
      }
      if (!offline) { await page.locator('.back').click(); await page.waitForURL('**/index.html'); }
      await finish();
    }
  }
  for (const options of [
    { script: false, reducedMotion: 'no-preference' },
    { before: () => { delete window.IntersectionObserver; HTMLDialogElement.prototype.showModal = undefined; }, reducedMotion: 'no-preference' },
  ]) {
    const { page, finish } = await load(viewports[2], options);
    assert.equal(await page.locator('h1').evaluate((node) => getComputedStyle(node).opacity), '1', 'Content visible without progressive enhancements');
    assert.equal(await page.locator('.card[role="button"]').count(), 0, 'Unsupported dialog is not exposed as a working control');
    if (options.script === false) assert.equal(await page.locator('#navlinks').isVisible(), true);
    await finish();
  }
  {
    const { page, finish } = await load({ width: 900, height: 420 });
    await page.locator('.card').first().click(); await opened(page);
    const content = await page.locator('.project-dialog-copy').evaluate((copy) => ({ overflow: getComputedStyle(copy).overflowY, scroll: copy.scrollHeight, client: copy.clientHeight }));
    assert.ok(content.scroll <= content.client + 1 || content.overflow === 'auto', 'Constrained layouts scroll instead of hiding copy');
    await noOverflow(page); await finish();
  }
  {
    const { page, finish } = await load(viewports[0], { reducedMotion: 'no-preference' });
    await page.waitForFunction(() => getComputedStyle(document.querySelector('h1')).opacity === '1');
    const card = page.locator('.card').first(); await card.click(); await opened(page);
    await close(page, card); await finish();
  }
  console.log('PASS navigation, both legal pages, 320px layout, unsupported features, normal motion and constrained-height access');
}

(async () => {
  try {
    const temporaryParent = path.join(ROOT, '.local');
    fs.mkdirSync(temporaryParent, { recursive: true });
    temporaryDirectory = fs.mkdtempSync(path.join(temporaryParent, 'browser-test-'));
    // Keep Playwright's ephemeral profiles in this project, not a user-wide directory.
    for (const key of ['TMPDIR', 'TMP', 'TEMP']) process.env[key] = temporaryDirectory;
    browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined, timeout: 12000 });
    server = process.env.CE_BASE_URL ? null : await startServer({ port: 0 });
    baseUrl = process.env.CE_BASE_URL || server.url;
    console.log(`Browser mode: ${offline ? 'offline source rendering; HTTP navigation NOT exercised' : 'local HTTP with external services stubbed'}; suite: ${selected}`);
    if (selected === 'all' || selected === 'layout') await layout();
    if (selected === 'all' || selected === 'media') await media();
    if (selected === 'all' || selected === 'navigation') await navigation();
  } finally {
    if (browser) await browser.close();
    if (server) await server.close();
    if (temporaryDirectory) {
      fs.rmSync(temporaryDirectory, { recursive: true, force: true });
      const parent = path.dirname(temporaryDirectory);
      if (!fs.readdirSync(parent).length) fs.rmdirSync(parent);
    }
    clearTimeout(deadline);
  }
})().catch((error) => { console.error(`FAIL in ${phase}:`, error); process.exitCode = 1; });
