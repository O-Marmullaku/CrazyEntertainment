# Project Thumbnails Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all fifteen generic project slates with truthful thumbnails built from each project’s real logo and a recognizable capture of its actual interface.

**Architecture:** Capture logos and staged UI screenshots into a project-local temporary workspace, then deterministically composite each pair into one 1200 × 675 WebP asset. The published site remains plain HTML and CSS: each existing `.card-visual` container receives one lazy-loaded image, and the placeholder-only CSS is replaced by image sizing and a subtle hover scale.

**Tech Stack:** HTML5, CSS, vanilla browser capture, the bundled Codex Node.js runtime with its bundled `sharp` module for deterministic image compositing, and a local Python HTTP server for verification. No project dependency or build step is added.

## Global Constraints

- Read the owning project’s `AGENTS.md`, `README.md`, or run documentation before launching it; do not mutate sibling project repositories.
- Reuse exact project-owned logos or app icons. Use a restrained monogram only where no established mark exists.
- Capture a real launched interface first; use a checked-in screenshot or native mockup only when launch is unavailable or unsafe.
- Never fabricate application interfaces with generative imagery.
- Never publish private names, emails, tokens, local paths, account details, messages, production data, adult imagery, or identifiable creator/audience information.
- Final thumbnails are exactly 1200 × 675 WebP files under `assets/projects/`.
- Keep all website asset references relative.
- Do not add a framework, JavaScript behavior, build step, package manifest, or dependency.
- Do not move, rename, or break `privacy.html`; do not modify `impressum.html`, `CNAME`, or `.nojekyll`.
- Do not include a `Co-Authored-By: Claude` trailer in commits.
- Run repository Git commands with `-c safe.directory='F:/WORK/Creations/CrazyEntertainment'`; do not alter global Git configuration.
- Preserve the user-owned untracked `.claude/` and `assets/source/` content.
- Run final visual verification at 1440 × 900 and 390 × 844 with reduced motion enabled.

Before any launch/composition command in this environment, load the bundled runtime into the current PowerShell session:

```powershell
$codexDeps = 'C:\Users\osi_c\.cache\codex-runtimes\codex-primary-runtime\dependencies'
$env:PATH = "$codexDeps\node\bin;$codexDeps\python;$codexDeps\bin\fallback;$env:PATH"
$env:NODE_PATH = "$codexDeps\node\node_modules"
```

## File Map

**Create:**

- `assets/projects/crazy-enhancer.webp`
- `assets/projects/dorfkoenig.webp`
- `assets/projects/tableverse.webp`
- `assets/projects/syb-l.webp`
- `assets/projects/apollo-dual-screen.webp`
- `assets/projects/axiom-calculator.webp`
- `assets/projects/token-measurer.webp`
- `assets/projects/reviewer-3000.webp`
- `assets/projects/dump-to-txt.webp`
- `assets/projects/micbridge.webp`
- `assets/projects/proteaser-studio.webp`
- `assets/projects/video-quality-balancer.webp`
- `assets/projects/portica.webp`
- `assets/projects/custom-video-platform.webp`
- `assets/projects/creator-workflow-extension.webp`

**Modify:**

- `index.html:62-194` — replace the fifteen placeholder slates with image elements.
- `style.css:126-149` — remove initial/grid artwork and style real images.

**Temporary, never commit:**

- `.superpowers/tmp/project-thumbnails/` — normalized logo files, raw UI captures, and the deterministic composer.

---

### Task 1: Capture real product identity and UI for projects 01–05

**Files:**

- Create temporary: `.superpowers/tmp/project-thumbnails/01-crazy-enhancer-logo.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/01-crazy-enhancer-ui.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/02-dorfkoenig-logo.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/02-dorfkoenig-ui.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/03-tableverse-logo.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/03-tableverse-ui.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/04-syb-l-logo.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/04-syb-l-ui.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/05-apollo-dual-screen-logo.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/05-apollo-dual-screen-ui.png`

**Interfaces:**

- Consumes: read-only assets and runnable states from sibling project repositories.
- Produces: five normalized logo/UI pairs. Each UI image is at least 1200 × 675 and already framed around the interesting region.

- [ ] **Step 1: Create the project-local capture workspace**

