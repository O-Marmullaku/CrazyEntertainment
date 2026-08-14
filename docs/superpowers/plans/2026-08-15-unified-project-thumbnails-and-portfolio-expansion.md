# Unified Project Thumbnails and Portfolio Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a verified eighteen-card portfolio whose thumbnails all use one canonical Tableverse-derived background, real project identities, and truthful product scenes.

**Architecture:** A temporary offline asset workspace holds source captures, a manifest, and deterministic Sharp compositing scripts. One canonical 1200 × 675 PNG supplies every background; project logos and UI captures are layered over it and exported as WebP. The published site remains plain HTML and CSS and loads one final image per card.

**Tech Stack:** Static HTML/CSS/vanilla JavaScript, the bundled Node.js runtime and bundled Sharp module for offline image compositing, the in-app browser for safe local captures, PowerShell for read-only repository inspection, and Git for scoped commits.

## Global Constraints

- Keep `privacy.html`, `impressum.html`, `CNAME`, and `.nojekyll` intact.
- Keep every published URL relative.
- Add no site dependency, framework, or build step.
- Keep all eighteen source product repositories read-only and compare their Git status before and after capture.
- Use only real logos, app icons, running interfaces, repository-owned screenshots, native fixtures, or real command output.
- Use no generative application UI.
- Publish no private CoachLexy research, personal account data, explicit media, creator identity, credential, token, email, or local path.
- Use the exact canonical background for every thumbnail; project-specific color belongs only to the logo and UI.
- Export every final thumbnail as a 1200 × 675 WebP under `assets/projects/`.
- Do not push or deploy.

---

### Task 1: Record source safety state and create the asset manifest

**Files:**
- Create: `.superpowers/tmp/project-thumbnails/source-status-before.json`
- Create: `.superpowers/tmp/project-thumbnails/manifest.json`
- Create: `.superpowers/tmp/project-thumbnails/verify-manifest.cjs`

**Interfaces:**
- Consumes: the eighteen source folders listed in the approved design.
- Produces: one manifest entry per card with `slug`, `displayName`, `repo`, `logoSource`, `sceneSource`, `captureMethod`, `output`, and `safetyNotes`.

- [ ] **Step 1: Write the failing manifest verifier**

The verifier must assert exactly eighteen unique slugs, the featured prefix `coachlexy, tableverse, syb-l, videoqualitybalancer`, absolute source paths, relative output paths under `assets/projects/`, and non-empty safety notes for CoachLexy, Custom Video Platform, Creator Workflow Extension, YouTube, and Desktop Edge Arranger.

- [ ] **Step 2: Run the verifier and confirm it fails**

Run:

```powershell
& $node .superpowers\tmp\project-thumbnails\verify-manifest.cjs
```

Expected: failure because `manifest.json` does not yet contain eighteen complete entries.

- [ ] **Step 3: Snapshot each repository and write the manifest**

Capture `git status --short` for Git repositories and a sorted file inventory hash for non-Git folders. Record only paths and status text, never file contents or private data.

- [ ] **Step 4: Run the manifest verifier**

Expected: `18 thumbnail manifest entries verified`.

---

### Task 2: Freeze the canonical background and calibrate Tableverse plus VideoQualityBalancer

**Files:**
- Create: `assets/source/project-thumbnail-background.png`
- Create: `.superpowers/tmp/project-thumbnails/thumbnail-kit.cjs`
- Create: `.superpowers/tmp/project-thumbnails/compose-calibration.cjs`
- Create: `.superpowers/tmp/project-thumbnails/verify-calibration.cjs`
- Modify: `assets/projects/tableverse.webp`
- Modify: `assets/projects/videoqualitybalancer.webp`

**Interfaces:**
- `renderThumbnail({ background, logo, scene, output, logoBox, sceneBox, overlap }): Promise<void>` writes one 1200 × 675 WebP.
- `sceneBox` is frozen to the approved Tableverse frame footprint for every product.

- [ ] **Step 1: Write the failing calibration verifier**

Assert that the canonical PNG is 1200 × 675, both final WebPs are 1200 × 675, the compositor references the same canonical background for both, the scene rectangle is identical, the logo layer follows the UI layer when overlap is enabled, and sampled uncovered background regions match the canonical source within a mean absolute RGB difference of 3.

- [ ] **Step 2: Run the verifier and confirm it fails**

Expected: failure because the two existing images were made from separate backgrounds.

- [ ] **Step 3: Build the canonical backdrop**

Recreate the approved Tableverse dark teal gradient, dot clusters, and thin circuit lines as one lossless PNG. Do not include a logo, UI frame, title, or product-specific glow.

- [ ] **Step 4: Implement the common compositor and regenerate both images**

Use the isolated sources already stored as:

```text
.superpowers/tmp/project-thumbnails/03-tableverse-logo.png
.superpowers/tmp/project-thumbnails/03-tableverse-ui.png
.superpowers/tmp/project-thumbnails/12-videoqualitybalancer-logo.png
.superpowers/tmp/project-thumbnails/12-videoqualitybalancer-ui.png
```

