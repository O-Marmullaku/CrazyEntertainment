# Unified Project Thumbnails and Portfolio Expansion

## Goal

Finish the Crazy Entertainment work grid as an eighteen-product portfolio. Every card receives a truthful thumbnail built from the product's own identity and a real or repository-owned product scene. CoachLexy, Tableverse, Syb-L, and VideoQualityBalancer lead the grid.

This specification supersedes the 2026-08-14 thumbnail specification wherever the two differ, especially background color, project count, ordering, and approval flow.

## Calibration gate

The first implementation milestone is a two-thumbnail calibration:

1. Recreate the approved Tableverse backdrop as one clean 1200 × 675 canonical background asset at `assets/source/project-thumbnail-background.png`.
2. Recompose Tableverse from its isolated logo and real chess interface on that background.
3. Recompose VideoQualityBalancer from its isolated logo and real Creator interface on the same background.
4. Freeze the background and composition geometry only after those two outputs match as one visual system.
5. Use the frozen background and geometry for every other project without project-specific background changes.

The background is literally shared source material, not a color approximation made independently for each thumbnail.

## Frozen composition system

- Canvas: 1200 × 675 WebP.
- Background: the canonical Tableverse-derived dark teal technical backdrop, including the same dot clusters and thin circuit-like line work.
- Logo: the repository's real logo or app icon, large on the left. A controlled overlap with the UI frame is allowed and preferred when it joins the composition.
- Interface: the real product scene occupies the same visual footprint as the approved Tableverse UI frame on the center-right.
- Layer order: background, framed UI, then logo where overlap is used.
- Project color: preserved in the real logo and interface only. The shared background never changes by project.
- No project title, status, or marketing copy is baked into the image.
- Logos and interfaces are cropped proportionally and are never stretched.

Portrait mobile interfaces may use two or three real device screens within the standard UI footprint. Non-visual utilities may use a repository-owned screenshot, native test fixture, or real command output. A restrained monogram is permitted only when the project has no logo or icon.

## Source hierarchy

For each product, use the first available truthful source:

1. Existing repository logo or app icon.
2. A staged capture of the running product using synthetic or demo-safe data.
3. The newest representative screenshot checked into the repository.
4. A repository-owned preview, mockup, fixture, or test artifact that accurately represents implemented behavior.
5. A restrained monogram only when no identity asset exists.

Do not generate or invent application interfaces. Source repositories remain read-only.

## Portfolio order and card data

The work grid contains eighteen cards in this order:

1. CoachLexy
2. Tableverse
3. Syb-L
4. VideoQualityBalancer
5. Crazy Enhancer for YouTube
6. Dorfkönig
7. Apollo Dual-Screen
8. Axiom Calculator Platform
9. Token Measurer
10. Reviewer 3000
11. DumpToTxt
12. MicBridge
13. ProTeaser Studio
14. Portica
15. Custom Video Platform
16. Creator Workflow Extension
17. FuckingShareIT
18. Desktop Edge Arranger

Existing card copy and relative order are preserved except for the four featured products. New cards use concise company-voice descriptions grounded in their repositories:

- **CoachLexy** — Mobile · Fitness & AI, In dev. A local-first fitness and nutrition coach with fast logging, an event-sourced ledger, and a model-driven conversational layer that can verify claims and act only through validated tools.
- **FuckingShareIT** — Desktop · Systems, Prototype. A native Windows utility that absorbs SMB, account, firewall, and credential complexity behind a visible, reversible LAN-sharing workflow.
- **Desktop Edge Arranger** — Windows utility, Beta. A one-shot PowerShell tool that arranges desktop icons around the edges while changing only Explorer's visual coordinates and leaving files untouched.

The site product count changes from 15 to 18 wherever it appears.

## Capture map

