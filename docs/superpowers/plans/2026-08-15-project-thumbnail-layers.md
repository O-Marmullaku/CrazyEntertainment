# Project Thumbnail Layers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all eighteen flattened project thumbnails with exactly three independently editable, live-layered assets per project and add independent icon/UI hover expansion.

**Architecture:** Each project receives an opaque themed 1200 × 675 background plus tightly cropped transparent icon and UI WebPs. Static HTML positions the two foreground assets with CSS custom properties; CSS performs all composition and pointer interaction, so the public site needs no JavaScript, dependency, or build step.

**Tech Stack:** Plain HTML and CSS, bundled Node.js and Sharp for offline asset authoring, bundled Python and Pillow for ICO extraction, browser-based responsive verification, PowerShell for read-only source inventory, and Git for scoped commits.

## Global Constraints

- Keep the site plain HTML, CSS, and vanilla JavaScript with no new dependency or public build step.
- Keep every published asset path relative.
- Give each project slug listed in Task 1 its own directory under `assets/projects`, containing exactly `background.webp`, `ui.webp`, and `icon.webp`.
- Keep all backgrounds opaque 1200 × 675 WebPs; keep icons and UIs tightly cropped with transparent edges.
- Remove the eighteen existing flattened WebPs directly under `assets/projects` only after the layered site passes verification.
- Preserve truthful UI, canonical repository icons, the corrected Syb-L and DumpToTxt marks, and the neutral Custom Video Platform mark.
- Keep all source product repositories read-only and compare their before/after state.
- Keep `privacy.html`, `impressum.html`, `CNAME`, `.nojekyll`, and unrelated user files unchanged.
- Do not push or deploy.

---

### Task 1: Create the source ledger and failing asset verifier

**Files:**
- Create temporarily outside the repository: `C:\Users\osi_c\AppData\Local\Temp\crazy-entertainment-thumbnail-layers\source-ledger-before.json`
- Create temporarily outside the repository: `C:\Users\osi_c\AppData\Local\Temp\crazy-entertainment-thumbnail-layers\verify-assets.cjs`
- Inspect: `assets/projects/*.webp`
- Inspect: `assets/source/project-thumbnail-background.png`

**Interfaces:**
- `verify-assets.cjs <repo-root>` exits 0 only when there are eighteen known project directories, exactly three WebPs per directory, valid dimensions/alpha, unique themed backgrounds, and a total payload at most 3 MB.
- The ledger records Git status for Git repositories and sorted inventory hashes for non-Git repositories.

- [ ] **Step 1: Write the failing asset verifier**

Encode the exact ordered slug list from `index.html`:

```text
coachlexy, tableverse, syb-l, videoqualitybalancer,
crazy-enhancer-youtube, dorfkoenig, apollo-dual-screen,
axiom-calculator, token-measurer, reviewer-3000, dump-to-txt,
micbridge, proteaser-studio, portica, custom-video-platform,
creator-workflow-extension, fuckingshareit, desktop-edge-arranger
```

For each slug require only `background.webp`, `ui.webp`, and `icon.webp`. Require background metadata `webp`, 1200 × 675, no alpha; require non-zero icon/UI dimensions and alpha; require eighteen distinct background SHA-256 hashes; require total bytes at most 3,145,728.

- [ ] **Step 2: Run the verifier and confirm it fails**

Expected: failure listing the eighteen absent project directories.

- [ ] **Step 3: Snapshot source state**

Record the before-state for these folders without modifying them:

```text
CoachLexy, Cards, Syb-L, VideoQualityBalancer, CrazyYoutube,
SwissGeoGuessr, CrazyApolloAndMoonlightQT, Ti-30x pro,
token-measurer, Reviewer-3000, DumpToTXT, MicBridge, PTC,
Portfolio-3000, AdultVideoPlayer, OFEnhancer, FuckingShareIT,
Desktop-Edge-Arranger-v1.0.6
```

- [ ] **Step 4: Record current flattened hashes and protected-file hashes**

Retain the values in the temporary ledger so later verification proves the foreground migration changed only authorized website files.

### Task 2: Build the three-project layer calibration

