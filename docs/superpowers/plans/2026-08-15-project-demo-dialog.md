# Project Demo Dialog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every project card open one reusable native dialog with project details on the left and a lazy-loaded live demo or GIF on the right.

**Architecture:** Keep `index.html` as the source of truth. One `<dialog>` is populated from the selected `.card`; `main.js` owns open/close, copy cloning, media selection and cleanup, while `style.css` owns the responsive two-column presentation and motion. Every project gets a relative `demo.gif`; only manually verified public URLs get iframe metadata.

**Tech Stack:** Plain HTML, CSS, vanilla JavaScript, native `<dialog>`, Node built-ins for asset checks, Playwright from the bundled Codex runtime for browser checks, and bundled Python/Pillow for one-time GIF encoding.

## Global Constraints

- Keep the site build-free and dependency-free at runtime.
- Keep all published asset links relative.
- Use exactly one reusable native `<dialog>` for all 18 cards.
- Load no iframe or GIF until its card is opened, and remove the media node when the dialog closes.
- Use a real iframe only for a public URL that works without credentials and has been manually verified to allow framing.
- Give every project a 6-to-10-second looping `demo.gif`; use the current `ui.webp` as the final media-error fallback.
- Do not expose private accounts, contacts, health data, adult material, creator identities, local usage quotas or machine names in any recorded demo.
- Do not run Desktop Edge Arranger's arrange command or confirm any system-changing FuckingShareIT action while recording.
- Preserve the existing independent icon/UI thumbnail hover.
- Respect `prefers-reduced-motion: reduce` and support click, Enter, Space, Escape, close-button and backdrop interaction.
- Verify at 1440 by 900 and 390 by 844 before completion.

---

### Task 1: Add the reusable project dialog and accessible card activation

**Files:**
- Create: `tests/project-dialog.spec.cjs`
- Modify: `index.html` after the work section
- Modify: `style.css` after the work-grid styles and inside the existing responsive/reduced-motion blocks
- Modify: `main.js` inside the existing IIFE, before scroll-reveal setup

**Interfaces:**
- Consumes: existing `.card`, `.card-top`, `h3`, `.tagline`, description paragraph, `.chips`, `.thumbnail-layer--background`, `.thumbnail-layer--icon`, and `.thumbnail-layer--ui` elements.
- Produces: `openProjectDialog(card: HTMLElement): void`, `requestProjectDialogClose(): void`, one `#project-dialog`, and keyboard/click activation on all cards.

- [ ] **Step 1: Write the failing browser regression test**

Create `tests/project-dialog.spec.cjs` with a single executable Node script that uses `require('playwright')`, launches installed Chrome, and asserts the dialog contract:

```js
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const baseUrl = process.env.CE_BASE_URL || 'http://127.0.0.1:8082/';
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

(async () => {
  const browser = await chromium.launch({ executablePath: chrome, headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    const cards = page.locator('.card');
    assert.equal(await cards.count(), 18);
    assert.equal(await page.locator('#project-dialog').count(), 1);
    assert.equal(await page.locator('#project-dialog iframe, #project-dialog .project-dialog-demo').count(), 0);

    await cards.first().click();
    assert.equal(await page.locator('#project-dialog').getAttribute('open'), '');
    assert.equal(await page.locator('#project-dialog-title').textContent(), 'CoachLexy');
    assert.match(await page.locator('#project-dialog-description').textContent(), /log meals, workouts and progress/);
    assert.match(await page.locator('.project-dialog-poster').getAttribute('src'), /coachlexy\/ui\.webp$/);

    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#project-dialog').getAttribute('open'), null);
    assert.equal(await cards.first().evaluate((card) => document.activeElement === card), true);

    await cards.nth(1).focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#project-dialog-title').textContent(), 'Tableverse');
    await page.locator('.project-dialog-close').click();

    await cards.nth(2).focus();
    await page.keyboard.press('Space');
    assert.equal(await page.locator('#project-dialog-title').textContent(), 'Syb-L');
    await context.close();
    console.log('18 cards and reusable project dialog verified');
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exit(1); });
```