| Project | Identity | Product scene |
|---|---|---|
| CoachLexy | Real app icon or safe Lexy avatar | Real mobile chat plus workout/food state using synthetic checked-in data; no private research media or transcript |
| Tableverse | Existing club/king logo | Real active chess table and chat |
| Syb-L | Existing app icon | Real calm call, voice, video, or screen-sharing interface |
| VideoQualityBalancer | Existing clapperboard/database logo | Real source-versus-encode Creator workstation and timeline |
| Crazy Enhancer for YouTube | Extension icon | Signed-out or demo-safe YouTube player with the extension's added controls visible |
| Dorfkönig | App/PWA icon | Real village round with photograph and map-guessing interface |
| Apollo Dual-Screen | Existing icon when available | Two real remote desktop panes in one composed window |
| Axiom Calculator Platform | Calculator icon | Real calculator interface with a meaningful MathPrint expression |
| Token Measurer | App/tray icon | Real populated usage pill and tray meter |
| Reviewer 3000 | Existing mark when available | Populated film, book, and game review interface using fixtures |
| DumpToTxt | Application icon | Real folder selection, packing controls, or output summary |
| MicBridge | Microphone/tray artwork | Real connected device and audio interface |
| ProTeaser Studio | Existing mark when available | Real populated waveform and teaser timeline |
| Portica | App icon or brand mark | Real builder beside its rendered portfolio preview |
| Custom Video Platform | Safe project mark or neutral monogram | Real player/catalogue using neutral media and no explicit or identifying content |
| Creator Workflow Extension | Extension/store icon | Real masking/settings interface with synthetic identities only |
| FuckingShareIT | Real application icon | Repository-owned verified dashboard screenshot |
| Desktop Edge Arranger | Restrained monogram unless a real mark is found | Safe repository-owned test output or neutral disposable-profile capture; never the founder's real desktop |

## Privacy and safety

- Never publish private names, accounts, emails, local paths, tokens, messages, production records, or user media.
- CoachLexy uses only checked-in synthetic product data. Private research transcripts, internal reward images, internal harness media, and the founder's device data are excluded.
- Custom Video Platform contains no adult imagery or explicit text.
- Creator Workflow Extension contains no creator or audience identity.
- YouTube is captured signed out or with all account information absent.
- Desktop Edge Arranger is never run against the founder's real desktop for a screenshot.

## Site integration

- Store final assets under `assets/projects/` using stable lowercase hyphenated filenames.
- Replace all remaining placeholder visuals with decorative `<img>` elements inside the existing card containers.
- Keep paths relative and preserve the static HTML/CSS/vanilla-JS architecture.
- Load the first-row CoachLexy and Tableverse thumbnails immediately; lazy-load later thumbnails with asynchronous decoding.
- Update the product count to 18 and add the three new project cards.
- Do not add project links, galleries, carousels, frameworks, dependencies, or a build step.
- Do not change `privacy.html`, `impressum.html`, `CNAME`, or `.nojekyll` except if an explicit factual product-count reference is discovered and requires correction; any such change must be reported.

## Failure handling

A launch failure does not block the rollout. Use the newest truthful repository-owned screenshot or fixture and record the fallback. If no logo exists, use the approved monogram fallback. If a safe product scene cannot be produced without private or destructive access, use real command output or a repository-owned test artifact rather than fabricating UI.

## Verification

- Confirm all eighteen final assets are 1200 × 675 WebP files.
- Confirm every thumbnail uses the canonical background and frozen composition geometry.
- Confirm every logo and scene corresponds to the correct source repository.
- Confirm no private, explicit, identifying, or destructive source was used.
- Confirm all eighteen asset URLs return HTTP 200 locally.
- Confirm desktop and mobile card layout at 1440 × 900 and 390 × 844 with reduced motion.
- Check lazy loading, first-row loading, clipping, overlap, logo visibility, and horizontal overflow.
- Confirm browser console and network logs contain no errors.
- Confirm `git diff --check` passes and protected site files remain intact.
- Compare every source repository's git status before and after capture to prove it remained unchanged.

## Out of scope

- Redesigning the card body or other site sections.
- Publishing or deploying the site.
- Modifying any source product to make it easier to capture.
- Creating new product brands beyond the monogram fallback.
- Resuming halted product development or performing destructive/system-changing product tests.
