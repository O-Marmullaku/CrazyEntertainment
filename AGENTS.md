# AGENTS.md — Crazy Entertainment (company website)

Project contract for this repo. Read **`docs/STATE.md` first** — it has the current state, how the site came to
be, the decisions, and the open founder-calls. This repo also inherits the Creations-level workflow (the parent
`../AGENTS.md`), but this is a **small static site** — keep changes surgical, no over-engineering.

## What this is
The public website for **Crazy Entertainment Marmullaku** — the independent Swiss software studio of **Osman
Marmullaku** (ETH Zürich CS). A company/landing site (NOT a personal CV — company voice, "we"): hero, a
13-project work grid, about, contact, plus a **privacy policy** and a Swiss **Impressum**. The privacy page
doubles as the **privacy-policy URL for the Crazy Enhancer for YouTube extension's store listings**.

- **Live:** https://crazyentertainment.ch  (also https://o-marmullaku.github.io/CrazyEntertainment/ → redirects to it)
- **Repo:** `O-Marmullaku/CrazyEntertainment` (**public**), branch **`main`**.
- **Host:** GitHub Pages (Source = `main` / root). Custom domain via GoDaddy DNS + the `CNAME` file.

## ⚠ Hard rules (this repo)
- **NO `Co-Authored-By: Claude` trailer on commits here.** Founder's explicit request (public repo). Commit
  messages are plain (the first commit is literally `initial`). Do NOT add the trailer that the other repos use.
- Work directly on **`main`**, push when the founder asks (or in SOLO per the inherited workflow). No side branches.
- **No build step, no framework, no new dependencies.** Plain HTML + CSS + vanilla JS. Keep it that way.

## Stack & files (no build)
| File | Role |
|---|---|
| `index.html` | Landing — hero, **Selected work** (13 project cards), about + stats, contact, footer. |
| `style.css` | The whole design system: dark theme, coral-red accent `#ff4d36`, Space Grotesk + Inter + JetBrains Mono, reveal/nav/cards/legal. |
| `main.js` | Tiny vanilla JS — nav scroll state, mobile burger menu, IntersectionObserver scroll-reveal. |
| `privacy.html` | Privacy policy (the site **and** the Crazy Enhancer extension — the store privacy URL). |
| `impressum.html` | Swiss legal notice (owner, address, contact, disclaimer, copyright). |
| `favicon.svg` | The mark (rounded square + coral 4-point spark), reused inline in the nav/footer brand. |
| `CNAME` | `crazyentertainment.ch` — tells GitHub Pages the custom domain. Don't delete. |
| `.nojekyll` | Serve files as-is (no Jekyll). |
| `README.md` | Short human readme. |
| `docs/STATE.md` | **Context doc — read first.** History, decisions, open founder-calls, the 13-project data. |

Fonts load from **Google Fonts** (disclosed in the privacy policy; could be self-hosted later for a fully
tracker-free site).

## Run / preview
- Just open `index.html`, or serve: `python -m http.server 8080`.
- It's a **design-led** site → **verify visually** (screenshot desktop + mobile) before reporting a UI change done.
  Pattern used: a standalone Playwright script with `reducedMotion: "reduce"` (so `.reveal` elements show) →
  `file:///…/index.html`, screenshot at 1440×900 (full page) + 390×844 (mobile).

## Deploy
Push to `main`. GitHub Pages (Settings → Pages → Source: `main` / root) serves it. The custom domain is set via
the `CNAME` file + GoDaddy DNS (4 apex `A` records → GitHub Pages IPs `185.199.108–111.153`, and `www` CNAME →
`o-marmullaku.github.io.`). Already wired and live — see `docs/STATE.md → Deploy` for the exact records.

## Verify before "done"
Visual screenshot (above) + the relative links resolve (`privacy.html`, `impressum.html`, `style.css`, etc. are
**relative**, so they work on both the github.io subpath and the apex domain — keep them relative).
