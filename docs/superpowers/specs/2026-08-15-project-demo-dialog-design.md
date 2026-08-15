# Project demo dialog design

## Goal

Let a visitor click any project card and inspect it in a large overlay without leaving the work grid. The overlay keeps the existing project information on the left and gives most of its space to a working product demo on the right.

## Chosen approach

Use one reusable native `<dialog>` for all 18 projects. JavaScript fills it from the selected card and loads the project media only after the dialog opens. This keeps the site dependency-free and avoids maintaining 18 copies of the same overlay markup.

Each card remains the source of truth for its title, category, status, description, stack and thumbnail assets. Small `data-*` attributes provide the optional live-demo URL and required fallback GIF path. The dialog does not duplicate project copy in a separate JavaScript data file.

## Interaction

- Clicking anywhere on a card opens the dialog.
- A focused card also opens with Enter or Space.
- The opening transition scales and fades the dialog in so it feels like the selected card became the larger view.
- A close button, Escape and a click on the backdrop close it.
- Closing restores focus to the card that opened it.
- While open, the dialog contains focus and prevents interaction with the page behind it through the browser's native modal behavior.
- The feature provides no next/previous controls. Visitors close the dialog and choose another card from the grid.

## Layout

On desktop, the dialog occupies roughly 90% of the viewport with a sensible maximum width. Its left column uses about 38% of the available width for the icon, status, title, tagline, description and stack. The right column uses the remaining space for the demo stage, styled with the selected project's background and accent colors.

On narrow screens, the dialog becomes a full-screen stacked view. The demo appears first, followed by the project information. Both the dialog and its close control remain usable at 390 by 844 pixels.

## Demo selection and fallback

Every project gets a short looping GIF. Each loop should show one representative interaction, last about 6 to 10 seconds, and avoid private data. GIFs are stored below the corresponding `assets/projects/<slug>/` directory and are loaded only when that project is opened.

Projects with a public web build may also provide a live URL. A URL is used in the iframe only after it has been manually verified to allow embedding and to work without private credentials. Projects that reject framing, require a desktop runtime, expose private material or fail the embed check use their GIF instead. A verified public project may also show an “Open full demo” link.

If a project can be launched locally, its GIF is recorded from the real interface. If it cannot currently run, the existing UI capture is used to create a restrained motion loop rather than blocking the whole feature. The existing static UI image remains the final error fallback if a GIF cannot load.

## Markup and data flow

- Add one `<dialog class="project-dialog">` near the end of `index.html`.
- Add accessible button behavior and demo metadata to each `.card`.
- On activation, `main.js` reads the chosen card, copies its visible content into the dialog and sets the media stage.
- When an approved live URL exists, create the iframe at open time with a descriptive title, lazy loading and a restrictive referrer policy.
- Otherwise create the fallback image at open time from the card's GIF path.
- On close, remove the iframe or GIF source so background demos stop and no unopened project downloads media.

## Styling and motion

The dialog uses the site's existing dark surface, hairline borders, project color glow, fonts and rounded corners. The demo sits in a framed 16:9 stage rather than floating on the page. The close button stays visible above long content.

Motion uses CSS only. Opening and closing animate opacity and scale with the site's existing easing. `prefers-reduced-motion: reduce` removes the transition. No new framework, package or runtime is introduced.

## Accessibility and safety

- Each card exposes button semantics and an accessible name such as “Open CoachLexy project demo.”
- The dialog has an accessible title and description tied to the selected project.
- Keyboard activation, Escape, focus restoration and visible focus states are required.
- Demo images use useful alternative text inside the dialog even though thumbnail layers remain decorative in the grid.
- Iframes are limited to confirmed public demo URLs. Private repositories, authenticated admin tools and local development URLs are never embedded on the public site.

## Verification

- Confirm all 18 cards open the same single dialog by mouse and keyboard.
- Confirm every dialog contains the matching project name, copy, stack and theme.
- Confirm live URLs are not requested until their cards open.
- Confirm every non-embedded project loads its GIF, with the static UI image handling media errors.
- Confirm close button, Escape and backdrop click work and restore focus.
- Confirm there are no broken relative assets, console errors or horizontal overflow.
- Capture and inspect the required 1440 by 900 and 390 by 844 screenshots with reduced motion enabled.
- Confirm the original icon/UI thumbnail hover remains intact and a card click does not accidentally trigger while selecting text inside the dialog.