- [ ] **Step 2: Run the test and verify RED**

Run the existing local server, then:

```powershell
$env:NODE_PATH = 'C:\Users\osi_c\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
node tests\project-dialog.spec.cjs
```

Expected: FAIL because `#project-dialog` does not exist.

- [ ] **Step 3: Add the single dialog shell**

Add one dialog near the end of `index.html`, outside `.work-grid`:

```html
<dialog class="project-dialog" id="project-dialog" aria-labelledby="project-dialog-title" aria-describedby="project-dialog-description">
  <div class="project-dialog-shell">
    <button class="project-dialog-close" type="button" aria-label="Close project demo">×</button>
    <div class="project-dialog-copy">
      <img class="project-dialog-icon" src="" alt="" width="320" height="320" />
      <div class="project-dialog-meta"></div>
      <h2 id="project-dialog-title"></h2>
      <p class="project-dialog-tagline"></p>
      <p id="project-dialog-description"></p>
      <div class="project-dialog-chips chips"></div>
      <a class="project-dialog-live-link" href="" target="_blank" rel="noopener noreferrer" hidden>Open full demo ↗</a>
    </div>
    <div class="project-dialog-stage" aria-live="polite"></div>
  </div>
</dialog>
```

- [ ] **Step 4: Implement the minimal dialog controller**

In `main.js`, query the dialog once, make every card keyboard-focusable with `role="button"`, and populate the dialog from the selected card. Derive the poster, icon and background paths from the existing thumbnail images rather than duplicating them in data attributes. Add this controller before scroll-reveal setup:

```js
const projectDialog = document.getElementById('project-dialog');
const projectCards = document.querySelectorAll('.card');
let projectDialogTrigger = null;
let projectDialogCloseTimer = 0;

if (projectDialog) {
  const stage = projectDialog.querySelector('.project-dialog-stage');
  const icon = projectDialog.querySelector('.project-dialog-icon');
  const meta = projectDialog.querySelector('.project-dialog-meta');
  const title = document.getElementById('project-dialog-title');
  const tagline = projectDialog.querySelector('.project-dialog-tagline');
  const description = document.getElementById('project-dialog-description');
  const chips = projectDialog.querySelector('.project-dialog-chips');
  const closeButton = projectDialog.querySelector('.project-dialog-close');
  const liveLink = projectDialog.querySelector('.project-dialog-live-link');

  const clearProjectDialogMedia = () => {
    stage.replaceChildren();
    stage.style.removeProperty('--project-dialog-background');
    liveLink.hidden = true;
    liveLink.removeAttribute('href');
  };

  const installProjectDialogPoster = (card, projectTitle) => {
    const source = card.querySelector('.thumbnail-layer--ui').getAttribute('src');
    const poster = new Image();
    poster.className = 'project-dialog-poster';
    poster.src = source;
    poster.alt = `${projectTitle} interface preview`;
    stage.replaceChildren(poster);
  };

  const openProjectDialog = (card) => {
    clearTimeout(projectDialogCloseTimer);
    projectDialogTrigger = card;
    const projectTitle = card.querySelector('h3').textContent.trim();
    const cardDescription = card.querySelector(':scope > p:not(.tagline)');
    const cardIcon = card.querySelector('.thumbnail-layer--icon');
    const cardBackground = card.querySelector('.thumbnail-layer--background');

    title.textContent = projectTitle;
    tagline.textContent = card.querySelector('.tagline').textContent;
    description.textContent = cardDescription.textContent;
    meta.replaceChildren(card.querySelector('.card-top').cloneNode(true));
    chips.replaceChildren(...[...card.querySelectorAll('.chip')].map((chip) => chip.cloneNode(true)));
    icon.src = cardIcon.getAttribute('src');
    icon.alt = `${projectTitle} icon`;
    stage.style.setProperty('--project-dialog-background', `url("${cardBackground.getAttribute('src')}")`);
    installProjectDialogPoster(card, projectTitle);

    projectDialog.classList.remove('is-closing');
    projectDialog.showModal();
    requestAnimationFrame(() => projectDialog.classList.add('is-visible'));
  };

  const requestProjectDialogClose = () => {
    if (!projectDialog.open || projectDialog.classList.contains('is-closing')) return;
    projectDialog.classList.remove('is-visible');
    projectDialog.classList.add('is-closing');
    const delay = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180;
    projectDialogCloseTimer = window.setTimeout(() => projectDialog.close(), delay);
  };

  projectCards.forEach((card) => {
    const projectTitle = card.querySelector('h3').textContent.trim();
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Open ${projectTitle} project demo`);
    card.addEventListener('click', () => {
      if (!window.getSelection().toString()) openProjectDialog(card);
    });
    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      openProjectDialog(card);
    });
  });

  closeButton.addEventListener('click', requestProjectDialogClose);
  projectDialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    requestProjectDialogClose();
  });
  projectDialog.addEventListener('click', (event) => {
    if (event.target === projectDialog) requestProjectDialogClose();
  });
  projectDialog.addEventListener('close', () => {
    clearProjectDialogMedia();
    projectDialog.classList.remove('is-visible', 'is-closing');
    projectDialogTrigger?.focus();
  });
}
```

- [ ] **Step 5: Style the desktop, mobile and reduced-motion states**

Add these states, adjusting only spacing values if the rendered screenshots require it:

```css
.card[role="button"] { cursor: pointer; }
.card[role="button"]:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }

.project-dialog {
  width: min(92vw, 1440px); height: min(88vh, 900px); max-width: none; max-height: none;
  margin: auto; padding: 0; border: 1px solid var(--line-2); border-radius: 20px;
  color: var(--fg); background: var(--bg-1); overflow: hidden;
  opacity: 0; transform: scale(.96);
  transition: opacity .18s ease, transform .18s cubic-bezier(.16,1,.3,1);
}
.project-dialog.is-visible { opacity: 1; transform: scale(1); }
.project-dialog.is-closing { opacity: 0; transform: scale(.98); }
.project-dialog::backdrop { background: rgba(4,4,6,.82); backdrop-filter: blur(12px); }
.project-dialog-shell { display: grid; grid-template-columns: minmax(300px,.62fr) minmax(0,1fr); grid-template-areas: "copy stage"; height: 100%; }
.project-dialog-copy { grid-area: copy; overflow-y: auto; padding: clamp(28px,4vw,56px); }
.project-dialog-icon { width: min(180px,45%); height: auto; margin-bottom: 28px; }
.project-dialog-meta .card-top { margin-bottom: 24px; }
.project-dialog-copy h2 { font-size: clamp(34px,4vw,64px); }
.project-dialog-tagline { margin-top: 12px; color: var(--fg); font-size: 18px; }
#project-dialog-description { margin-top: 24px; color: var(--fg-mut); line-height: 1.7; }
.project-dialog-chips { margin-top: 28px; }
.project-dialog-live-link { display: inline-flex; margin-top: 28px; color: var(--accent); }
.project-dialog-live-link[hidden] { display: none; }
.project-dialog-stage {
  grid-area: stage; align-self: center; aspect-ratio: 16/9; margin: 32px; overflow: hidden;
  border: 1px solid var(--line-2); border-radius: 16px;
  background: center/cover no-repeat var(--project-dialog-background), #08080a;
}
.project-dialog-stage > img, .project-dialog-stage > iframe { width: 100%; height: 100%; border: 0; object-fit: contain; }
.project-dialog-close {
  position: absolute; top: 18px; right: 18px; z-index: 2; width: 42px; height: 42px;
  border: 1px solid var(--line-2); border-radius: 999px; color: var(--fg); background: rgba(8,8,10,.88);
  font-size: 26px; line-height: 1; cursor: pointer;
}

@media (max-width: 820px) {
  .project-dialog { width: 100vw; height: 100dvh; border-radius: 0; }
  .project-dialog-shell { grid-template-columns: 1fr; grid-template-rows: auto 1fr; grid-template-areas: "stage" "copy"; overflow-y: auto; }
  .project-dialog-stage { margin: 64px 16px 16px; }
  .project-dialog-copy { overflow: visible; padding: 24px 20px 40px; }
}