**Files:**
- Create: `assets/projects/coachlexy/background.webp`
- Create: `assets/projects/coachlexy/ui.webp`
- Create: `assets/projects/coachlexy/icon.webp`
- Create: `assets/projects/syb-l/background.webp`
- Create: `assets/projects/syb-l/ui.webp`
- Create: `assets/projects/syb-l/icon.webp`
- Create: `assets/projects/apollo-dual-screen/background.webp`
- Create: `assets/projects/apollo-dual-screen/ui.webp`
- Create: `assets/projects/apollo-dual-screen/icon.webp`
- Create temporarily outside the repository: `C:\Users\osi_c\AppData\Local\Temp\crazy-entertainment-thumbnail-layers\compose-preview.cjs`

**Interfaces:**
- `makeBackground(tintHex: string): Promise<Buffer>` preserves canonical luminance and technical geometry and returns one opaque 1200 × 675 WebP.
- `extractUi(flattenedPath: string, backgroundPath: string, region: Rect): Promise<{buffer: Buffer, box: Rect}>` returns a tight transparent WebP and its canvas position.
- `prepareIcon(source: string | Buffer): Promise<Buffer>` trims transparent edges and returns a high-quality transparent WebP.
- `composePreview({background, ui, icon, uiBox, iconBox}): Promise<Buffer>` renders a 1200 × 675 reference for visual comparison only.

- [ ] **Step 1: Implement background tinting and alpha-safe foreground extraction**

Use the canonical background as the structural source. Preserve luminance and recolor chroma toward the approved tint. For UI extraction, compare the approved flattened thumbnail against the canonical background, reject compression noise, preserve opaque UI interiors, feather only antialiased edges, and crop transparent bounds.

- [ ] **Step 2: Generate green, amber, and blue calibration sets**

- CoachLexy: tint `#0d2a1a`; icon `F:\WORK\Creations\CoachLexy\apps\coach\assets\images\icon.png`.
- Syb-L: tint `#2b1b08`; icon `F:\WORK\Creations\Syb-L\design\logo.png`.
- Apollo: tint `#081d32`; icon `F:\WORK\Creations\CrazyApolloAndMoonlightQT\Vibepollo\src_assets\common\assets\web\public\images\logo-apollo.svg`.

- [ ] **Step 3: Render offline previews and inspect them**

Expected: no old-teal rectangle or edge halo; icon and UI remain independently movable; tint is visible but restrained; composition and source fidelity remain recognizable.

- [ ] **Step 4: Run the asset verifier**

Expected: these three slugs pass while the verifier reports the other fifteen missing directories.

### Task 3: Generate the remaining fifteen themed backgrounds

**Files:**
- Create: `assets/projects/tableverse/background.webp`
- Create: `assets/projects/videoqualitybalancer/background.webp`
- Create: `assets/projects/crazy-enhancer-youtube/background.webp`
- Create: `assets/projects/dorfkoenig/background.webp`
- Create: `assets/projects/axiom-calculator/background.webp`
- Create: `assets/projects/token-measurer/background.webp`
- Create: `assets/projects/reviewer-3000/background.webp`
- Create: `assets/projects/dump-to-txt/background.webp`
- Create: `assets/projects/micbridge/background.webp`
- Create: `assets/projects/proteaser-studio/background.webp`
- Create: `assets/projects/portica/background.webp`
- Create: `assets/projects/custom-video-platform/background.webp`
- Create: `assets/projects/creator-workflow-extension/background.webp`
- Create: `assets/projects/fuckingshareit/background.webp`
- Create: `assets/projects/desktop-edge-arranger/background.webp`

**Interfaces:**
- Consumes: `makeBackground` and the exact approved tint table.
- Produces: eighteen distinct backgrounds that share geometry and luminance.

- [ ] **Step 1: Generate the remaining backgrounds**

```text
tableverse #0f261d
videoqualitybalancer #2c2008
crazy-enhancer-youtube #2a0d0e
dorfkoenig #2a1011
axiom-calculator #0a2230
token-measurer #0a2036
reviewer-3000 #191331
dump-to-txt #142027
micbridge #0e281f
proteaser-studio #0a1c33
portica #111a39
custom-video-platform #2b1510
creator-workflow-extension #131932
fuckingshareit #2c0f1c
desktop-edge-arranger #0a2130
```

- [ ] **Step 2: Verify background invariants**