Preserve the approved large-logo proportions and allow the VideoQualityBalancer database cylinder to overlap the UI seam.

- [ ] **Step 5: Run the calibration verifier**

Expected: `canonical background and two calibration thumbnails verified`.

- [ ] **Step 6: Capture the two cards together at desktop and mobile sizes**

Save verification screenshots in `.superpowers/tmp/project-thumbnails/verification/`.

- [ ] **Step 7: Commit only the calibration assets**

```powershell
git add assets/source/project-thumbnail-background.png assets/projects/tableverse.webp assets/projects/videoqualitybalancer.webp
git commit -m "assets: unify project thumbnail background"
```

---

### Task 3: Produce CoachLexy, Syb-L, FuckingShareIT, and Desktop Edge Arranger thumbnails

**Files:**
- Create: `.superpowers/tmp/project-thumbnails/<slug>-logo.png`
- Create: `.superpowers/tmp/project-thumbnails/<slug>-ui.png`
- Create: `assets/projects/coachlexy.webp`
- Create: `assets/projects/syb-l.webp`
- Create: `assets/projects/fuckingshareit.webp`
- Create: `assets/projects/desktop-edge-arranger.webp`
- Update: `.superpowers/tmp/project-thumbnails/manifest.json`

**Interfaces:**
- Consumes: `renderThumbnail` and the canonical background from Task 2.
- Produces: four verified final WebPs and source-attribution entries in the manifest.

- [ ] **Step 1: Add four failing output assertions to the manifest verifier**

For each slug, require existing logo/UI sources, a final 1200 × 675 WebP, and the canonical-background identifier.

- [ ] **Step 2: Run the verifier and confirm the four missing outputs fail**

- [ ] **Step 3: Capture safe, truthful sources**

- CoachLexy: use the real app icon or safe Lexy avatar and a checked-in synthetic mobile product screen. Exclude `.private`, `Design/rewards`, internal harness media, and real transcript content.
- Syb-L: read its repository contract, then use the real app icon and newest real call/product screenshot or launch-safe fixture.
- FuckingShareIT: use `src/FuckingShareIT/app.ico` and the verified `artifacts/dashboard-release.png`; do not resume the halted product or change Windows sharing state.
- Desktop Edge Arranger: use a restrained `DEA` monogram only if no mark exists; pair it with real safe test/command output or a disposable neutral-profile capture. Never run it against the founder's desktop.

- [ ] **Step 4: Render the four thumbnails through the common compositor**

- [ ] **Step 5: Run the verifier**

Expected: all four outputs pass source, size, and background checks.

- [ ] **Step 6: Commit only these four final assets**

```powershell
git add assets/projects/coachlexy.webp assets/projects/syb-l.webp assets/projects/fuckingshareit.webp assets/projects/desktop-edge-arranger.webp
git commit -m "assets: add featured and new project thumbnails"
```

---

### Task 4: Produce browser and web product thumbnails

**Files:**
- Create: `assets/projects/crazy-enhancer-youtube.webp`
- Create: `assets/projects/dorfkoenig.webp`
- Create: `assets/projects/reviewer-3000.webp`
- Create: `assets/projects/portica.webp`
- Create: `assets/projects/custom-video-platform.webp`
- Create: `assets/projects/creator-workflow-extension.webp`
- Update: `.superpowers/tmp/project-thumbnails/manifest.json`

**Interfaces:**
- Consumes: the common compositor, canonical background, and safe local browser captures.
- Produces: six final WebPs.

- [ ] **Step 1: Add six failing output assertions and run the verifier**

Expected: failure listing the six absent assets.

- [ ] **Step 2: Inspect each owning repository contract before launch**

Use the repository's documented start command. If launch is unsafe or unavailable, use the newest repository-owned screenshot or native fixture.

- [ ] **Step 3: Capture the real product scenes**

- Crazy Enhancer: signed-out/demo-safe YouTube with the actual extension controls visible.
- Dorfkönig: real village round with photograph and map interface.
- Reviewer 3000: fixture-backed film/book/game review view.
- Portica: builder plus rendered portfolio preview.
- Custom Video Platform: real player/catalogue with neutral safe media and no explicit text.
- Creator Workflow Extension: real settings or masking interface with synthetic identities.

- [ ] **Step 4: Render all six assets and run the verifier**

- [ ] **Step 5: Commit only the six final assets**

```powershell
git add assets/projects/crazy-enhancer-youtube.webp assets/projects/dorfkoenig.webp assets/projects/reviewer-3000.webp assets/projects/portica.webp assets/projects/custom-video-platform.webp assets/projects/creator-workflow-extension.webp
git commit -m "assets: add web project thumbnails"
```

---

### Task 5: Produce remaining desktop and cross-platform thumbnails

