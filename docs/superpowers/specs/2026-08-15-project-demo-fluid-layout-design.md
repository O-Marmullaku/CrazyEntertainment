# Fluid Project Demo Overlay Design

## Goal

Make the project overlay read as one composed presentation: project identity and copy on the left, with no independently scrollable desktop pane, and a dominant full-bleed product interface on the right.

## Desktop layout

- Keep the existing two-column native `<dialog>` at desktop widths.
- The copy column must not expose its own scrollbar. Its icon, gaps, heading, description and chips use viewport-height-aware CSS sizing so all 18 current projects fit inside the dialog.
- Do not truncate descriptions or add JavaScript text-fitting logic. The layout remains CSS-only and preserves readable minimum type sizes.
- The demo column fills its grid area. Remove the card-like outer margin, rounded frame, decorative project background and border from the dialog stage.
- The project icon remains in the copy column; it must not be duplicated inside the demo.

## Demo media

- Rebuild every `demo.gif` from that project's raw `ui.webp`, not from the three-layer card thumbnail composition.
- Keep the existing 640 by 360, six-second, looping and 3 MiB maximum asset contract.
- Scale each interface as large as possible while keeping its useful screen content visible. Use a neutral dark canvas only where the source aspect ratio requires letterboxing.
- Keep a restrained reversible motion treatment. The motion must not introduce logos, decorative thumbnail backgrounds or synthetic UI.
- Tableverse remains the one verified live iframe. Its iframe fills the right demo area; its raw `ui.webp` remains the immediate loading poster.
- GIF projects also show their raw `ui.webp` immediately and swap to the loop once decoded.

## Responsive behavior

- At 820 pixels and below, keep the existing stacked order: demo first, copy second.
- Mobile uses one natural dialog-level scroll; the copy area itself must not become a nested scrolling pane.
- The close button remains fixed and visible over the demo area.

## Accessibility and behavior

- Preserve native dialog semantics, keyboard activation, Escape, backdrop and close-button handling, focus restoration, lazy media creation and media cleanup on close.
- Preserve the independent icon and UI hover expansion on closed cards.
- Continue respecting `prefers-reduced-motion: reduce` for dialog transitions. The GIF remains ordinary media rather than being loaded before activation.

## Verification

- For every one of the 18 projects at 1440 by 900, assert that the desktop copy column has no scrollable overflow and uses a non-scrollable overflow mode.
- Verify the most demanding copy at 1280 by 720 to catch height-sensitive regressions.
- Assert that the demo stage reaches the top, right and bottom edges of its desktop grid column instead of retaining card-style inset margins.
- Re-run the 18-GIF size/dimension check, dialog interaction test, 54-layer integration check and broken-image/horizontal-overflow screenshot check.
- Inspect reduced-motion screenshots at 1440 by 900 and 390 by 844.

## Explicit non-goals

- No description truncation.
- No JavaScript auto-scaling loop.
- No new dependency, framework or build step.
- No change to the project cards themselves beyond their already-approved hover and click behavior.