@media (prefers-reduced-motion: reduce) {
  .project-dialog { transition: none; }
}
```

- [ ] **Step 6: Run the test and verify GREEN**

```powershell
$env:NODE_PATH = 'C:\Users\osi_c\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
node tests\project-dialog.spec.cjs
```

Expected: PASS with `18 cards and reusable project dialog verified`.

- [ ] **Step 7: Commit the working poster-backed dialog**

```powershell
git add index.html style.css main.js tests/project-dialog.spec.cjs
git commit -m "feat: add reusable project demo dialog"
```

---

### Task 2: Create and validate one lazy demo GIF per project

**Files:**
- Create: `tests/project-demo-assets.cjs`
- Create: `assets/projects/coachlexy/demo.gif`
- Create: `assets/projects/tableverse/demo.gif`
- Create: `assets/projects/syb-l/demo.gif`
- Create: `assets/projects/videoqualitybalancer/demo.gif`
- Create: `assets/projects/crazy-enhancer-youtube/demo.gif`
- Create: `assets/projects/dorfkoenig/demo.gif`
- Create: `assets/projects/apollo-dual-screen/demo.gif`
- Create: `assets/projects/axiom-calculator/demo.gif`
- Create: `assets/projects/token-measurer/demo.gif`
- Create: `assets/projects/reviewer-3000/demo.gif`
- Create: `assets/projects/dump-to-txt/demo.gif`
- Create: `assets/projects/micbridge/demo.gif`
- Create: `assets/projects/proteaser-studio/demo.gif`
- Create: `assets/projects/portica/demo.gif`
- Create: `assets/projects/custom-video-platform/demo.gif`
- Create: `assets/projects/creator-workflow-extension/demo.gif`
- Create: `assets/projects/fuckingshareit/demo.gif`
- Create: `assets/projects/desktop-edge-arranger/demo.gif`
- Modify: `index.html` card opening tags
- Modify: `main.js` media selection

**Interfaces:**
- Consumes: each card's existing `ui.webp`, safe local project runtime when available, and bundled Python at `C:/Users/osi_c/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe` with Pillow 12.3.0.
- Produces: `data-demo-gif="assets/projects/<slug>/demo.gif"` on every card and a lazy `.project-dialog-demo` image in the dialog stage.

- [ ] **Step 1: Write the failing asset test**

Create `tests/project-demo-assets.cjs` using only Node built-ins. Extract every `data-demo-gif` from `index.html` and assert 18 unique relative files. For each file, assert `GIF87a` or `GIF89a`, 640 by 360 pixels, and a size no larger than 3 MiB.

```js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const gifs = [...html.matchAll(/<article\b[^>]*class="card reveal"[^>]*data-demo-gif="([^"]+)"/g)].map((match) => match[1]);
assert.equal(gifs.length, 18);
assert.equal(new Set(gifs).size, 18);
for (const relative of gifs) {
  assert.equal(path.isAbsolute(relative), false);
  const bytes = fs.readFileSync(path.join(root, relative));
  assert.match(bytes.subarray(0, 6).toString('ascii'), /^GIF8[79]a$/);
  assert.equal(bytes.readUInt16LE(6), 640);
  assert.equal(bytes.readUInt16LE(8), 360);
  assert.ok(bytes.length <= 3 * 1024 * 1024, `${relative} exceeds 3 MiB`);
}
console.log('18 project demo GIFs verified');
```

- [ ] **Step 2: Run the asset test and verify RED**

```powershell
node tests\project-demo-assets.cjs
```

Expected: FAIL because the cards do not yet have `data-demo-gif` and the files do not exist.

- [ ] **Step 3: Capture safe representative frames**

Create temporary capture frames under `C:\Users\osi_c\AppData\Local\Temp\crazy-entertainment-demo-capture\<slug>\`. Use Playwright screenshots for browser projects and Pillow `ImageGrab` for visible desktop windows. Keep the target crop at 16:9 and record no private content. For browser projects, take a keyframe after each listed action with `page.screenshot({ path, clip: { x, y, width, height } })`. For desktop projects, use this temporary `capture-window.py` helper while the safe interaction is performed:

```python
import argparse, ctypes, time
from ctypes import wintypes
from pathlib import Path
from PIL import ImageGrab