Run:

```powershell
New-Item -ItemType Directory -Force '.superpowers\tmp\project-thumbnails' | Out-Null
```

Expected: the directory exists under the Crazy Entertainment project; no sibling project is modified.

- [ ] **Step 2: Capture Crazy Enhancer for YouTube**

Copy `..\CrazyYoutube\firefox-extension\icons\icon-source.png` to the normalized logo path. Load `..\CrazyYoutube\firefox-extension\chrome-build` as an unpacked extension in a clean Chrome profile, open a signed-out/demo-safe YouTube video, activate the extension, and frame the screenshot so its added player controls or buttons are visibly the subject. Save it as `01-crazy-enhancer-ui.png`; do not show personal account controls or history.

- [ ] **Step 3: Capture Dorfkönig**

Copy `..\SwissGeoGuessr\public\icons\icon-512.png` to the normalized logo path. From `..\SwissGeoGuessr`, run:

```powershell
pnpm run dev
```

Open the local app and stage a real round where both the village photograph and map-guessing surface are visible. Save the focused capture as `02-dorfkoenig-ui.png`. If backend credentials prevent a live round, capture the app’s own locally rendered round shell with repository-owned fixture content rather than inventing a replacement interface.

- [ ] **Step 4: Capture Tableverse**

Copy `..\Cards\assets\brand\knight-aces-v6.png` to the normalized logo path. From `..\Cards`, run:

```powershell
pnpm run build
pnpm start
```

Open the local app, enter a chess table, advance the game until several pieces are developed, and capture the board plus enough surrounding table UI to identify the product. Save it as `03-tableverse-ui.png`.

- [ ] **Step 5: Capture Syb-L**

The repository has no established bitmap logo outside archived/local data, so render a restrained `SL` monogram on transparent background for the normalized logo path. Prefer the real Flutter application from `..\Syb-L\sybl`:

```powershell
flutter run -d windows
```

Stage the call surface with inert demo participants and save it as `04-syb-l-ui.png`. If the native toolchain is unavailable, serve and capture `..\Syb-L\design\mockups\windows-app.html`, which is the project’s own native design preview.

- [ ] **Step 6: Capture Apollo Dual-Screen**

Use `..\CrazyApolloAndMoonlightQT\Vibepollo\src_assets\common\assets\web\public\images\logo-apollo.svg` as the exact source mark and normalize it to PNG without changing its design. Launch the current dual-screen coordinator/client build when a configured local host is available and capture one window showing two distinct desktops side by side. Otherwise use the repository’s own dual-screen spike evidence and actual Moonlight/Apollo desktop surfaces—never unrelated stock imagery—to produce `05-apollo-dual-screen-ui.png`.

- [ ] **Step 7: Review the first capture batch**

Open all ten normalized files. Confirm every logo is sharp, each UI is recognizable without the card copy, and no private data is visible. Record any failed launch and the exact repository-owned fallback used in the task notes before proceeding.

---

### Task 2: Capture real product identity and UI for projects 06–10

**Files:**

- Create temporary: `.superpowers/tmp/project-thumbnails/06-axiom-calculator-logo.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/06-axiom-calculator-ui.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/07-token-measurer-logo.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/07-token-measurer-ui.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/08-reviewer-3000-logo.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/08-reviewer-3000-ui.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/09-dump-to-txt-logo.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/09-dump-to-txt-ui.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/10-micbridge-logo.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/10-micbridge-ui.png`

**Interfaces:**

- Consumes: read-only project assets and live/demo interfaces.
- Produces: five more normalized logo/UI pairs at the same capture contract as Task 1.

- [ ] **Step 1: Capture Axiom Calculator Platform**

Copy `..\Ti-30x pro\src-tauri\icon-source.png` to the normalized logo path. From `..\Ti-30x pro`, run `pnpm run build:web`, serve the generated web output with a local HTTP server, enter a meaningful multi-line MathPrint expression, and save the focused calculator capture as `06-axiom-calculator-ui.png`. Use `..\Ti-30x pro\handoff\P6-desktop-shell\desktop-screen-1.png` only if the web build cannot launch.

- [ ] **Step 2: Capture Token Measurer**

