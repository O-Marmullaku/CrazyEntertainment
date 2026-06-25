# Crazy Entertainment website — STATE

_Context doc for resuming work on this site. Facts + how it came to be + decisions + open founder-calls.
Read this first. Distrust hand-written status until checked against the files / live site._

## ACTIVE — where it is now (2026-06-25)

- **🟢 LIVE at https://crazyentertainment.ch** (HTTPS, GitHub Pages, custom domain working). Also reachable at
  `o-marmullaku.github.io/CrazyEntertainment/` which **301-redirects** to the apex domain.
- **Repo:** `O-Marmullaku/CrazyEntertainment` (**public**), branch `main`. **No `Co-Authored-By: Claude` trailer on
  commits here** (founder's rule). History: a clean single `initial` commit, then incremental.
- **What it is:** the company/landing site for **Crazy Entertainment Marmullaku** (Swiss software studio of Osman
  Marmullaku, ETH Zürich CS). Company voice ("we"), NOT a personal CV. Sections: hero → **Selected work** (13
  project cards) → about + stats → contact → footer; plus `privacy.html` + `impressum.html`.
- **Static, no build, no framework.** HTML + CSS + a little vanilla JS. Google Fonts (Space Grotesk + Inter +
  JetBrains Mono). Coral-red accent `#ff4d36` on near-black.
- **The privacy page does double duty:** `https://crazyentertainment.ch/privacy.html` is the **privacy-policy URL
  used for the Crazy Enhancer for YouTube extension's store listings** (Chrome Web Store requires one). It covers
  both the website and the extension (both collect no data).

## How this site came to be (history)

- Built in **one session, 2026-06-25**, as a spin-off from the **CrazyYoutube** extension work — the trigger was
  that the Chrome Web Store submission needed a **privacy-policy URL**, and the founder decided to "quickly make my
  company website" to host it (on `crazyentertainment.ch`, via GitHub Pages).
- Content was sourced from a **deep read of the founder's `F:\WORK\Creations` projects** (a 15-agent workflow, one
  agent per project → a confident client-facing card each) + the founder's **CV** (ETH Zürich CS, Swiss, the stack).
- **First draft was wrong and got corrected:** it came out as a **personal CV / portfolio** with a try-hard
  headline ("I build the software others call too hard"). The founder pushed back — *"this isn't my resume, it's
  literally my company… a bit try-hardy."* → **reframed to company voice** (hero "We build software.", "we" not "I",
  dropped the ETH/personal-credential framing and the bragging). Same design, same projects.

## The build

- **Design:** dark premium "studio" aesthetic. Near-black `#08080a`, off-white text, **one** accent (coral-red
  `#ff4d36`, used sparingly). Big tight display type (Space Grotesk), mono labels (JetBrains Mono), Inter body.
  Hairline borders, generous whitespace, a faint hero glow + subtle grain, IntersectionObserver scroll-reveal,
  fixed blur nav, mobile burger menu. All in `style.css` + `main.js`.
- **Work section:** 13 project cards (category tag, status badge live/beta/in-dev/prototype, name, tagline,
  1–2-sentence description, tech chips). **No repo links** — the founder's project repos are private (would 404).
- **Stats (company, not CV):** 13 Products built · 0 Trackers ever · 100% Independent · CH.
- **Legal:** `impressum.html` carries the Swiss-required owner + address; `privacy.html` = no-data policy for site
  + extension.

## Deploy / DNS (how it's hosted)

- **GitHub Pages:** repo Settings → Pages → Source = **`main` / root**. `.nojekyll` present. `CNAME` = `crazyentertainment.ch`.
- **DNS at GoDaddy** (crazyentertainment.ch keeps GoDaddy nameservers; we did NOT delegate to anyone):
  - 4 apex `A` records `@` → **185.199.108.153 / .109.153 / .110.153 / .111.153** (GitHub Pages IPs).
  - `www` CNAME → **`o-marmullaku.github.io.`**
  - Left untouched: the two `ns` (domaincontrol.com), `soa`, `_domainconnect`, and the `_dmarc` TXT (email).
- All four endpoints verified 200 / redirect on 2026-06-25 (`/`, `/privacy.html`, `/impressum.html`, `www`→apex).
- **To redeploy:** just `git push origin main` — Pages rebuilds automatically. Keep asset links **relative** so the
  site works on both the github.io subpath and the apex domain.

## Decisions (this run — 2026-06-25)
- **Company voice, not a CV.** After the founder's pushback, the front of the site is the *company*; the *person*
  appears only where legally required (the Impressum). No "I", no ETH-as-personal-flex, no try-hard headline.
- **Excluded 2 of the 15 projects** from the public grid: **AdultVideoPlayer** (NSFW — off-brand for a client site)
  and the **Claude prompt-pack** (`5_killer_unlimited_claude_prompts` — a methodology asset, not a product).
