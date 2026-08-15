const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const baseUrl = process.env.CE_BASE_URL || 'http://127.0.0.1:8083/';
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

(async () => {
  const browser = await chromium.launch({ executablePath: chrome, headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    page.setDefaultTimeout(3000);
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });

    const cards = page.locator('.card');
    assert.equal(await cards.count(), 18, 'all project cards remain available');
    assert.equal(await page.locator('#project-dialog').count(), 1, 'one reusable dialog exists');
    assert.equal(
      await page.locator('#project-dialog iframe, #project-dialog .project-dialog-demo').count(),
      0,
      'demo media is lazy',
    );

    await cards.first().click();
    assert.equal(await page.locator('#project-dialog').getAttribute('open'), '', 'click opens the dialog');
    assert.equal(await page.locator('#project-dialog-title').textContent(), 'CoachLexy');
    assert.match(
      await page.locator('#project-dialog-description').textContent(),
      /log meals, workouts and progress/,
    );
    assert.match(
      await page.locator('.project-dialog-demo').getAttribute('src'),
      /coachlexy\/demo\.gif$/,
    );

    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('#project-dialog').open);
    assert.equal(await cards.first().evaluate((card) => document.activeElement === card), true);

    await cards.nth(1).focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#project-dialog-title').textContent(), 'Tableverse');
    await page.locator('.project-dialog-close').click();
    await page.waitForFunction(() => !document.querySelector('#project-dialog').open);

    await cards.nth(2).focus();
    await page.keyboard.press('Space');
    assert.equal(await page.locator('#project-dialog-title').textContent(), 'Syb-L');

    await context.close();
    console.log('18 cards and reusable project dialog verified');
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