parser = argparse.ArgumentParser()
parser.add_argument('--title', required=True)
parser.add_argument('--output', required=True)
parser.add_argument('--seconds', type=float, default=6)
args = parser.parse_args()

user32 = ctypes.windll.user32
matches = []

@ctypes.WINFUNCTYPE(ctypes.c_bool, ctypes.c_void_p, ctypes.c_void_p)
def visit(hwnd, _):
    length = user32.GetWindowTextLengthW(hwnd)
    if length:
        text = ctypes.create_unicode_buffer(length + 1)
        user32.GetWindowTextW(hwnd, text, length + 1)
        if args.title.lower() in text.value.lower() and user32.IsWindowVisible(hwnd):
            matches.append(hwnd)
    return True

user32.EnumWindows(visit, 0)
if not matches:
    raise SystemExit(f'No visible window contains: {args.title}')

rect = wintypes.RECT()
user32.GetWindowRect(matches[0], ctypes.byref(rect))
bbox = (rect.left, rect.top, rect.right, rect.bottom)
output = Path(args.output)
output.mkdir(parents=True, exist_ok=True)
time.sleep(1)
for index in range(round(args.seconds * 8)):
    ImageGrab.grab(bbox=bbox, all_screens=True).save(output / f'{index:03}.png')
    time.sleep(.125)
```

Use this source matrix:

| Project | Source and launch command | Representative loop |
|---|---|---|
| CoachLexy | `npm --workspace @lexy/coach run web -- --port 8091` from `F:\WORK\Creations\CoachLexy` | Open a fixture conversation and move between a meal message and its confirmation; fall back to `ui.webp` if the web target requires private credentials. |
| Tableverse | `https://tableking.gg/` | Open Chess and show one safe guest move; this is also the live-embed project. |
| Syb-L | `F:\WORK\Creations\Syb-L\sybl\build-current\windows\x64\runner\Release\sybl.exe` | Show the clean app shell or onboarding without exposing contacts or identity data. |
| VideoQualityBalancer | `npm run dev -- --host 127.0.0.1 --port 8092` from its project root | Move from selected scenes to the source/encode comparison. |
| Crazy Enhancer for YouTube | Load `F:\WORK\Creations\CrazyYoutube\firefox-extension\chrome-build` as an unpacked extension in a temporary Chrome profile | On a public YouTube page, show the injected speed/transcript controls without logging in. |
| Dorfkönig | `npm run dev -- --webpack -p 8093` from `F:\WORK\Creations\SwissGeoGuessr` | Show a fixture location, pin placement and result; fall back to `ui.webp` if local Supabase data is unavailable. |
| Apollo Dual-Screen | Launch `F:\WORK\Creations\CrazyApolloAndMoonlightQT\Vibepollo\build\CrazyApollo.exe` only when the existing safe test host opens without configuration changes | Show monitor selection; otherwise animate `ui.webp` because a paired streaming host is required. |
| Axiom Calculator Platform | Serve `F:\WORK\Creations\Ti-30x pro` with bundled Python `-m http.server 8094` | Enter a short expression and show the MathPrint result. |
| Token Measurer | `F:\WORK\Creations\token-measurer\src-tauri\target\debug\token-measurer.exe` | Show the overlay expanding to its tray view only if quota values can be obscured; otherwise animate `ui.webp`. |
| Reviewer 3000 | `npm run dev:app` from `F:\WORK\Creations\Reviewer-3000\Reviewer-3000` | Switch between fixture review sources or themes. |
| DumpToTxt | `F:\WORK\Creations\DumpToTXT\dist\full\DumpToTxt.exe` | Open settings and switch one harmless output option without dumping a real folder. |
| MicBridge | `F:\WORK\Creations\MicBridge\build\micbridge.exe ui` | Open the tray panel and show LAN discovery without starting a stream. |
| ProTeaser Studio | `npm run dev -- --host 127.0.0.1 --port 8095` from `F:\WORK\Creations\PTC` | Scrub the fixture timeline and select a highlight. |
| Portica | `npm --prefix apps/web run dev -- --host 127.0.0.1 --port 8096` from `F:\WORK\Creations\Portfolio-3000` | Switch between two fixture templates without importing personal material. |
| Custom Video Platform | Existing anonymized `ui.webp` only | Use a restrained pan/zoom loop; do not launch or expose the adult-persona product. |
| Creator Workflow Extension | Existing anonymized `ui.webp` only | Use a restrained pan/zoom loop; do not open a private creator account. |
| FuckingShareIT | `F:\WORK\Creations\FuckingShareIT\outputs\FuckingShareIT.exe` | Move through the source/target selection screens and stop before UAC or Apply. |
| Desktop Edge Arranger | Existing `ui.webp` only | Use a restrained pan/zoom loop; never run Arrange because it moves the user's desktop icons. |

