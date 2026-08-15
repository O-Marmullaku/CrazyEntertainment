# Fluid Project Demo Overlay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the desktop copy pane's nested scrolling and make each project's real interface dominate a full-bleed demo column.

**Architecture:** Keep the existing reusable native dialog and data flow. CSS alone makes the desktop copy responsive to available height and turns the demo grid area into a full-bleed canvas; the existing GIF files are regenerated from each raw `ui.webp`, while Tableverse keeps its verified live iframe.

**Tech Stack:** Plain HTML, CSS, vanilla JavaScript, Node built-ins, Playwright from the bundled Codex runtime, and bundled Python/Pillow for one-time GIF encoding.

## Global Constraints

- No build step, framework or new runtime dependency.
- Keep all published asset links relative.
- Do not truncate project descriptions or add JavaScript copy-fitting logic.
- Keep every GIF 640 by 360, six seconds, looping and no larger than 3 MiB.
- Preserve dialog accessibility, media laziness/cleanup and independent card-layer hover.
- Verify reduced-motion layouts at 1440 by 900 and 390 by 844.

---

### Task 1: Make the desktop copy fit and the demo column full-bleed

**Files:**
- Modify: `tests/project-dialog.spec.cjs`
- Modify: `style.css`
- Modify: `main.js`

**Interfaces:**
- Consumes: existing `.project-dialog-shell`, `.project-dialog-copy`, `.project-dialog-stage`, `.project-dialog-icon` and card activation behavior.
- Produces: a non-scrollable desktop copy column, a full-height demo grid area and no decorative background on the dialog stage.

- [ ] **Step 1: Add failing desktop layout assertions**

Add a helper to `tests/project-dialog.spec.cjs` that opens every card and asserts the real rendered copy fits:

```js
async function assertEveryProjectCopyFits(page) {
  const cards = page.locator('.card');
  for (let index = 0; index < await cards.count(); index += 1) {
    await cards.nth(index).click();
    const fit = await page.locator('.project-dialog-copy').evaluate((copy) => ({
      overflowY: getComputedStyle(copy).overflowY,
      clientHeight: copy.clientHeight,
      scrollHeight: copy.scrollHeight,
    }));
    assert.equal(fit.overflowY, 'hidden');
    assert.ok(fit.scrollHeight <= fit.clientHeight + 1, `card ${index + 1} copy fits`);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('#project-dialog').open);
  }
}
```

After opening CoachLexy, assert that the stage reaches the shell's top, right and bottom edges and carries no decorative image:

```js
const geometry = await page.locator('.project-dialog-shell').evaluate((shell) => {
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
assert.ok(geometry.top <= 1 && geometry.right <= 1 && geometry.bottom <= 1);
assert.equal(geometry.backgroundImage, 'none');
```

Create a second reduced-motion context at 1280 by 720 and call `assertEveryProjectCopyFits` there as the compact desktop regression.

- [ ] **Step 2: Run the browser test and verify RED**

Run:

```powershell
$env:CE_BASE_URL = 'http://127.0.0.1:8083/'
$env:NODE_PATH = 'C:\Users\osi_c\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
node tests\project-dialog.spec.cjs
```

Expected: FAIL because `.project-dialog-copy` uses `overflow-y: auto` and `.project-dialog-stage` is inset by 32 pixels with a project background.

- [ ] **Step 3: Implement the minimum responsive CSS**

Replace the desktop copy/stage sizing with viewport-height-aware values:

```css
.project-dialog-copy {
  grid-area: copy; display: flex; flex-direction: column; justify-content: center;
  overflow: hidden; padding: clamp(20px,3.2vh,44px) clamp(24px,3vw,48px);
}
.project-dialog-icon { width: min(15vh,150px,38%); height: auto; margin-bottom: clamp(10px,1.8vh,22px); }
.project-dialog-meta .card-top { margin-bottom: clamp(10px,1.5vh,20px); }
.project-dialog-copy h2 { font-size: clamp(30px,4.9vh,56px); line-height: .98; }
.project-dialog-tagline { margin-top: clamp(8px,1.2vh,12px); font-size: clamp(15px,1.9vh,18px); line-height: 1.4; }
#project-dialog-description { margin-top: clamp(12px,2vh,20px); font-size: clamp(13px,1.65vh,16px); line-height: 1.55; }
.project-dialog-chips { margin-top: clamp(14px,2vh,24px); }
.project-dialog-stage {
  grid-area: stage; display: grid; align-self: stretch; aspect-ratio: auto; margin: 0;
  overflow: hidden; border: 0; border-radius: 0; background: #08080a; box-shadow: none;
}
```

Add a compact desktop height rule:

```css
@media (min-width: 821px) and (max-height: 760px) {
  .project-dialog-copy { padding: 18px 32px; }
  .project-dialog-icon { width: min(88px,28%); margin-bottom: 8px; }
  .project-dialog-meta .card-top { margin-bottom: 8px; }
  .project-dialog-copy h2 { font-size: clamp(26px,4vh,38px); }
  .project-dialog-tagline { margin-top: 6px; font-size: 14px; line-height: 1.3; }
  #project-dialog-description { margin-top: 10px; font-size: 12px; line-height: 1.38; }
  .project-dialog-chips { margin-top: 12px; }
}
```