Assert eighteen unique hashes, 1200 × 675 dimensions, no alpha, each file at most 100 KB, and grayscale luminance within mean absolute difference 4 of the canonical background.

### Task 4: Produce all canonical icon layers

**Files:**
- Create: `assets/projects/tableverse/icon.webp`
- Create: `assets/projects/videoqualitybalancer/icon.webp`
- Create: `assets/projects/crazy-enhancer-youtube/icon.webp`
- Create: `assets/projects/dorfkoenig/icon.webp`
- Create: `assets/projects/axiom-calculator/icon.webp`
- Create: `assets/projects/token-measurer/icon.webp`
- Create: `assets/projects/reviewer-3000/icon.webp`
- Create: `assets/projects/dump-to-txt/icon.webp`
- Create: `assets/projects/micbridge/icon.webp`
- Create: `assets/projects/proteaser-studio/icon.webp`
- Create: `assets/projects/portica/icon.webp`
- Create: `assets/projects/custom-video-platform/icon.webp`
- Create: `assets/projects/creator-workflow-extension/icon.webp`
- Create: `assets/projects/fuckingshareit/icon.webp`
- Create: `assets/projects/desktop-edge-arranger/icon.webp`

**Interfaces:**
- Consumes: repository-owned identities or deterministic approved neutral marks.
- Produces: one tight transparent icon WebP per project.

- [ ] **Step 1: Convert repository-owned identities**

Use these exact sources:

```text
tableverse: .superpowers/tmp/project-thumbnails/03-tableverse-logo.png
videoqualitybalancer: F:\WORK\Creations\VideoQualityBalancer\docs\design\logo.png
crazy-enhancer-youtube: F:\WORK\Creations\CrazyYoutube\firefox-extension\icons\icon-source.png
dorfkoenig: F:\WORK\Creations\SwissGeoGuessr\public\icons\icon-512.png
axiom-calculator: F:\WORK\Creations\Ti-30x pro\assets\icons\icon-512.png
token-measurer: F:\WORK\Creations\token-measurer\app-icon.png
dump-to-txt: F:\WORK\Creations\DumpToTXT\assets\screenshots\program-cover.png
creator-workflow-extension: F:\WORK\Creations\OFEnhancer\store-listing\brand-master.png
fuckingshareit: F:\WORK\Creations\FuckingShareIT\src\FuckingShareIT\app.ico
```

Extract the largest ICO frame with Pillow where needed. Trim alpha, preserve aspect ratio, and export WebP with alpha.

- [ ] **Step 2: Recreate approved neutral marks deterministically**

Create SVG buffers matching the approved Reviewer 3000 `R3`, MicBridge microphone/signal, ProTeaser `TC`, Portica `P`, Custom Video frame/play, and Desktop Edge arrows/center-square marks. Render tight transparent WebPs; introduce no new identity.

- [ ] **Step 3: Verify icon isolation**

Assert every icon has alpha, transparent corners, visible coverage between 10% and 90% of its canvas, and no old-background rectangle.

### Task 5: Produce all UI layers and layout geometry

**Files:**
- Create: `assets/projects/tableverse/ui.webp`
- Create: `assets/projects/videoqualitybalancer/ui.webp`
- Create: `assets/projects/crazy-enhancer-youtube/ui.webp`
- Create: `assets/projects/dorfkoenig/ui.webp`
- Create: `assets/projects/axiom-calculator/ui.webp`
- Create: `assets/projects/token-measurer/ui.webp`
- Create: `assets/projects/reviewer-3000/ui.webp`
- Create: `assets/projects/dump-to-txt/ui.webp`
- Create: `assets/projects/micbridge/ui.webp`
- Create: `assets/projects/proteaser-studio/ui.webp`
- Create: `assets/projects/portica/ui.webp`
- Create: `assets/projects/custom-video-platform/ui.webp`
- Create: `assets/projects/creator-workflow-extension/ui.webp`
- Create: `assets/projects/fuckingshareit/ui.webp`
- Create: `assets/projects/desktop-edge-arranger/ui.webp`
- Create temporarily outside the repository: `C:\Users\osi_c\AppData\Local\Temp\crazy-entertainment-thumbnail-layers\layouts.json`

