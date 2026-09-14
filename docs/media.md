# Project media maintenance

## Source and availability

The source snapshot omitted `assets/projects/`; no original project image or demo is included in this package. The owner retains the originals separately. No image was recovered from another revision, generated as a substitute, or represented as an original.

`index.html` retains each card's original three-layer composition inside its `project-media` template, including relative paths and intrinsic dimensions. The card retains its original `data-demo-gif` path. A template's `data-images` and `data-demo` states are explicit availability flags, not product status. Missing templates remain inert, so they do not cause requests for nonexistent files. The visible card and dialog present an honest fallback.

## Restoring authentic originals

Copy the reviewed project media into the existing paths declared by the templates. Each project uses `assets/projects/<slug>/background.webp`, `icon.webp`, `ui.webp`, and `demo.gif`. Then run, from the repository root:

```sh
node tools/project-media.cjs --sync
node --test tests/site.test.cjs tests/project-media.test.cjs
node tools/project-media.cjs --require-all
node tests/project-dialog.spec.cjs
```

`--sync` validates present files before updating only availability flags. It never downloads, generates, deletes or changes images, product copy or geometry. It is idempotent. A complete three-layer set enables the thumbnail and static poster; a GIF is enabled independently. Partial sets stay disabled. Malformed or mismatched present files fail rather than being silently enabled. `--require-all` deliberately fails until every original is restored; ordinary verification accepts the explicit missing-media state.

This is optional source maintenance after replacing media, **not a deployment build step**. Preserve your complete originals and authoring sources outside this public package. Check source material for private content before placing it in a root-deployed public repository.

## Retained media contract

Backgrounds are opaque 1200 × 675 WebPs. Icon/UI layers use tight transparent crops and the exact dimensions/coordinates in the templates, preserving aspect ratios and independent pointer hitboxes. The first two cards load their layers eagerly when enabled; later cards lazy-load them. Keep icon and UI hover independent, including the existing short smooth hover transition under reduced-motion settings. Dialog transitions themselves respect reduced motion.

GIFs are 640 × 360, looping, at most 3 MiB each. The most recent supplied media design calls for a restrained six-second loop based on the raw UI layer, without the card's background or logo composition. Static UI is the final image fallback. Header/container tests do not establish truthful provenance, animation duration, full decoding, alpha quality or appropriate contents: inspect actual restored media in a real browser. The historic layer payload target was at most 3 MB overall, with each background at most 100 KB; preserve quality rather than distorting source geometry to hit a target.

If retained locally, the lossless authoring background at `assets/source/project-thumbnail-background.png` is not a runtime input. Existing themed project backgrounds and template geometry are the current composition evidence; do not resurrect the older flat, one-image-per-card layout or force every project to the same tint.

## Truthfulness and safety when replacing captures

Use the owning product's real logo and running interface with synthetic/demo-safe data; otherwise use its representative checked-in screenshot or native fixture. Never invent branded screenshots. Keep source product repositories read-only and do not run tools against meaningful user data solely to obtain a capture.

Consequential branding decisions retained from the supplied material: Syb-L uses its orange-door logo (owning repository: `design/logo.png`); DumpToTxt uses its authored dump-truck icon (owning repository: `assets/icons/DumpToTxt.ico`); Custom Video Platform uses a neutral video-frame/play mark in both thumbnail and UI, not personal branding. Those owning-repository paths are not files supplied with this website.

Keep Custom Video Platform and Creator Workflow Extension anonymized; do not expose their underlying private product names, audience identities, explicit material or personal branding. CoachLexy captures must exclude private research, transcripts and user media. Use signed-out/demo-safe browser views. Do not change Windows sharing state for FuckingShareIT captures or rearrange the owner's desktop for Desktop Edge Arranger. Source-owned screenshots, safe fixtures or disposable-profile evidence are preferable to destructive capture attempts.

## Dialog behavior and verification boundary

Tableverse retains `https://tableking.gg/` as its live iframe/full-demo URL. It is requested only after its card opens. A slow initial load falls back after eight seconds, and “Show preview instead” remains available because cross-origin framing failures cannot always be inferred from iframe events. This does not certify that the external service is currently working. Check its real functionality and embedding policy before changing or claiming that integration.

Closing cancels media listeners/timers, removes iframe/demo sources and restores card focus. Replacing a focused iframe or fallback button moves focus to the close control. At normal desktop viewports, copy should fit without scrolling; at increased zoom or constrained heights, scrolling is preferable to clipped text. Mobile uses one stacked dialog scroll with a persistent close control. Browser tests use synthetic images only as in-memory decoding/layout fixtures, never as public product media.