Copy `..\token-measurer\app-icon.png` to the normalized logo path. Launch the Tauri application from `..\token-measurer` with `pnpm run tauri -- dev`, feed it repository-owned demo/test usage data rather than personal logs, and capture the populated top pill and tray meter as `07-token-measurer-ui.png`.

- [ ] **Step 3: Capture Reviewer 3000**

Use a restrained `R3` monogram unless the active app exposes a newer established project mark. From `..\Reviewer-3000\Reviewer-3000`, run `pnpm run dev:app`, then capture the populated real review experience spanning film, book, and game content as `08-reviewer-3000-ui.png`. The deterministic fallback is `..\Reviewer-3000\Reviewer-3000\docs\user-pipeline-gallery-preview.jpg`.

- [ ] **Step 4: Capture DumpToTxt**

Use the established application artwork from `..\DumpToTXT\assets\icons\DumpToTxt-icon.psd` exported without redesign; if PSD export is unavailable, use the icon shown in `..\DumpToTXT\assets\screenshots\program-cover.png`. From `..\DumpToTXT`, run:

```powershell
dotnet run --project 'src\DumpToTxt.App\DumpToTxt.App.csproj'
```

Select an inert sample folder and capture the real application window with folder/packing state visible as `09-dump-to-txt-ui.png`. The deterministic fallback is `..\DumpToTXT\assets\screenshots\program-cover.png`.

- [ ] **Step 5: Capture MicBridge**

Copy `..\MicBridge\assets\tray\mic\send_active.png` to the normalized logo path. Launch the current UI if the native build is available; otherwise serve `..\MicBridge\mockups\index.html`, which is the project’s own main-interface design. Stage a connected or active device state and save the main device/audio interface as `10-micbridge-ui.png`.

- [ ] **Step 6: Review the second capture batch**

Open all ten normalized files and verify the same sharpness, recognizability, and privacy checks used in Task 1. Token Measurer must not expose real usage history or filesystem paths.

---

### Task 3: Capture real product identity and UI for projects 11–15

**Files:**

- Create temporary: `.superpowers/tmp/project-thumbnails/11-proteaser-studio-logo.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/11-proteaser-studio-ui.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/12-video-quality-balancer-logo.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/12-video-quality-balancer-ui.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/13-portica-logo.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/13-portica-ui.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/14-custom-video-platform-logo.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/14-custom-video-platform-ui.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/15-creator-workflow-extension-logo.png`
- Create temporary: `.superpowers/tmp/project-thumbnails/15-creator-workflow-extension-ui.png`

**Interfaces:**

- Consumes: read-only project assets and live/demo interfaces.
- Produces: the final five normalized logo/UI pairs.

- [ ] **Step 1: Capture ProTeaser Studio**

Use a restrained `PT` monogram unless the current app exposes an established mark. From `..\PTC`, run `pnpm run dev`, open the app’s own demo project, and capture a populated waveform and teaser timeline as `11-proteaser-studio-ui.png`. The deterministic fallback is `..\PTC\app-pro-mode.png`.

- [ ] **Step 2: Capture VideoQualityBalancer**

Copy `..\VideoQualityBalancer\public\logo.png` to the normalized logo path. From `..\VideoQualityBalancer`, run `pnpm run dev`, load its repository-owned mock/demo media state, and capture the source-versus-encode comparison or populated quality-tuning screen as `12-video-quality-balancer-ui.png`.

- [ ] **Step 3: Capture Portica**

Use the established project mark if one is present in the active application; otherwise use a restrained `PO` monogram. From `..\Portfolio-3000`, run `pnpm --dir apps/web run dev`, open a demo portfolio in the builder, and capture the builder controls beside the rendered site preview as `13-portica-ui.png`. The deterministic fallback is `..\Portfolio-3000\08-builder-obsidia.png`.

- [ ] **Step 4: Capture Custom Video Platform safely**

Use a neutral `VP` monogram rather than publishing an adult-facing legacy brand. From `..\AdultVideoPlayer`, run the local backend and web app only with repository-owned inert fixtures:

```powershell
pnpm run dev
pnpm --dir web run dev
```

