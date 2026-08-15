# Thumbnail Brand Corrections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct the Syb-L, DumpToTxt, and Custom Video Platform thumbnails with truthful, neutral branding while preserving the approved composition.

**Architecture:** Recompose only the branding regions of the three existing 1200 × 675 WebPs. Restore the canonical background under each old left-side mark, composite canonical project assets or a deterministic neutral SVG, and preserve the existing UI pixels except for the persona-specific Custom Video Platform header identity.

**Tech Stack:** Static site assets, bundled Node.js and Sharp for WebP compositing, bundled Python and Pillow for extracting the largest ICO frame, SVG for the neutral video mark, and the in-app browser for visual verification.

## Global Constraints

- Keep the exact `assets/source/project-thumbnail-background.png` background.
- Keep every final thumbnail at 1200 × 675 in WebP format.
- Add no dependency, framework, build step, or published source asset.
- Modify only the three named WebPs; leave HTML, card order, and all other thumbnails unchanged.
- Keep the Syb-L and DumpToTxt source repositories read-only.
- Remove the `JG` mark and `Johnny Guides` identity from every visible part of the Custom Video Platform thumbnail.
- Do not push or deploy.

---

### Task 1: Record preflight invariants

**Files:**
- Inspect: `assets/source/project-thumbnail-background.png`
- Inspect: `assets/projects/syb-l.webp`
- Inspect: `assets/projects/dump-to-txt.webp`
- Inspect: `assets/projects/custom-video-platform.webp`
- Inspect: `F:\WORK\Creations\Syb-L\design\logo.png`
- Inspect: `F:\WORK\Creations\DumpToTXT\assets\icons\DumpToTxt.ico`

**Interfaces:**
- Consumes: the current final assets and canonical logo sources.
- Produces: hashes and metadata used to prove only the intended files changed.

- [ ] **Step 1: Hash the three current WebPs and every other project thumbnail**

Use PowerShell `Get-FileHash -Algorithm SHA256`; retain the results in the command transcript, not a new repository file.

- [ ] **Step 2: Verify source and output metadata**

Use Sharp to assert the canonical background and three outputs are 1200 × 675. Use Pillow to assert the DumpToTxt ICO contains a 256 × 256 frame. Expected: all checks pass before editing.

- [ ] **Step 3: Snapshot source-repository status**

Run scoped read-only Git status checks for Syb-L and DumpToTXT. Expected: their before-state is recorded and remains identical after composition.

### Task 2: Correct Syb-L and DumpToTxt branding

**Files:**
- Modify: `assets/projects/syb-l.webp`
- Modify: `assets/projects/dump-to-txt.webp`

**Interfaces:**
- Consumes: the canonical background, Syb-L PNG, DumpToTxt ICO, and current right-side UI pixels.
- Produces: two corrected 1200 × 675 WebPs.

- [ ] **Step 1: Prepare canonical logo buffers**

Trim the transparent edge of `F:\WORK\Creations\Syb-L\design\logo.png`, resize it inside a 360 × 360 box, and preserve alpha. Extract the 256 × 256 DumpToTxt ICO frame with Pillow as RGBA PNG data, then resize it inside a 340 × 340 box with high-quality resampling.

- [ ] **Step 2: Recompose each thumbnail**

Start from its current WebP, cover the complete old left branding region with the matching left crop of `project-thumbnail-background.png`, and place the canonical logo centered in that region. Preserve the UI panel and all pixels to its right.

- [ ] **Step 3: Verify the two outputs**

Assert WebP format, 1200 × 675 dimensions, non-empty alpha-composited logo regions, changed SHA-256 hashes, and unchanged hashes for the other sixteen thumbnails.

### Task 3: Neutralize Custom Video Platform branding

**Files:**
- Modify: `assets/projects/custom-video-platform.webp`

**Interfaces:**
- Consumes: the canonical background and current neutral video-library UI.
- Produces: one corrected WebP with a reusable neutral mark embedded in both branding locations.

- [ ] **Step 1: Define the neutral mark as SVG**

Create an in-memory SVG containing a rounded video-frame outline and centered play triangle using the thumbnail cream and coral accents. Include no initials, persona name, or adult branding.

- [ ] **Step 2: Replace both persona-specific regions**

Restore the canonical background beneath the large left `JG` mark, then composite the neutral video mark at comparable visual weight with slight overlap toward the UI. Cover the small `JG` badge and `Johnny Guides` header text with the sampled header background, then place a compact version of the same mark and the neutral label `Video Library`.

- [ ] **Step 3: Verify the output**

Assert WebP format, 1200 × 675 dimensions, changed SHA-256 hash, and unchanged hashes for the other seventeen thumbnails. Visually confirm that neither `JG` nor `Johnny Guides` remains visible.

### Task 4: Verify the site and commit the three assets

**Files:**
- Verify: `index.html`
- Verify: `assets/projects/*.webp`

**Interfaces:**
- Consumes: the corrected assets and existing static site.
- Produces: served-page, desktop, mobile, and Git-scope evidence.

- [ ] **Step 1: Run the complete asset audit**

Assert eighteen unique card mappings, eighteen 1200 × 675 WebPs, zero placeholders, and HTTP 200 for all project images.

- [ ] **Step 2: Capture visual evidence**

Serve the site locally and capture 1440 × 900 and 390 × 844 with reduced motion enabled. Inspect all three corrected cards; confirm no failed images, horizontal overflow, or console errors.

- [ ] **Step 3: Recheck source repositories and protected scope**

Confirm Syb-L and DumpToTXT match their recorded before-state. Confirm no diff in `index.html`, `style.css`, `main.js`, `privacy.html`, `impressum.html`, `CNAME`, `.nojekyll`, or the other fifteen thumbnails.

- [ ] **Step 4: Commit only the corrected WebPs**

```powershell
git add assets/projects/syb-l.webp assets/projects/dump-to-txt.webp assets/projects/custom-video-platform.webp
git commit -m "assets: correct project thumbnail branding"
```