**Interfaces:**
- `layouts.json` maps each slug to `iconX`, `iconY`, `iconW`, `uiX`, `uiY`, and `uiW` percentages.
- UI content comes from the approved flattened thumbnail or a higher-resolution repository-owned image of the same scene.

- [ ] **Step 1: Extract every UI scene from its approved thumbnail**

Use the calibrated matte. Preserve product text and frames. Where a scene contains multiple devices, keep space between them transparent rather than embedding the old background.

- [ ] **Step 2: Record tight bounds as percentage geometry**

Convert each layer's canvas coordinates to percentages of 1200 × 675. Preserve the approved ratio and controlled icon/UI overlap.

- [ ] **Step 3: Render and inspect eighteen offline previews**

Confirm no wrong icon, old-background box, clipped edge, private content, or over-strong tint.

- [ ] **Step 4: Run the asset verifier**

Expected: `18 projects, 54 layer assets, dimensions/alpha/payload verified`.

- [ ] **Step 5: Commit the layer assets**

```powershell
git add assets/projects/*/background.webp assets/projects/*/ui.webp assets/projects/*/icon.webp
git commit -m "assets: split project thumbnails into layers"
```

### Task 6: Integrate live layering and independent hover behavior

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Delete: `assets/projects/*.webp`
- Create temporarily outside the repository: `C:\Users\osi_c\AppData\Local\Temp\crazy-entertainment-thumbnail-layers\verify-integration.cjs`

**Interfaces:**
- Every `.project-thumbnail` stage exposes `--icon-x`, `--icon-y`, `--icon-w`, `--ui-x`, `--ui-y`, and `--ui-w`.
- `.thumbnail-layer--icon` and `.thumbnail-layer--ui` are independent pointer targets.

- [ ] **Step 1: Write and run the failing integration verifier**

Require eighteen stages, three image children per stage, fifty-four unique relative paths, six eager images in the first two cards, forty-eight lazy images elsewhere, and zero flattened references. Expected: failure against current one-image markup.

- [ ] **Step 2: Replace every flattened image with the three-layer structure**

Use each asset's intrinsic dimensions and the six values from `layouts.json`. Keep the existing `aria-hidden="true"` container.

- [ ] **Step 3: Replace whole-thumbnail zoom with independent layer hover CSS**

Within `@media (hover: hover) and (pointer: fine)`, scale/lift only the hovered UI or icon and raise its `z-index`. Use icon scale `1.08`, UI scale `1.035`, and short spring-like easing. Never transform the background.

- [ ] **Step 4: Add reduced-motion and touch safeguards**

Under `prefers-reduced-motion: reduce`, disable layer transitions/transforms. Outside the hover media query, keep layers static.

- [ ] **Step 5: Run the integration verifier**

Expected: `18 live layered thumbnails and 54 relative assets verified`.

- [ ] **Step 6: Delete flattened files and commit integration**

```powershell
git add index.html style.css assets/projects
git commit -m "site: layer project thumbnail interactions"
```

### Task 7: Verify responsive behavior and source integrity

**Files:**
- Verify: `index.html`
- Verify: `style.css`
- Verify: `assets/projects/*/*`

**Interfaces:**
- Consumes: finished site, both verifiers, before ledger, and browser runtime.
- Produces: requirement-by-requirement completion evidence.

- [ ] **Step 1: Run static and HTTP audits**

Run both verifiers and `git diff --check`; assert 54 layer responses plus `/`, `privacy.html`, and `impressum.html` return HTTP 200; confirm total payload at most 3 MB.

- [ ] **Step 2: Verify independent hover transforms at 1440 × 900**

Move over an icon and confirm only its computed transform changes. Move over the UI and confirm only the UI transform changes. Repeat on overlap and non-overlap cards. Confirm background transform never changes.

- [ ] **Step 3: Capture desktop and mobile with reduced motion**

Capture 1440 × 900 and 390 × 844. Inspect all eighteen cards, themed backgrounds, alignment, lazy loading, and clipping. Confirm zero overflow and no browser console/network errors.

- [ ] **Step 4: Recheck source/protected state and Git scope**

Compare all source folders with the before ledger. Confirm protected and unrelated files are unchanged. Confirm history contains only design/plan, 54 layers, `index.html`, `style.css`, and flattened-file deletions. Do not push or deploy.
