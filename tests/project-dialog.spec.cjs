const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const baseUrl = process.env.CE_BASE_URL || 'http://127.0.0.1:8083/';
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const screenshotDir = process.env.CE_SCREENSHOT_DIR
  || 'C:/Users/osi_c/AppData/Local/Temp/crazy-entertainment-project-dialog/screenshots';
fs.mkdirSync(screenshotDir, { recursive: true });

async function assertEveryProjectCopyFits(page, viewportLabel) {
  const cards = page.locator('.card');
  for (let index = 0; index < await cards.count(); index += 1) {
    await cards.nth(index).click();
    const title = await page.locator('#project-dialog-title').textContent();
    const fit = await page.locator('.project-dialog-copy').evaluate((copy) => ({
      overflowY: getComputedStyle(copy).overflowY,
      clientHeight: copy.clientHeight,
      scrollHeight: copy.scrollHeight,
    }));
    assert.equal(fit.overflowY, 'hidden', `${title} copy does not scroll at ${viewportLabel}`);
    assert.ok(
      fit.scrollHeight <= fit.clientHeight + 1,
      `${title} copy fits at ${viewportLabel}: ${fit.scrollHeight}px within ${fit.clientHeight}px`,
    );
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('#project-dialog').open);
  }
}

(async () => {
  const browser = await chromium.launch({ executablePath: chrome, headless: true });
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    page.setDefaultTimeout(3000);
    await page.route('**/coachlexy/demo.gif', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 700));
      await route.continue();
    });
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });

    const cards = page.locator('.card');
    assert.equal(await cards.count(), 18, 'all project cards remain available');
    assert.equal(
      await page.locator('.card[role="button"][tabindex="0"]').count(),
      18,
      'all cards expose keyboard button behavior',
    );
    assert.equal(await page.locator('#project-dialog').count(), 1, 'one reusable dialog exists');
    assert.equal(
      await page.locator('#project-dialog iframe, #project-dialog .project-dialog-demo').count(),
      0,
      'demo media is lazy',
    );
    const icon = cards.first().locator('.thumbnail-layer--icon');
    const ui = cards.first().locator('.thumbnail-layer--ui');
    const [iconBefore, uiBefore] = await Promise.all([icon.boundingBox(), ui.boundingBox()]);
    await icon.hover();
    await page.waitForTimeout(350);
    const [iconHovered, uiAlongsideIcon] = await Promise.all([icon.boundingBox(), ui.boundingBox()]);
    assert.ok(iconHovered.width > iconBefore.width * 1.14, 'icon hover is visibly bolder');
    assert.ok(uiAlongsideIcon.width < uiBefore.width * 1.03, 'icon hover leaves the UI at rest');
    await ui.hover();
    await page.waitForTimeout(350);
    const [iconAlongsideUi, uiHovered] = await Promise.all([icon.boundingBox(), ui.boundingBox()]);
    assert.ok(uiHovered.width > uiBefore.width * 1.06, 'UI hover is visibly bolder');
    assert.ok(iconAlongsideUi.width < iconBefore.width * 1.03, 'UI hover leaves the icon at rest');

    await cards.first().click();
    assert.equal(await page.locator('#project-dialog').getAttribute('open'), '', 'click opens the dialog');
    assert.equal(await page.locator('#project-dialog-title').textContent(), 'CoachLexy');
    assert.match(
      await page.locator('#project-dialog-description').textContent(),
      /log meals, workouts and progress/,
    );
    assert.match(await page.locator('.project-dialog-poster').getAttribute('src'), /coachlexy\/ui\.webp$/);
    await page.locator('.project-dialog-demo').waitFor({ state: 'attached' });
    await page.locator('.project-dialog-demo').evaluate((image) => {
      if (image.complete && image.naturalWidth) return;
      return new Promise((resolve, reject) => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', reject, { once: true });
      });
    });
    assert.match(await page.locator('.project-dialog-demo').getAttribute('src'), /coachlexy\/demo\.gif$/);
    assert.equal(await page.locator('.project-dialog-chips .chip').count(), 4);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    const stageGeometry = await page.locator('.project-dialog-shell').evaluate((shell) => {
      const stage = shell.querySelector('.project-dialog-stage');
      const shellBox = shell.getBoundingClientRect();
      const stageBox = stage.getBoundingClientRect();
      return {
        top: Math.abs(stageBox.top - shellBox.top),
        right: Math.abs(stageBox.right - shellBox.right),
        bottom: Math.abs(stageBox.bottom - shellBox.bottom),
        backgroundImage: getComputedStyle(stage).backgroundImage,
      };
    });
    assert.ok(
      stageGeometry.top <= 1 && stageGeometry.right <= 1 && stageGeometry.bottom <= 1,
      `demo stage is full bleed: ${JSON.stringify(stageGeometry)}`,
    );
    assert.equal(stageGeometry.backgroundImage, 'none', 'dialog stage has no thumbnail background');
    await page.screenshot({ path: path.join(screenshotDir, 'project-dialog-desktop-1440x900.png') });

    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('#project-dialog').open);
    assert.equal(await cards.first().evaluate((card) => document.activeElement === card), true);
    assert.equal(
      await page.locator('#project-dialog iframe, #project-dialog .project-dialog-demo').count(),
      0,
      'closing removes demo media',
    );

    await cards.nth(1).focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#project-dialog-title').textContent(), 'Tableverse');
    const frame = page.locator('.project-dialog-frame');
    assert.equal(await frame.getAttribute('src'), 'https://tableking.gg/');
    assert.equal(await frame.getAttribute('title'), 'Tableverse live demo');
    assert.equal(await page.locator('.project-dialog-live-link').isVisible(), true);
    assert.equal(await page.locator('.project-dialog-live-link').getAttribute('href'), 'https://tableking.gg/');
    await page.locator('.project-dialog-close').click();
    await page.waitForFunction(() => !document.querySelector('#project-dialog').open);
    assert.equal(await cards.nth(1).evaluate((card) => document.activeElement === card), true);

    await cards.nth(2).focus();
    await page.keyboard.press('Space');
    assert.equal(await page.locator('#project-dialog-title').textContent(), 'Syb-L');
    const dialogBounds = await page.locator('#project-dialog').boundingBox();
    await page.mouse.click(Math.max(1, dialogBounds.x - 8), dialogBounds.y + 8);
    await page.waitForFunction(() => !document.querySelector('#project-dialog').open);
    assert.equal(await cards.nth(2).evaluate((card) => document.activeElement === card), true);
    await assertEveryProjectCopyFits(page, '1440x900');

    const compactContext = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      reducedMotion: 'reduce',
    });
    const compact = await compactContext.newPage();
    compact.setDefaultTimeout(5000);
    await compact.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await assertEveryProjectCopyFits(compact, '1280x720');
    await compactContext.close();

    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: 'reduce',
    });
    const mobile = await mobileContext.newPage();
    mobile.setDefaultTimeout(5000);
    await mobile.route('https://tableking.gg/**', async (route) => {
      if (route.request().resourceType() === 'document') {
        await new Promise((resolve) => setTimeout(resolve, 700));
      }
      await route.continue();
    });
    await mobile.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await mobile.locator('.card').nth(1).click();
    assert.match(
      await mobile.locator('.project-dialog-poster').getAttribute('src'),
      /tableverse\/ui\.webp$/,
      'the UI poster covers the live-demo cold load',
    );
    await mobile.locator('.project-dialog-poster').waitFor({ state: 'detached', timeout: 10000 });
    const mobileBounds = await mobile.locator('#project-dialog').boundingBox();
    assert.ok(mobileBounds.width <= 390, 'mobile dialog stays inside the viewport');
    assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.equal(
      await mobile.locator('.project-dialog-shell').evaluate((shell) => getComputedStyle(shell).gridTemplateAreas),
      '"stage" "copy"',
    );
    await mobile.screenshot({ path: path.join(screenshotDir, 'project-dialog-mobile-390x844.png') });
    await mobileContext.close();

    await context.close();
    console.log('18 cards and reusable project dialog verified');
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