**Files:**
- Create: `assets/projects/apollo-dual-screen.webp`
- Create: `assets/projects/axiom-calculator.webp`
- Create: `assets/projects/token-measurer.webp`
- Create: `assets/projects/dump-to-txt.webp`
- Create: `assets/projects/micbridge.webp`
- Create: `assets/projects/proteaser-studio.webp`
- Update: `.superpowers/tmp/project-thumbnails/manifest.json`

**Interfaces:**
- Consumes: the common compositor and repository-safe screenshots or launch states.
- Produces: six final WebPs.

- [ ] **Step 1: Add six failing output assertions and run the verifier**

- [ ] **Step 2: Inspect each repository contract and choose the safest truthful source**

- Apollo: real dual-pane Moonlight composition or newest verified screenshot.
- Axiom: real calculator screen with a meaningful MathPrint expression.
- Token Measurer: real populated meter/tray state without private usage paths.
- DumpToTxt: real selected-folder or output-summary state using a disposable fixture folder.
- MicBridge: real connected/active main interface using synthetic device names.
- ProTeaser Studio: real populated waveform/timeline using demo-safe media.

- [ ] **Step 3: Render all six assets and run the verifier**

- [ ] **Step 4: Commit only the six final assets**

```powershell
git add assets/projects/apollo-dual-screen.webp assets/projects/axiom-calculator.webp assets/projects/token-measurer.webp assets/projects/dump-to-txt.webp assets/projects/micbridge.webp assets/projects/proteaser-studio.webp
git commit -m "assets: add desktop project thumbnails"
```

---

### Task 6: Integrate all eighteen cards and the three new projects

**Files:**
- Modify: `index.html`
- Modify: `style.css` only if the existing thumbnail rules need a first-row loading or clipping adjustment
- Create: `.superpowers/tmp/project-thumbnails/verify-site-integration.cjs`

**Interfaces:**
- Consumes: the eighteen filenames in the manifest.
- Produces: eighteen ordered cards with one image each and a product count of 18.

- [ ] **Step 1: Write the failing site integration verifier**

Assert eighteen `<article class="card reveal">` elements, the exact featured heading prefix, eighteen unique project image paths, zero `data-mark` attributes, product count `18`, eager first-row images, lazy remaining images, and relative paths only.

- [ ] **Step 2: Run it and confirm it fails against the current fifteen-card page**

- [ ] **Step 3: Reorder existing cards and add the three repository-grounded cards**

Use the exact order and product summaries from the approved specification. Preserve company voice and existing card markup.

- [ ] **Step 4: Replace every remaining visual slate with its image**

Use empty `alt`, width `1200`, height `675`, and `decoding="async"`. Omit `loading="lazy"` only for CoachLexy and Tableverse.

- [ ] **Step 5: Change every public product count from 15 to 18**

Search HTML, CSS, JavaScript, and public legal pages before editing. Do not change frozen context history merely to rewrite its historical record.

- [ ] **Step 6: Run the integration verifier**

Expected: `18 ordered project cards verified`.

- [ ] **Step 7: Commit the site integration**

```powershell
git add index.html style.css
git commit -m "site: feature eighteen project thumbnails"
```

---

### Task 7: Verify the complete rollout and source-repository integrity

**Files:**
- Create: `.superpowers/tmp/project-thumbnails/verification/desktop-1440x900.jpg`
- Create: `.superpowers/tmp/project-thumbnails/verification/mobile-390x844.jpg`
- Create: `.superpowers/tmp/project-thumbnails/source-status-after.json`

**Interfaces:**
- Consumes: the finished static site, manifest, and before-status ledger.
- Produces: visual evidence and a clean verification report.

- [ ] **Step 1: Run every local verifier**

```powershell
& $node .superpowers\tmp\project-thumbnails\verify-manifest.cjs
& $node .superpowers\tmp\project-thumbnails\verify-calibration.cjs
& $node .superpowers\tmp\project-thumbnails\verify-site-integration.cjs
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 2: Verify dimensions and HTTP responses**

Assert eighteen 1200 × 675 WebPs and HTTP 200 for `/`, every image, `privacy.html`, and `impressum.html`.

- [ ] **Step 3: Capture desktop and mobile evidence with reduced motion**

Use 1440 × 900 and 390 × 844. Inspect the first four featured cards, several mid-grid cards, and both new trailing cards. Confirm no horizontal overflow and no browser console or network errors.

- [ ] **Step 4: Compare source states**

Generate the after ledger and compare it with the before ledger. Any difference caused by capture must be removed or reported before completion.

- [ ] **Step 5: Verify protected files and Git scope**

Confirm no diff for `privacy.html`, `impressum.html`, `CNAME`, or `.nojekyll`, unless a required public count correction was explicitly recorded. Confirm `.claude/`, `.superpowers/`, and unrelated user assets are not staged.

- [ ] **Step 6: Report the result without pushing or deploying**

Include final asset count, verification results, source-repository integrity, commit list, and the local preview URL.
