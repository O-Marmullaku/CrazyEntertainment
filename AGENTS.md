# AGENTS.md — Crazy Entertainment (company website)

Project contract. Shared workflow inherited from Creations-level `../AGENTS.md`. **Read `docs/CONTEXT.md` first** — history, decisions, open founder-calls, exact DNS/deploy records, and the 13-project source data (frozen context, not live status).

## What this is
Public **company/landing** site for **Crazy Entertainment Marmullaku** (Swiss software studio of Osman Marmullaku) — company voice "we", NOT a personal CV. Hero → Selected work (13 project cards) → about + stats → contact → footer, plus `privacy.html` + Swiss `impressum.html`. Small static site — stay surgical.

- **Live:** https://crazyentertainment.ch (the github.io subpath 301-redirects here). **Repo:** `O-Marmullaku/CrazyEntertainment` (**public**), `main`. **Host:** GitHub Pages (Source = `main` / root).

## ⚠ Hard rules (this repo — override inherited/global defaults)
- **NO `Co-Authored-By: Claude` trailer on commits.** Founder's explicit request (public repo) — this **overrides the global default that adds the trailer**. Plain commit messages.
- **No build step, no framework, no new dependencies.** Plain HTML + CSS + vanilla JS. Keep it that way.
- **`privacy.html` is load-bearing externally** — it's the privacy-policy URL on the **Crazy Enhancer for YouTube** extension's store listings. Don't move, rename, or break it.
- **Keep every asset link relative** (`style.css`, `privacy.html`, `impressum.html`, …) — the site serves from both the github.io subpath and the apex domain; an absolute path breaks one of them.
- **Don't delete `CNAME`** (`crazyentertainment.ch` — tells Pages the custom domain) or `.nojekyll` (serve as-is, no Jekyll).

## Files (no build)
`index.html` (hero + 13 work cards + about/contact) · `style.css` (whole design system: dark, coral `#ff4d36`, Space Grotesk / Inter / JetBrains Mono — loaded from Google Fonts, disclosed in the privacy policy) · `main.js` (nav scroll state, mobile burger, IntersectionObserver scroll-reveal) · `privacy.html` · `impressum.html` (Swiss legal notice) · `favicon.svg` · `CNAME` · `.nojekyll`. Design / DNS / per-project data detail lives in `docs/CONTEXT.md`.

## Run / verify / deploy
- **Run:** open `index.html`, or `python -m http.server 8080`.
- **Verify (design-led → screenshot desktop + mobile before reporting a UI change done):** Playwright with `reducedMotion: "reduce"` (else `.reveal` elements stay hidden and the page screenshots blank), captured at 1440×900 + 390×844.
- **Deploy:** push `main` → GitHub Pages auto-rebuilds. Custom domain = `CNAME` + GoDaddy DNS (exact A / CNAME records in `docs/CONTEXT.md → Deploy / DNS`).