- [ ] **Step 4: Encode and optimize the GIFs**

Use the bundled Python/Pillow runtime to encode 640 by 360 GIFs at 8 frames per second. Save this temporary script as `C:\Users\osi_c\AppData\Local\Temp\crazy-entertainment-demo-capture\encode-gif.py`:

```python
import argparse, math
from pathlib import Path
from PIL import Image, ImageOps

parser = argparse.ArgumentParser()
group = parser.add_mutually_exclusive_group(required=True)
group.add_argument('--source')
group.add_argument('--frames')
parser.add_argument('--output', required=True)
args = parser.parse_args()

size = (640, 360)
count = 48

if args.frames:
    paths = sorted(Path(args.frames).glob('*.png'))
    if not paths:
        raise SystemExit('No PNG frames found')
    frames = [ImageOps.fit(Image.open(path).convert('RGB'), size, Image.Resampling.LANCZOS) for path in paths]
else:
    source = ImageOps.fit(Image.open(args.source).convert('RGB'), size, Image.Resampling.LANCZOS)
    frames = []
    for index in range(count):
        phase = .5 - .5 * math.cos(2 * math.pi * index / (count - 1))
        scale = 1 + .04 * phase
        grown = source.resize((round(size[0] * scale), round(size[1] * scale)), Image.Resampling.LANCZOS)
        left = (grown.width - size[0]) // 2
        top = round((grown.height - size[1]) * (.35 + .3 * phase))
        frames.append(grown.crop((left, top, left + size[0], top + size[1])))

output = Path(args.output)
output.parent.mkdir(parents=True, exist_ok=True)
for colors in (128, 96, 64):
    palette = frames[0].convert('P', palette=Image.Palette.ADAPTIVE, colors=colors)
    indexed = [frame.quantize(palette=palette, dither=Image.Dither.FLOYDSTEINBERG) for frame in frames]
    indexed[0].save(output, save_all=True, append_images=indexed[1:], duration=125, loop=0, optimize=True, disposal=2)
    if output.stat().st_size <= 3 * 1024 * 1024:
        break
else:
    raise SystemExit(f'{output} remains larger than 3 MiB')
```

Encode captured frames with `--frames <frame-directory>` and approved still-image fallbacks with `--source <project-ui.webp>`. The reversible 4% pan/zoom returns smoothly to its first frame.

- [ ] **Step 5: Add GIF metadata and lazy GIF rendering**

Add `data-demo-gif="assets/projects/<slug>/demo.gif"` to every `.card`. Replace `installProjectDialogPoster` with this GIF-first helper and keep the static poster as its error fallback:

```js
const installProjectDialogGif = (card, projectTitle) => {
  const demo = new Image();
  demo.className = 'project-dialog-demo';
  demo.alt = `${projectTitle} interface demo`;
  demo.addEventListener('error', () => {
    demo.className = 'project-dialog-poster';
    demo.src = card.querySelector('.thumbnail-layer--ui').getAttribute('src');
  }, { once: true });
  demo.src = card.dataset.demoGif;
  stage.replaceChildren(demo);
};
```

Call `installProjectDialogGif(card, projectTitle)` inside `openProjectDialog(card)`. Because the image node is created only inside the open function and removed by `clearProjectDialogMedia()`, unopened GIFs do not download and opened GIFs stop when the dialog closes.

