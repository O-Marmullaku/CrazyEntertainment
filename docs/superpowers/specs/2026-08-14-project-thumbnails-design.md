# Project Thumbnail Design

## Goal

Replace the fifteen generic initial-based project slates with recognizable, truthful thumbnails that make the work grid feel like a real product portfolio. Every thumbnail must show the project’s own identity and a meaningful view of the product itself.

## Approved composition

Each thumbnail uses the selected “logo rail + real product scene” composition:

- A 16:9 canvas at 1200 × 675 pixels.
- The project’s existing logo occupies the left 28–32% of the frame.
- A real interface capture fills the center and right of the frame.
- A restrained dark gradient blends the logo area into the screenshot and keeps the set compatible with the site’s near-black, coral-accented visual system.
- Original project colors remain visible. The studio palette frames the images rather than recoloring every product.
- No title or marketing copy is baked into the thumbnail. The card already supplies the project name and description.

## Source hierarchy

Use the following source order for every project:

1. Reuse the exact logo or app icon already present in that project’s repository.
2. Launch the real product and stage its most recognizable working state, then capture it directly.
3. If the current product cannot be launched safely or within the available environment, use its newest representative screenshot already checked into the project repository.
4. If the repository has no usable screenshot, use its own native mockup, preview, fixture, or demo state and capture that.
5. Use a restrained typographic monogram only when the project has no established logo or app icon.

Do not fabricate application interfaces with generative imagery. Generated imagery is not part of the approved thumbnail system.

## Project capture map

| Project | Logo source | Interface or scene to capture |
|---|---|---|
| Crazy Enhancer for YouTube | Existing extension icon | A YouTube player with the extension’s newly added controls or buttons visibly active |
| Dorfkönig | Existing app/PWA icon | A real village round showing the location photograph and map-guessing interface |
| Tableverse | Existing knight/card brand art | An active chess game with pieces in play inside the real table interface |
| Syb-L | Existing app icon or brand mark | The real calm call interface with representative video, voice, or screen-sharing state |
| Apollo Dual-Screen | Existing project/app icon when available | Two remote desktops visibly composed side by side in one window |
| Axiom Calculator Platform | Existing calculator app icon | The calculator interface in use with a meaningful MathPrint expression or result |
| Token Measurer | Existing app icon | The real top-of-screen usage pill and/or tray meter in a populated state |
| Reviewer 3000 | Existing project mark when available | A populated review interface spanning film, book, and game content |
| DumpToTxt | Existing application icon | The real application window showing a selected folder, packing controls, or output summary |
| MicBridge | Existing microphone/tray artwork | The real main device and audio interface with connected or active state visible |
| ProTeaser Studio | Existing project mark when available | A populated waveform and teaser timeline in the real editor |
| VideoQualityBalancer | Existing logo | The real source-versus-encode comparison or quality-tuning interface |
| Portica | Existing app icon or brand mark | The builder interface beside a rendered portfolio preview |
| Custom Video Platform | Existing non-sensitive project mark, otherwise a neutral monogram | The real player and catalogue interface with all adult, identifying, and private content replaced by safe neutral media |
| Creator Workflow Extension | Existing extension/store icon | The real masking or settings interface with all identities and private data anonymized |

## Privacy and content safety

- Never publish private names, emails, tokens, local paths, user accounts, messages, or production data.
- Use local fixtures, demo accounts, or inert sample data when staging captures.
- The Custom Video Platform thumbnail must contain no adult imagery or explicit text.
- The Creator Workflow Extension thumbnail must contain no identifiable creator or audience information.
- YouTube captures must avoid exposing personal account details; crop or stage a signed-out/demo-safe view.

## Asset production

- Store final thumbnails under `assets/projects/` with stable lowercase hyphenated filenames.
- Export final assets as WebP at 1200 × 675 pixels.
- Keep each image visually sharp at the site’s two-column desktop size while compressing it enough for a static landing page.
- Preserve source aspect ratios while cropping; do not stretch logos or interfaces.
- Apply the left logo rail and blend consistently during offline asset preparation so the page needs only one image request per card.

## Site integration

- Replace each `.card-visual` placeholder with a semantic `<img>` inside the existing 16:9 visual container.
- Keep every URL relative so both the apex domain and GitHub Pages subpath continue to work.
- Use `loading="lazy"` and `decoding="async"` for project images below the fold.
- Use empty alternative text because each image is decorative context for a card whose adjacent heading and description already identify and explain the project.
- Remove the initial-based `data-mark` styling and retain only the container, clipping, border, and a subtle hover scale.
- Add no framework, JavaScript behavior, build step, or dependency.

## Failure handling

If a project does not launch, do not block the entire set. Record the launch issue, select the newest truthful repository-owned screenshot or native preview, and continue. If no logo exists, use the approved monogram fallback. Every card still receives a finished thumbnail.

## Verification

- Confirm all fifteen image paths load through a local HTTP server with no console or network errors.
- Confirm each asset is 1200 × 675 WebP and visually corresponds to the correct project.
- Verify that private or unsafe content is absent from every final image.
- Capture the finished site at 1440 × 900 and 390 × 844 with reduced motion enabled, as required by the repository contract.
- Check card cropping, logo visibility, text contrast, mobile stacking, lazy loading, and hover behavior.
- Confirm `privacy.html`, `impressum.html`, `CNAME`, and `.nojekyll` remain unchanged and functional.

## Out of scope

- Redesigning the cards or the rest of the site.
- Adding project links, galleries, carousels, video previews, or lightboxes.
- Creating new product brands where none exists beyond the approved monogram fallback.
- Changing project descriptions, statuses, ordering, or legal content.