In the existing mobile block, reset the copy to `display: block; overflow: visible`, keep the shell as the only scrolling container, and set the stage to `width: 100%; aspect-ratio: 16 / 9; margin: 0`.

Delete the unused stage background setup and cleanup from `main.js`:

```js
// Remove stage.style.removeProperty('--project-dialog-background').
// Remove the cardBackground query and stage.style.setProperty call.
```

- [ ] **Step 4: Run the browser test and adjust only the CSS values until GREEN**

Run the Step 2 command. Expected: PASS for all 18 projects at both 1440 by 900 and 1280 by 720, with full-bleed stage geometry.

- [ ] **Step 5: Commit the layout**

```powershell
git add tests/project-dialog.spec.cjs style.css main.js
git commit -m "fix: make project demos fluid and full bleed"
```

---

### Task 2: Rebuild the motion loops from raw interfaces

**Files:**
- Modify: `assets/projects/*/demo.gif` (18 files)
- Test: `tests/project-demo-assets.cjs`

**Interfaces:**
- Consumes: `assets/projects/<slug>/ui.webp` from each card and the existing `data-demo-gif` paths.
- Produces: 18 UI-first, 640-by-360, six-second looping GIFs under 3 MiB.

- [ ] **Step 1: Generate UI-first loops**

Create a temporary Pillow script under `C:\Users\osi_c\AppData\Local\Temp\crazy-entertainment-demo-capture\encode-ui-gifs.py`. For each project directory, open `ui.webp`, fit it onto a neutral `#08080a` 640-by-360 canvas with at most 8 pixels of safety inset, and generate 48 frames at 125 milliseconds each. Apply a reversible 2% center zoom so the first and final frames meet smoothly. Preserve alpha while compositing and quantize down from 128 colors until the output is at most 3 MiB.

- [ ] **Step 2: Run the asset contract**

```powershell
node tests\project-demo-assets.cjs
```

Expected: PASS with `18 project demo GIFs verified`.

- [ ] **Step 3: Build and inspect a contact sheet**

Use Pillow to render the first frame of all 18 GIFs into a labeled 4-column contact sheet under `C:\Users\osi_c\AppData\Local\Temp\crazy-entertainment-demo-capture\ui-first-contact-sheet.jpg`. Inspect it and confirm every frame is dominated by the product interface, contains no thumbnail icon or decorative card background, and keeps useful UI content visible.

- [ ] **Step 4: Commit the rebuilt loops**

```powershell
git add assets/projects/*/demo.gif
git commit -m "assets: focus project demos on product interfaces"
```

---

### Task 3: Run full visual and interaction verification

**Files:**
- Test: `tests/project-dialog.spec.cjs`
- Test: `tests/project-demo-assets.cjs`
- Test: `C:/Users/osi_c/AppData/Local/Temp/crazy-entertainment-thumbnail-layers/verify-integration.cjs`
- Test: `C:/Users/osi_c/AppData/Local/Temp/crazy-entertainment-thumbnail-bugfix/visual-check.cjs`

**Interfaces:**
- Consumes: the finished CSS layout, raw-UI motion loops and existing dialog/card behavior.
- Produces: fresh reduced-motion desktop/mobile screenshots and a clean branch ready for integration.

- [ ] **Step 1: Run the complete verification suite**

```powershell
$env:CE_BASE_URL = 'http://127.0.0.1:8083/'
$env:NODE_PATH = 'C:\Users\osi_c\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
node tests\project-demo-assets.cjs
node tests\project-dialog.spec.cjs
node 'C:\Users\osi_c\AppData\Local\Temp\crazy-entertainment-thumbnail-layers\verify-integration.cjs' 'F:\WORK\Creations\CrazyEntertainment\.worktrees\project-demo-dialog'
node 'C:\Users\osi_c\AppData\Local\Temp\crazy-entertainment-thumbnail-bugfix\visual-check.cjs'
git diff --check
```

Expected: every command exits zero; 18 GIFs, 18 cards, 54 layer assets, zero broken images and zero horizontal overflow.

- [ ] **Step 2: Inspect the required screenshots**

Inspect `project-dialog-desktop-1440x900.png` and `project-dialog-mobile-390x844.png`. Confirm desktop copy has no scrollbar, the interface owns the right column, the close button remains visible, mobile uses one natural scroll and no text/media is clipped.

- [ ] **Step 3: Recheck hover and media cleanup**

Use the browser test evidence to confirm icon hover scales only the icon, UI hover scales only the UI, no GIF/iframe exists before opening, and closing removes the media and restores focus.

- [ ] **Step 4: Commit verification-driven corrections only if needed**

If verification changes production files, commit them with:

```powershell
git add style.css main.js tests/project-dialog.spec.cjs tests/project-demo-assets.cjs assets/projects/*/demo.gif
git commit -m "fix: polish fluid project demo layout"
```

Do not create an empty commit when verification requires no correction.