- **No repo links on cards** — the founder's repos are private → links would 404. Status badges + descriptions only.
- **Impressum publishes the registered address** (Luzernerstrasse 19, 5643 Sins AG) — legally required for a Swiss
  commercial site. Phone number **omitted**. ⚠ Founder may want to swap for a c/o/business address (see Open).
- **Contact email = `osman@marmullaku.ch`** (from the CV) — may switch to a branded `@crazyentertainment.ch` later.
- **No `Co-Authored-By: Claude` trailer** on commits in this repo (founder's request). History squashed to one
  `initial` commit before going public.

## Open threads / founder-to-decide (next-session candidates)
- **Impressum address** — confirm OK to keep the home address public, or swap to a business/c-o address (then I can
  also scrub it from history — it's a small repo). Phone is already omitted.
- **Branded contact email** — switch `osman@marmullaku.ch` → e.g. `hello@crazyentertainment.ch` once mail is set up.
  (Founder is setting up **Migadu** for mail — Swiss, flat price, catch-all on `crazyentertainment.ch` + product
  domains. App/transactional mail (password resets etc.) should go through a separate sender like Resend/SES, NOT
  Migadu's 20-send/day inbox.)
- **Self-host the Google Fonts** for a 100% tracker-free site (currently disclosed in the privacy policy).
- **Projects** — add/remove cards as projects ship or graduate; update status badges. AdultVideoPlayer stays off.
- **Per-product domains/sites** — the founder plans landing pages + socials per flagship product (Dorfkönig,
  Tableverse, …) under their own domains; those would be separate repos, with this site as the studio hub.

## The 13 projects on the site (source data — keep in sync with `index.html`)
| # | Name (display) | Folder | Status | Category | One-liner |
|---|---|---|---|---|---|
| 1 | Crazy Enhancer for YouTube | CrazyYoutube | **live** | Browser extension | No-bloat YouTube tools (speed/transcript/music); LIVE on Firefox AMO, Chrome submitting |
| 2 | Dorfkönig | SwissGeoGuessr | in dev | Web app · Game | GeoGuessr-style game, one Swiss village at a time (working title — rebrand pending) |
| 3 | Tableverse | Cards | prototype | Web app · Game | One lobby, 8 networked table games (chess/shogi/jass/blackjack…) |
| 4 | Syb-L | Syb-L | beta | Desktop & mobile | Server-less P2P voice/video/files (libjami + Flutter) |
| 5 | Apollo Dual-Screen | CrazyApolloAndMoonlightQT | in dev | Desktop · Systems | Two remote desktops in one Moonlight window (Win32 SetParent compositing) |
| 6 | Axiom Calculator Platform | Ti-30x pro | beta | Cross-platform | Faithful TI-30X Pro on web/PWA/desktop/Android, 336 golden tests |
| 7 | Token Measurer | token-measurer | beta | Desktop · Dev tool | Featherweight Claude Code usage meter (Rust/Tauri 2) |
| 8 | Reviewer 3000 | Reviewer-3000 | beta | Developer tool | Letterboxd/Goodreads/Steam reviews → one zero-dep static site |
| 9 | DumpToTxt | DumpToTXT | beta | Desktop · Dev tool | Pack a folder into one AI-ready text file from Explorer (C#/.NET 8) |
| 10 | MicBridge | MicBridge | beta | Desktop · Systems | One PC's mic as a real device on another, over LAN (C++/WASAPI/Opus/UDP) |
| 11 | ProTeaser Studio | PTC | prototype | Desktop · Media | Long videos → teaser reels; one React core, 3 runtimes (FFmpeg planner) |
| 12 | VideoQualityBalancer | VideoQualityBalancer | prototype | Desktop · Media | x265 quality-tuning + source-vs-encode comparison (TS/React/FFmpeg) |
| 13 | Portica | Portfolio-3000 | in dev | Web app | Export-first builder: career material → a site you own (React/TS/Supabase) |

**Excluded (do not add to the public site):** `AdultVideoPlayer` (Johnny Guides — NSFW), `5_killer_unlimited_claude_prompts` (prompt pack, not a product).

## Recent (newest first)
- 2026-06-25 — **Site built, shipped, and live.** Created from a deep read of the Creations projects + CV; first
  draft (too personal + try-hard) reframed to **company voice** per founder feedback. Pushed to a clean `initial`
  commit (no Claude trailer); repo made public; GitHub Pages on; GoDaddy DNS (apex A → GitHub IPs, www → github.io);
  custom domain live with HTTPS. Privacy page wired as the Chrome Web Store privacy URL. Then **added these context
  docs** (`AGENTS.md` / `CLAUDE.md` / this `STATE.md`) so the repo is self-sufficient for a future session.