Capture the real player/catalogue shell after replacing all adult thumbnails, explicit titles, usernames, and identifying data with neutral safe media. Save it as `14-custom-video-platform-ui.png`. If a safe live state cannot be guaranteed, use the project’s own policy-state UI with all identifying text cropped, not any adult-content output.

- [ ] **Step 5: Capture Creator Workflow Extension safely**

Copy `..\OFEnhancer\store-listing\icon128.png` to the normalized logo path. Load the store edition as an unpacked extension in a clean profile, open its real options/settings surface with inert sample values, and save the anonymized masking/settings interface as `15-creator-workflow-extension-ui.png`. The deterministic fallback is `..\OFEnhancer\store-listing\screenshot-settings.png`.

- [ ] **Step 6: Review the third capture batch**

Open all ten normalized files. Confirm that projects 14 and 15 contain no adult imagery, explicit language, real identities, account data, or private workflow details.

---

### Task 4: Deterministically compose and validate the fifteen WebP thumbnails

**Files:**

- Create temporary: `.superpowers/tmp/project-thumbnails/compose.cjs`
- Create: all fifteen `assets/projects/*.webp` files listed in the File Map.

**Interfaces:**

- Consumes: the fifteen numbered normalized logo/UI filename pairs listed explicitly in Tasks 1–3.
- Produces: one 1200 × 675 WebP per slug, with the screenshot preserved and the logo placed in the left rail.

- [ ] **Step 1: Write the asset-contract check and verify it fails before composition**

Run:

```powershell
$expected = 'crazy-enhancer','dorfkoenig','tableverse','syb-l','apollo-dual-screen','axiom-calculator','token-measurer','reviewer-3000','dump-to-txt','micbridge','proteaser-studio','video-quality-balancer','portica','custom-video-platform','creator-workflow-extension'
$missing = $expected | Where-Object { -not (Test-Path "assets/projects/$_.webp") }
if ($missing.Count -ne 15) { throw "Expected all 15 final thumbnails to be absent before composition; missing count was $($missing.Count)." }
```

Expected: PASS only when none of the final assets exists yet. If a previous run exists, inspect it rather than overwriting blindly.

- [ ] **Step 2: Write the temporary deterministic composer**

Use the bundled Codex Node.js runtime and its bundled `sharp` module; do not add `sharp` to this repository. Write this exact temporary script:

