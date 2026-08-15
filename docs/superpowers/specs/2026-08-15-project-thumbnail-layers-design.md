# Project Thumbnail Layers

## Goal

Replace every flattened project thumbnail with three independently editable assets: a project-themed background, a truthful product UI image, and a project icon. The browser layers those files directly so future background, UI, or identity changes never require rebuilding the other two layers.

The portfolio remains a static HTML/CSS/vanilla-JavaScript site with no runtime dependency or build step.

## Asset contract

Every one of the eighteen projects owns exactly this directory shape:

```text
assets/projects/<slug>/background.webp
assets/projects/<slug>/ui.webp
assets/projects/<slug>/icon.webp
```

- `background.webp` is an opaque 1200 × 675 WebP.
- `ui.webp` is a tightly cropped WebP with transparency where the product frame has rounded or irregular edges.
- `icon.webp` is a tightly cropped transparent WebP containing only the project identity.
- Icon and UI files preserve aspect ratio and contain no background color, project title, card copy, or unrelated layer pixels.
- The existing eighteen flattened `assets/projects/<slug>.webp` files are removed after migration.
- `assets/source/project-thumbnail-background.png` remains the lossless structural source for the themed backgrounds; it is not loaded by the public page.

Tight crops are required because transparent full-canvas images would create overlapping pointer hitboxes and prevent independent hover behavior.

## Live composition

Each `.card-visual` contains one thumbnail stage with three sibling images in this order:

1. background;
2. product UI;
3. project icon.

The background covers the entire 16:9 stage. The UI and icon are absolutely positioned using per-card CSS custom properties for `x`, `y`, and `width`; height follows the asset's intrinsic aspect ratio. The custom properties preserve the approved composition and controlled icon/UI overlap without creating eighteen bespoke style rules.

All three images remain decorative under the card's existing `aria-hidden="true"` container. CoachLexy and Tableverse load their six layer images eagerly; the other forty-eight layer images use native lazy loading and asynchronous decoding.

## Independent hover interaction

On pointer devices that support hover:

- hovering the icon scales and lifts only the icon;
- hovering the UI scales and lifts only the UI;
- the hovered item receives the highest local `z-index` so overlap feels intentional;
- the icon uses the stronger motion (`scale(1.08)` and a small upward lift);
- the UI uses restrained motion (`scale(1.035)` and a smaller upward lift);
- transitions use a quick, slightly spring-like easing and never move the background.

The existing whole-thumbnail hover zoom is removed. Touch devices keep the composition static. `prefers-reduced-motion: reduce` disables layer transforms and transitions. The layers are decorative rather than keyboard controls, so no focus behavior is added.

## Background system

Every background retains the canonical dark technical composition: the same gradient topology, dot clusters, thin circuit lines, contrast, and edge treatment. Only the restrained color tint changes. The tint follows the real product identity or UI, stays dark enough for cream and bright icons, and never competes with the product scene.

| Project | Slug | Theme tint |
|---|---|---|
| CoachLexy | `coachlexy` | leafy green `#0d2a1a` |
| Tableverse | `tableverse` | emerald `#0f261d` |
| Syb-L | `syb-l` | warm amber `#2b1b08` |
| VideoQualityBalancer | `videoqualitybalancer` | golden brown `#2c2008` |
| Crazy Enhancer for YouTube | `crazy-enhancer-youtube` | deep red `#2a0d0e` |
| Dorfkönig | `dorfkoenig` | Swiss red `#2a1011` |
| Apollo Dual-Screen | `apollo-dual-screen` | electric blue `#081d32` |
| Axiom Calculator Platform | `axiom-calculator` | calculator cyan `#0a2230` |
| Token Measurer | `token-measurer` | usage blue `#0a2036` |
| Reviewer 3000 | `reviewer-3000` | violet `#191331` |
| DumpToTxt | `dump-to-txt` | neutral steel `#142027` |
| MicBridge | `micbridge` | signal green `#0e281f` |
| ProTeaser Studio | `proteaser-studio` | timeline blue `#0a1c33` |
| Portica | `portica` | portfolio indigo `#111a39` |
| Custom Video Platform | `custom-video-platform` | video coral `#2b1510` |
| Creator Workflow Extension | `creator-workflow-extension` | privacy violet `#131932` |
| FuckingShareIT | `fuckingshareit` | hot pink `#2c0f1c` |
| Desktop Edge Arranger | `desktop-edge-arranger` | desktop azure `#0a2130` |

Backgrounds are generated deterministically from the canonical source by preserving luminance and applying the listed hue to the dark color field and technical accents. The result is eighteen distinct files that still read as one system.

## Source fidelity

Use repository-owned icons whenever available, including the newly corrected Syb-L and DumpToTxt identities. Keep the neutral Video Library mark for Custom Video Platform. Existing approved neutral marks remain valid for projects without a canonical brand asset.

UI layers come from the current approved product scenes or a higher-quality repository-owned version of the same scene. No application UI is invented or regenerated. Source repositories are read-only, and privacy restrictions from the unified thumbnail specification remain in force.

## Performance budget

- Exactly 54 public project layer files.
- Six eager image requests for the first two cards; forty-eight lazy image requests below them.
- Total layer payload target: at most 3 MB.
- Each background target: at most 100 KB.
- Keep intrinsic dimensions on every image to avoid layout shift.
- No JavaScript is needed for composition or hover behavior.

## Migration and failure handling

Build and inspect the three layers for every project before changing `index.html`. If a source icon cannot be cleanly separated, use its canonical repository asset or reconstruct the already approved neutral mark deterministically; do not leave old background pixels in `icon.webp`.

If a UI frame cannot be cleanly matted, use the truthful rectangular product crop and preserve its frame as part of `ui.webp`. A difficult source never justifies fabricating a new interface.

Switch the markup only after all 54 files validate. Remove the flattened files only after the layered site passes visual and HTTP checks.

## Verification

- Confirm eighteen project directories and exactly three WebPs in each.
- Confirm all backgrounds are opaque 1200 × 675 images and all icon/UI files have valid non-empty content with the expected transparency.
- Confirm every UI and icon corresponds to the correct project source.
- Confirm all 54 relative URLs return HTTP 200.
- Confirm only the first two cards omit `loading="lazy"` on their three layers.
- Confirm hovering the icon changes only the icon transform and hovering the UI changes only the UI transform.
- Confirm touch/mobile composition remains static and `prefers-reduced-motion` disables transforms.
- Capture and inspect 1440 × 900 and 390 × 844 with reduced motion enabled.
- Confirm no horizontal overflow, layout shift, failed image, console warning, or network error.
- Confirm total asset payload is at most 3 MB.
- Confirm the eighteen source repositories match their before-state.
- Confirm `privacy.html`, `impressum.html`, `CNAME`, `.nojekyll`, and unrelated user files are unchanged.

## Out of scope

- Redesigning card copy, ordering, badges, or the rest of the site.
- Adding project links, galleries, controls, or JavaScript-driven effects.
- Modifying source products.
- Publishing or deploying the site.