Update the first-card browser assertion from `.project-dialog-poster` to:

```js
assert.match(await page.locator('.project-dialog-demo').getAttribute('src'), /coachlexy\/demo\.gif$/);
```

- [ ] **Step 6: Run asset and dialog tests**

```powershell
node tests\project-demo-assets.cjs
$env:NODE_PATH = 'C:\Users\osi_c\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
node tests\project-dialog.spec.cjs
```

Expected: both scripts pass; the browser test sees `.project-dialog-demo` only after a card opens.

- [ ] **Step 7: Commit the GIF-backed previews**

```powershell
git add index.html main.js tests/project-demo-assets.cjs assets/projects/*/demo.gif
git commit -m "assets: add project demo loops"
```

---

### Task 3: Add verified live embedding with a GIF fallback

**Files:**
- Modify: `index.html` Tableverse card metadata
- Modify: `main.js` media selection and cleanup
- Modify: `style.css` iframe and external-link states
- Modify: `tests/project-dialog.spec.cjs`

**Interfaces:**
- Consumes: optional `data-demo-url` and `data-demo-link` values plus the guaranteed `data-demo-gif` from Task 2.
- Produces: lazy `.project-dialog-frame`, visible `.project-dialog-live-link`, and GIF fallback for all cards without approved live metadata.

- [ ] **Step 1: Extend the browser test and verify RED**

After opening Tableverse, assert that the dialog contains one iframe with `src="https://tableking.gg/"`, a descriptive `title`, and a visible external link. Assert that CoachLexy still opens a GIF and that no iframe exists before Tableverse opens.

Run:

```powershell
$env:NODE_PATH = 'C:\Users\osi_c\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
node tests\project-dialog.spec.cjs
```

Expected: FAIL because no live-demo metadata or iframe logic exists.

- [ ] **Step 2: Confirm Tableverse still permits framing**

```powershell
$response = Invoke-WebRequest -UseBasicParsing -Method Head https://tableking.gg/ -MaximumRedirection 5
$response.StatusCode
$response.Headers['X-Frame-Options']
$response.Headers['Content-Security-Policy']
```

Expected: status 200 with no `X-Frame-Options` and no `frame-ancestors` restriction. Then load it inside a local test iframe and confirm the page renders rather than a browser block page.

- [ ] **Step 3: Add the approved live metadata**

Add these attributes only to the Tableverse card:

```html
data-demo-url="https://tableking.gg/" data-demo-link="https://tableking.gg/"
```

Do not add URLs for local, private, authenticated or unlaunched projects.

- [ ] **Step 4: Implement live-first media selection**

Add this live-first selector after `installProjectDialogGif` and call it from `openProjectDialog` in place of the direct GIF helper:

```js
const installProjectDialogMedia = (card, projectTitle) => {
  if (!card.dataset.demoUrl) {
    installProjectDialogGif(card, projectTitle);
    return;
  }

  const frame = document.createElement('iframe');
  frame.className = 'project-dialog-frame';
  frame.src = card.dataset.demoUrl;
  frame.title = `${projectTitle} live demo`;
  frame.loading = 'lazy';
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  stage.replaceChildren(frame);

  liveLink.href = card.dataset.demoLink || card.dataset.demoUrl;
  liveLink.hidden = false;
};
```

`clearProjectDialogMedia()` already removes the iframe and hides/resets the external link on close. Add `.project-dialog-frame { background: #08080a; }` beside the shared stage media rule.

- [ ] **Step 5: Run the browser test and verify GREEN**

```powershell
$env:NODE_PATH = 'C:\Users\osi_c\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
node tests\project-dialog.spec.cjs
```

Expected: PASS with a live Tableverse iframe and GIFs for the other projects.

- [ ] **Step 6: Commit the live-demo path**

```powershell
git add index.html main.js style.css tests/project-dialog.spec.cjs
git commit -m "feat: embed verified live project demos"
```

---

### Task 4: Verify visual quality, fallbacks and the original thumbnail interactions

