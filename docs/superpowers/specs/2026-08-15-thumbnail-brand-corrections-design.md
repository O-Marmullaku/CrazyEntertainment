# Thumbnail Brand Corrections

## Goal

Correct three portfolio thumbnails so they use truthful project branding while retaining the approved unified thumbnail system.

## Scope

- **Syb-L:** replace the generic speech-bubble mark with the canonical `F:\WORK\Creations\Syb-L\design\logo.png` orange door logo.
- **DumpToTxt:** replace the stand-in file/cart mark with the authored `F:\WORK\Creations\DumpToTXT\assets\icons\DumpToTxt.ico` dump-truck icon.
- **Custom Video Platform:** replace the persona-specific `JG` mark on the left and in the visible UI header with one neutral video-frame/play symbol.

The shared teal background, 1200×675 canvas, existing UI captures, card order, HTML, and all other project thumbnails remain unchanged.

## Chosen approach

Recompose the three existing WebP files deterministically from their current layers and canonical source assets. Preserve each current background and UI region; change only the branding regions. This avoids the layout and text drift of full image regeneration and produces repeatable assets.

For Custom Video Platform, use a simple code-native video-frame outline containing a play triangle. It must be brand-neutral, visually compatible with the portfolio palette, and legible at card size. The same mark appears in the UI header so no persona branding remains visible.

## Alternatives considered

1. **Regenerate each full thumbnail:** rejected because it can alter approved UI details, scale, and shared background.
2. **Paint directly over the current pixels:** rejected because it is harder to reproduce cleanly and risks visible seams.
3. **Deterministic recomposition:** selected because it changes only the incorrect branding and preserves the approved composition.

## Verification

- Inspect the three corrected thumbnails at full size and in the site cards.
- Confirm the Syb-L and DumpToTxt marks match their source assets.
- Confirm no `JG` or persona identity remains in the Custom Video Platform thumbnail.
- Confirm all three files remain unique 1200×675 WebPs and return HTTP 200.
- Capture the site at 1440×900 and 390×844 with reduced motion enabled; check for failed images, overflow, and console errors.

