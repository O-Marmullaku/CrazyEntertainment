# Crazy Entertainment — studio website

Public company site for **Crazy Entertainment Marmullaku**. The deployed product is plain HTML, CSS and vanilla JavaScript: no build, framework, package installation or runtime dependency tree.

## Source and authority

The three root pages, `style.css`, `main.js`, `logo.png` and `favicon.png` are the public site. Project copy, status, order and media declarations live once in `index.html`; the reusable dialog reads the selected card. `CNAME` and `.nojekyll` preserve the root GitHub Pages deployment.

[AGENTS.md](AGENTS.md) contains only repository-specific working constraints. Tests check implementation and protected acceptance criteria; they do not independently authorize product changes. [Deployment notes](docs/deployment.md) retain the domain configuration's dated operational evidence, not a claim about current external state. [Media maintenance](docs/media.md) explains restoring omitted originals and reviewing new captures. No parent or global instruction file is required.

## Preview and verify

With Node.js 22 or newer, from this directory:

```sh
node tools/serve.cjs
node --test tests/site.test.cjs tests/project-media.test.cjs
node tools/project-media.cjs
```

The preview server listens only on the local machine, at port 8080 by default. Set `PORT` to choose another port. Alternatively, open `index.html` directly or use any static HTTP server. Deployment never runs these tools.

The dependency-free checks cover relative references, page structure, project consistency, media declarations, documentation links, JavaScript syntax, and HTTP delivery at both the root and a repository subpath.

### Optional real-browser checks

```sh
node tests/project-dialog.spec.cjs
```

The existing browser-verification requirement uses **Playwright plus Chromium as external, optional development tools**, not site dependencies. This repository deliberately declares no package dependencies and installs nothing automatically. Use an already provisioned Playwright installation, or set `CE_PLAYWRIGHT_MODULE` to its absolute module directory; `CHROME_PATH` optionally selects an existing Chromium/Chrome executable. Otherwise Playwright uses its managed browser. Do not install or reconfigure global tools for this site.

The suite starts and closes its own local server unless `CE_BASE_URL` is supplied. It stubs external fonts and the live demo for repeatable local behavior checks; it does not certify third-party availability. `CE_SCREENSHOT_DIR` optionally writes captures to a directory you choose; no captures are written by default. Actions, navigations and the entire suite have finite deadlines. `CE_SUITE=layout`, `media`, or `navigation` runs a bounded subset.

In browser environments that prohibit navigation, `CE_OFFLINE=1` renders the actual HTML/CSS/JS from disk in the real browser, using in-memory image fixtures where needed. This checks layout and DOM interactions, **not browser HTTP navigation, external fonts or real iframe networking**. The independent HTTP checks still exercise local delivery. This mode never silently replaces the normal browser test.

## Project imagery

The first 18 cards have project thumbnails and demo GIFs. Their layer paths, intrinsic dimensions and composition coordinates remain in inert templates. The three newly added cards show “Preview unavailable” until authentic captures are reviewed. The TableKing live-demo URL and separate full-demo link are retained; local fallback remains available.

Project activity dates in `index.html` are Git commit snapshots. On a page visit, the browser briefly fetches the public, date-only `activity.json` and shows newer dates as relative days. If that request fails, the HTML snapshot remains. A scheduled GitHub Action refreshes the feed twice a day for remote-backed projects. Six local-only Git projects retain their snapshots until the site is edited; Sitewalk and Desktop Edge Arranger have no Git history in the supplied workspace, so their cards omit the date.

To enable scheduled refreshes, set two repository **Actions secrets**:

- `ACTIVITY_READ_TOKEN`: a fine-grained GitHub personal access token with read-only **Contents** access to the private project repositories. Never put this token in site files or the feed.
- `ACTIVITY_SOURCES_JSON`: a JSON object mapping public project media slugs to `owner/repository` names, for example `{"syb-l":"owner/repository"}`. The owner has a local, ignored mapping at `.local/activity-sources.json`; paste its contents into the secret, not the public repository.

The workflow uses its own `GITHUB_TOKEN` to commit changed dates and request a Pages build. Its first scheduled or manually triggered run can be checked under Actions. Without the two secrets, the published snapshots continue to work.

Restore only authentic, reviewed media, then follow [the media maintenance procedure](docs/media.md). Missing media is an explicit supported state; it is not a claim that the originals were verified.

## Deploy

Publish the repository root through GitHub Pages, preserving `privacy.html`, `impressum.html`, `CNAME` and `.nojekyll`. The privacy URL is used externally by the Crazy Enhancer for YouTube store listing. See [deployment notes](docs/deployment.md) before changing domains. There is no deployment step hidden in verification scripts.