**Files:**
- Inspect and correct on a failing check: `index.html`, `style.css`, `main.js`
- Test: `tests/project-dialog.spec.cjs`
- Test: `tests/project-demo-assets.cjs`
- Test: `C:/Users/osi_c/AppData/Local/Temp/crazy-entertainment-thumbnail-bugfix/visual-check.cjs`
- Test: `C:/Users/osi_c/AppData/Local/Temp/crazy-entertainment-thumbnail-layers/verify-integration.cjs`

**Interfaces:**
- Consumes: the complete dialog, live iframe, 18 GIFs and the pre-existing thumbnail hover behavior.
- Produces: verified desktop/mobile screenshots and a clean final commit.

- [ ] **Step 1: Expand the browser regression checks**

Add assertions for close-button, Escape and backdrop closing; focus restoration; 18 keyboard-focusable cards; no GIF/iframe before opening; GIF removal on close; matching project title/description/chips; mobile dialog width within 390 pixels; and zero document horizontal overflow. Use these checks in the existing Playwright script, then capture an open CoachLexy dialog at 1440 by 900 and an open Tableverse dialog at 390 by 844 with reduced motion enabled:

```js
assert.equal(await page.locator('.card[role="button"][tabindex="0"]').count(), 18);
assert.equal(await page.locator('#project-dialog iframe, #project-dialog .project-dialog-demo').count(), 0);
await cards.first().click();
assert.equal(await page.locator('.project-dialog-chips .chip').count(), 4);
await page.screenshot({ path: 'project-dialog-desktop-1440x900.png' });
await page.locator('.project-dialog-close').click();
await page.waitForFunction(() => !document.querySelector('#project-dialog').open);
assert.equal(await page.locator('#project-dialog iframe, #project-dialog .project-dialog-demo').count(), 0);
assert.equal(await cards.first().evaluate((card) => document.activeElement === card), true);

await cards.nth(2).click();
await page.locator('#project-dialog').evaluate((dialog) => {
  dialog.dispatchEvent(new MouseEvent('click', { bubbles: true }));
});
await page.waitForFunction(() => !document.querySelector('#project-dialog').open);
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);

const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
const mobile = await mobileContext.newPage();
await mobile.goto(baseUrl, { waitUntil: 'domcontentloaded' });
await mobile.locator('.card').nth(1).click();
const bounds = await mobile.locator('#project-dialog').boundingBox();
assert.ok(bounds.width <= 390);
assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
await mobile.screenshot({ path: 'project-dialog-mobile-390x844.png' });
await mobileContext.close();
```

- [ ] **Step 2: Run the complete automated verification**

```powershell
node tests\project-demo-assets.cjs
$env:NODE_PATH = 'C:\Users\osi_c\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
node tests\project-dialog.spec.cjs
node 'C:\Users\osi_c\AppData\Local\Temp\crazy-entertainment-thumbnail-layers\verify-integration.cjs' 'F:\WORK\Creations\CrazyEntertainment'
node 'C:\Users\osi_c\AppData\Local\Temp\crazy-entertainment-thumbnail-bugfix\visual-check.cjs'
git diff --check
```

Expected: every command exits zero; 18 cards, 54 original thumbnail layers and 18 GIFs are present; there are no console errors, broken images or horizontal overflow.

- [ ] **Step 3: Inspect both dialog screenshots**

Open the 1440 by 900 and 390 by 844 screenshots. Confirm the left/right split is readable on desktop, the demo is first on mobile, the close control remains visible, text is not clipped, the GIF stays inside its frame, and the surrounding page does not move when the dialog opens.

- [ ] **Step 4: Recheck the existing layer hover**

Hover the icon and UI independently on a closed card. Confirm the hovered layer still scales boldly and smoothly while the sibling remains unchanged. Click the card after each hover and confirm the dialog opens once.

- [ ] **Step 5: Commit any verification-driven polish**

If verification required changes:

```powershell
git add index.html style.css main.js tests/project-dialog.spec.cjs tests/project-demo-assets.cjs assets/projects/*/demo.gif
git commit -m "fix: polish project demo overlay"
```

If no files changed, do not create an empty commit.