```js
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const root = process.cwd();
const sourceDir = path.join(root, '.superpowers', 'tmp', 'project-thumbnails');
const outputDir = path.join(root, 'assets', 'projects');
const replace = new Set(process.argv.slice(2));
const projects = [
  ['01', 'crazy-enhancer'],
  ['02', 'dorfkoenig'],
  ['03', 'tableverse'],
  ['04', 'syb-l'],
  ['05', 'apollo-dual-screen'],
  ['06', 'axiom-calculator'],
  ['07', 'token-measurer'],
  ['08', 'reviewer-3000'],
  ['09', 'dump-to-txt'],
  ['10', 'micbridge'],
  ['11', 'proteaser-studio'],
  ['12', 'video-quality-balancer'],
  ['13', 'portica'],
  ['14', 'custom-video-platform'],
  ['15', 'creator-workflow-extension'],
];

const gradient = Buffer.from(`
  <svg width="1200" height="675" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="rail" x1="0" x2="1">
        <stop offset="0" stop-color="#08080a" stop-opacity="1"/>
        <stop offset="0.22" stop-color="#08080a" stop-opacity="0.96"/>
        <stop offset="0.54" stop-color="#08080a" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#rail)"/>
  </svg>`);

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });

  for (const [number, slug] of projects) {
    const logoPath = path.join(sourceDir, `${number}-${slug}-logo.png`);
    const uiPath = path.join(sourceDir, `${number}-${slug}-ui.png`);
    const outputPath = path.join(outputDir, `${slug}.webp`);

    for (const input of [logoPath, uiPath]) {
      if (!fs.existsSync(input)) throw new Error(`Missing source: ${input}`);
    }

    if (fs.existsSync(outputPath) && !replace.has(slug)) {
      console.log(`skip ${slug}: output exists; pass the slug to replace it`);
      continue;
    }

    const logo = await sharp(logoPath)
      .resize(250, 250, { fit: 'inside', withoutEnlargement: true })
      .png()
      .toBuffer();
    const logoMeta = await sharp(logo).metadata();
    const left = Math.round(180 - logoMeta.width / 2);
    const top = Math.round(337.5 - logoMeta.height / 2);

    await sharp(uiPath)
      .resize(1200, 675, { fit: 'cover', position: 'attention' })
      .composite([
        { input: gradient, left: 0, top: 0 },
        { input: logo, left, top },
      ])
      .webp({ quality: 84 })
      .toFile(outputPath);

    const meta = await sharp(outputPath).metadata();
    if (meta.format !== 'webp' || meta.width !== 1200 || meta.height !== 675) {
      throw new Error(`Invalid output contract for ${slug}: ${JSON.stringify(meta)}`);
    }
    console.log(`ok ${slug}: ${meta.width}x${meta.height} ${meta.format}`);
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

- [ ] **Step 3: Run the composer for all fifteen assets**

After applying the Global Constraints runtime setup, run:

```powershell
node '.superpowers\tmp\project-thumbnails\compose.cjs'
```

Expected: one `ok` line for each of the fifteen named project slugs and no sibling project writes. To intentionally replace one reviewed output, pass only that slug, for example `node .superpowers\tmp\project-thumbnails\compose.cjs tableverse`.

- [ ] **Step 4: Verify format and dimensions**

The composer already asserts the contract with `sharp(...).metadata()`. Independently count the outputs:

```powershell
$files = Get-ChildItem 'assets\projects' -File -Filter '*.webp'
if ($files.Count -ne 15) { throw "Expected 15 WebP files, found $($files.Count)." }
```

Expected: exit code 0, fifteen passing assets, and no other files under `assets/projects/`.

- [ ] **Step 5: Build and inspect a contact sheet**

Create a temporary five-column contact sheet from the fifteen final assets, open it, and check the set as one system: logo scale, left-rail consistency, screenshot interest, privacy, no stretching, and no accidental text cropping. Adjust only the offending source framing or logo scale and rerun that asset.

- [ ] **Step 6: Commit the final image assets**

Run:

```powershell
git -c safe.directory='F:/WORK/Creations/CrazyEntertainment' add -- assets/projects/*.webp
git -c safe.directory='F:/WORK/Creations/CrazyEntertainment' commit -m "assets: add project thumbnails"
```

Expected: one commit containing exactly fifteen WebP files and no `.superpowers/`, `.claude/`, or `assets/source/` content.

---

### Task 5: Integrate thumbnails into the work cards

**Files:**

- Modify: `index.html:62-194`
- Modify: `style.css:126-149`

**Interfaces:**

- Consumes: the fifteen stable `assets/projects/*.webp` paths enumerated in the File Map from Task 4.
- Produces: fifteen decorative, lazy-loaded card images using the existing visual container.

- [ ] **Step 1: Run the static integration check before editing**

Run:

```powershell
$html = Get-Content -Raw 'index.html'
$imageRefs = [regex]::Matches($html, '<img class="project-thumbnail" src="assets/projects/[^\"]+\.webp"')
$oldMarks = [regex]::Matches($html, 'data-mark=')
if ($imageRefs.Count -eq 15 -and $oldMarks.Count -eq 0) { throw 'Precondition unexpectedly already satisfied.' }
"Current project image refs: $($imageRefs.Count); current data-mark placeholders: $($oldMarks.Count)"
```

Expected: `0` project image references and `15` `data-mark` placeholders.

- [ ] **Step 2: Replace each placeholder with its matching image**

For each card, replace the current initial-based slate with this exact pattern, substituting the correct stable slug:

```html
<div class="card-visual" aria-hidden="true">
  <img class="project-thumbnail" src="assets/projects/crazy-enhancer.webp" alt="" width="1200" height="675" loading="lazy" decoding="async" />
</div>
```

Maintain the existing card order and use the fifteen File Map slugs one-to-one.

- [ ] **Step 3: Replace placeholder-only CSS with image CSS**

Keep the `.card-visual` aspect ratio, negative card-edge margin, clipping, and border. Remove `.card-visual::before`, `.card-visual::after`, `.card-visual span`, the three `nth-child` visual variables, and the initial hover rule. Add:

```css
.project-thumbnail {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform .35s cubic-bezier(.16,1,.3,1);
}
.card:hover .project-thumbnail { transform: scale(1.025); }
```

- [ ] **Step 4: Run the static integration and file checks**

Run:

```powershell
$html = Get-Content -Raw 'index.html'
$refs = [regex]::Matches($html, 'src="(assets/projects/[^\"]+\.webp)"')
if ($refs.Count -ne 15) { throw "Expected 15 project thumbnail references, found $($refs.Count)." }
if ([regex]::Matches($html, 'data-mark=').Count -ne 0) { throw 'Legacy data-mark placeholders remain.' }
$missing = $refs | ForEach-Object { $_.Groups[1].Value } | Where-Object { -not (Test-Path $_) }
if ($missing) { throw "Missing referenced files: $($missing -join ', ')" }
if ((Get-Content -Raw 'style.css') -notmatch '\.card:hover \.project-thumbnail') { throw 'Thumbnail hover rule is missing.' }
```

Expected: no output and exit code 0.

- [ ] **Step 5: Commit the HTML and CSS integration**

Run:

```powershell
git -c safe.directory='F:/WORK/Creations/CrazyEntertainment' add -- index.html style.css
git -c safe.directory='F:/WORK/Creations/CrazyEntertainment' commit -m "site: show real project thumbnails"
```

Expected: one commit containing only `index.html` and `style.css`.

---

### Task 6: Verify the complete site and clean temporary capture data

**Files:**

- Verify: `index.html`, `style.css`, all fifteen `assets/projects/*.webp`
- Verify unchanged: `privacy.html`, `impressum.html`, `CNAME`, `.nojekyll`
- Remove after successful verification: `.superpowers/tmp/project-thumbnails/`

**Interfaces:**

- Consumes: the integrated site from Tasks 4–5.
- Produces: evidence-backed desktop/mobile verification and a clean worktree apart from pre-existing user-owned untracked content.

- [ ] **Step 1: Start the local site**

Run from the repository root:

```powershell
python -m http.server 8080
```

Expected: `http://localhost:8080/` serves the site, legal pages, and project assets.

- [ ] **Step 2: Check page and asset responses**

Request `/`, `/privacy.html`, `/impressum.html`, and all fifteen project image URLs. Expected: HTTP 200 for every request, `image/webp` for thumbnails, and no browser console errors.

- [ ] **Step 3: Capture required desktop evidence**

Open the local site at 1440 × 900 with `reducedMotion: "reduce"`. Capture the full page plus focused screenshots of the first, middle, and final project-card rows. Check that logos remain readable, screenshots remain meaningful after cropping, and no image delays or broken states are visible.

- [ ] **Step 4: Capture required mobile evidence**

Repeat at 390 × 844 with `reducedMotion: "reduce"`. Check the one-column stack, 16:9 proportions, card-edge clipping, no horizontal overflow, and readable logo rails.

- [ ] **Step 5: Verify protected files and scope**

Run:

```powershell
git -c safe.directory='F:/WORK/Creations/CrazyEntertainment' diff --exit-code e0d4687 -- privacy.html impressum.html CNAME .nojekyll main.js
git -c safe.directory='F:/WORK/Creations/CrazyEntertainment' status --short
```

Expected: the protected-file diff exits 0. Status shows no staged files and only intentional pre-existing untracked paths plus the visual-companion workspace.

- [ ] **Step 6: Remove temporary capture inputs after all checks pass**

Stop any product servers and the local site server. Resolve and verify that the deletion target is exactly `F:\WORK\Creations\CrazyEntertainment\.superpowers\tmp\project-thumbnails`, then remove only that directory. Keep the committed final WebP assets.

- [ ] **Step 7: Run final verification**

Run the Task 5 static integration check again, count `assets/projects/*.webp`, run `git -c safe.directory='F:/WORK/Creations/CrazyEntertainment' diff --check`, and inspect `git -c safe.directory='F:/WORK/Creations/CrazyEntertainment' status --short` plus the last three commits. Expected: fifteen valid references, fifteen assets, no whitespace errors, no unintended staged changes, and plain commit messages without prohibited trailers.
