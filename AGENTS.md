# AGENTS.md — Crazy Entertainment (company website)

Project contract. Shared workflow inherited from Creations-level `../AGENTS.md`. **Read `docs/CONTEXT.md` first** — history, decisions, open founder-calls, exact DNS/deploy records, and the 15-project source data (frozen context, not live status).

## What this is
Public **company/landing** site for **Crazy Entertainment Marmullaku** (Swiss software studio of Osman Marmullaku) — company voice "we", NOT a personal CV. Hero → Selected work (15 project cards) → about + stats → contact → footer, plus `privacy.html` + Swiss `impressum.html`. Small static site — stay surgical.

## Administrative work hub
Use this repository as the default entry point for company administration, especially completing documents, processing receipts and expense entries, maintaining asset records, and related operational work. The website remains a small static site; administrative source files and authoritative records can live elsewhere and must be handled under their own project contracts.

- Complete established administrative workflows end to end. For a valid completed order, receipt, or invoice, archive the minimal proof, update the live expense ledger, and verify the written row. Do not stop after checking, replacing, or renaming the receipt unless the operator explicitly limits the scope.
- For document and asset work, update the authoritative artifact or register, preserve supplied source files unless directed otherwise, and verify the result.
- Do not make the operator restate linked steps that are already defined in this file, `docs/CONTEXT.md`, or the referenced project contract.

- **Live:** https://crazyentertainment.ch (the github.io subpath 301-redirects here; so does the second domain **`crazysoftware.ch`**, via Cloudflare — see `docs/CONTEXT.md → Deploy / DNS`, and do NOT "clean up" its `192.0.2.1` record). **Repo:** `O-Marmullaku/CrazyEntertainment` (**public**), `main`. **Host:** GitHub Pages (Source = `main` / root).

## ⚠ Hard rules (this repo — override inherited/global defaults)
- **NO `Co-Authored-By: Claude` trailer on commits.** Founder's explicit request (public repo) — this **overrides the global default that adds the trailer**. Plain commit messages.
- **No build step, no framework, no new dependencies.** Plain HTML + CSS + vanilla JS. Keep it that way.
- **`privacy.html` is load-bearing externally** — it's the privacy-policy URL on the **Crazy Enhancer for YouTube** extension's store listings. Don't move, rename, or break it.
- **Keep every asset link relative** (`style.css`, `privacy.html`, `impressum.html`, …) — the site serves from both the github.io subpath and the apex domain; an absolute path breaks one of them.
- **Don't delete `CNAME`** (`crazyentertainment.ch` — tells Pages the custom domain) or `.nojekyll` (serve as-is, no Jekyll).
- **Expense bookkeeping (authoritative workflow).** This repository is the default agent entry point for this work. The live ledger is the [`2026 Expenses` tab in `Work`](https://docs.google.com/spreadsheets/d/1Ninkxbv1SOvatcJ3AP4zwKWxdc32imlIkP_IMUSTR9E/edit?gid=1400965901#gid=1400965901); the source-document folder is `F:\WORK\WORK-2026-reciepts`. Treat these as the authoritative destinations unless the operator explicitly changes them.
  - Reconcile every completed order, receipt, invoice, or payment record in the receipts folder to the ledger. Add a row when one is missing, retain the source filename in `Main receipt / source file`, and verify the saved row in Google Sheets. Do not stop after inspecting or renaming a receipt.
  - Use the next sequential `EXP-YYYY-NNNN` ID, one row per checkout/order unless an invoice demonstrably contains separately categorized business items. Preserve the row formulas, validation, and formatting by copying a complete neighboring ledger row before writing the new values.
  - Write a concise, generic, tax-facing business-purpose description. Avoid explicit item names when a broader accurate description works. Keep notes to essential facts such as an invoice, receipt, or order ID. Use a generic order-based receipt filename when the original name is overly specific.
  - Record source amounts, currencies, payment methods, exchange rates, and payment proofs faithfully. Do not invent or conceal a material amount, currency, payment method, conversion rate, or payment status. Leave a field blank when its source is unavailable, and state the outstanding fact in the note only when useful.
  - For mixed personal/business use, record only the authorized business allocation in the expense amount and state the original receipt total plus the allocation in the note. Do not treat personal use as a business expense.

## Files (no build)
`index.html` (hero + 15 work cards + about/contact) · `style.css` (whole design system: dark, coral `#ff4d36`, Space Grotesk / Inter / JetBrains Mono — loaded from Google Fonts, disclosed in the privacy policy) · `main.js` (nav scroll state, mobile burger, IntersectionObserver scroll-reveal) · `privacy.html` · `impressum.html` (Swiss legal notice) · `logo.png` (CE brand mark, coral on transparent — used by `.brand .mk` in the nav + footer of all three pages) · `favicon.png` · `CNAME` · `.nojekyll`. Design / DNS / per-project data detail lives in `docs/CONTEXT.md`.

## Run / verify / deploy
- **Run:** open `index.html`, or `python -m http.server 8080`.
- **Verify (design-led → screenshot desktop + mobile before reporting a UI change done):** Playwright with `reducedMotion: "reduce"` (else `.reveal` elements stay hidden and the page screenshots blank), captured at 1440×900 + 390×844.
- **Deploy:** push `main` → GitHub Pages auto-rebuilds. Custom domain = `CNAME` + GoDaddy DNS (exact A / CNAME records in `docs/CONTEXT.md → Deploy / DNS`).
