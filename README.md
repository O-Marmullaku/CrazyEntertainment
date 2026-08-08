# Crazy Entertainment — studio site

The website for **Crazy Entertainment Marmullaku**, the independent software studio of Osman Marmullaku
(ETH Zürich Computer Science, Switzerland). A static, dependency-free site (HTML + CSS + a little vanilla JS).

- **Live:** crazyentertainment.ch (via GitHub Pages)
- `index.html` — landing: hero, selected work (15 projects), about, contact
- `privacy.html` — privacy policy (covers the site + the Crazy Enhancer for YouTube extension; the URL used for the Chrome Web Store listing)
- `impressum.html` — Swiss legal notice
- `style.css` / `main.js` / `logo.png` / `favicon.png` — design system, interactions, CE brand mark

## Run locally
Just open `index.html`, or serve the folder:
```
python -m http.server 8080
```

## Deploy (GitHub Pages)
Repo **Settings → Pages → Source: Deploy from a branch → `main` / root**. Custom domain
`crazyentertainment.ch` is set via a `CNAME` file + DNS (see deploy notes). `.nojekyll` is present so all files
serve as-is.

No build step, no framework, no tracking.
