# Thumbnail Hover Emphasis

## Goal

Make each project thumbnail's icon and UI layer expand smoothly and noticeably when hovered, while keeping the two layers independent.

## Interaction

- Hovering the icon scales only the icon to `1.18` and raises it above the UI.
- Hovering the UI scales only the UI to `1.10` and raises it above the icon.
- Both use a 260 ms ease-out transition for transform and shadow.
- The interaction remains available when reduced motion is requested, using the same short transition because the founder explicitly prefers smoothness over an instant state change here.
- Touch layouts remain unchanged because hover rules stay inside the existing fine-pointer media query.

## Scope

Change only the existing thumbnail-layer CSS. Add no JavaScript, dependencies, markup, or new configuration.

## Verification

- In a real browser, measure that each hovered layer reaches the specified scale while its sibling stays unchanged.
- Run the check with reduced motion enabled, since that setting caused the instant transition.
- Recheck desktop and mobile screenshots for clipping, overflow, and broken assets.
