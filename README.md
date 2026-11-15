# TubePilot website

A static, dependency-free marketing site and full user manual for TubePilot 1.0.0.
English and Arabic, light/dark studio styling, responsive down to phones.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | English landing page: features, pipeline, screenshots, downloads, pricing, FAQ |
| `index-ar.html` | Arabic landing page (`dir="rtl"`) |
| `docs.html` | Complete English manual, installation to publishing |
| `docs-ar.html` | Complete Arabic manual |
| `assets/styles.css` | All styling, including RTL and print rules |
| `assets/site.js` | Mobile nav, copy buttons, docs search, scroll-spy |
| `assets/downloads.js` | One place to change where the installers are hosted |
| `downloads/` | Local copy of the installer, portable ZIP and `SHA256SUMS.txt` |

## Preview locally

Do not double-click the HTML files if you want the download buttons and copy
buttons to behave exactly as deployed. Serve the folder:

```powershell
cd E:\Business\TubePilot\website
python -m http.server 5500
```

Then open <http://localhost:5500/>. Arabic pages are at `/index-ar.html` and
`/docs-ar.html`.

## Publish for free

The site is plain HTML/CSS/JS, so any free static host works.

### Option A — Cloudflare Pages (recommended)

1. Push this folder to a Git repository, or drag-and-drop the folder in the
   Cloudflare dashboard under **Workers & Pages → Create → Pages**.
2. Build command: none. Output directory: `/` (or the `website` folder).
3. Add the custom domain in **Custom domains**.

### Option B — GitHub Pages

1. Put the contents of this folder at the repository root (or in `/docs` and
   select that folder in Settings → Pages).
2. Settings → Pages → Deploy from a branch → `main` → `/docs`.
3. Add `.nojekyll` if you later introduce files or folders beginning with `_`.

### Option C — Netlify

Drag the folder onto <https://app.netlify.com/drop>. No build step.

## Host the big downloads separately

GitHub Pages rejects files over 100 MB, and many free hosts cap repository size.
The installer is ~263 MB and the portable ZIP ~260 MB. Host them where large
files are allowed, then point the site at that folder.

**GitHub Releases** (free, 2 GB per file):

1. Create a release tagged `v1.0.0`.
2. Upload `TubePilot-Setup-1.0.0.exe` and `TubePilot-1.0.0-portable.zip`.
3. Edit `assets/downloads.js`:

```js
window.TUBEPILOT_DOWNLOAD_BASE =
  "https://github.com/YOUR-NAME/YOUR-REPO/releases/download/v1.0.0/";
```

**Cloudflare R2** (free tier, 10 GB):

1. Create a bucket and upload both files.
2. Enable public access or attach a custom domain.
3. Set `TUBEPILOT_DOWNLOAD_BASE` to the public bucket URL.

You can keep the local `downloads/` copies for offline testing; the deployed
site will use the base URL you configure. The download page also links to
`downloads/SHA256SUMS.txt`, so keep a copy of that file at the hosted location
or update the link.

## When you ship a new build

1. Rebuild the installer and ZIP (`.\build-exe.ps1 -Installer -Zip`).
2. Copy the new files over `downloads/`.
3. Recompute the hashes:

```powershell
Get-FileHash .\downloads\TubePilot-Setup-1.0.0.exe -Algorithm SHA256
Get-FileHash .\downloads\TubePilot-1.0.0-portable.zip -Algorithm SHA256
```

4. Update the two hash values and byte counts in `index.html`, `index-ar.html`
   and `downloads/SHA256SUMS.txt`.
5. If the version changes, update the version strings in the page titles, hero,
   download headings and footers.
6. If you change the WhatsApp number or prices, update them in all four HTML
   pages (they are duplicated by design so the site stays static).

## Editing notes

- Keep the English and Arabic pages structurally in sync. Anchors such as
  `#install`, `#setup`, `#visuals`, `#youtube`, `#data`, `#legal` and
  `#troubleshooting` are linked from the landing pages, so do not rename them.
- Arabic pages use `dir="rtl"`; code snippets and file paths use `dir="ltr"`.
- Screenshots live in `assets/screenshots/`. Replace them at the same
  dimensions or update the `width`/`height` attributes to avoid layout shift.
- The site has no cookies, analytics or external fonts. The only outbound links
  are WhatsApp, the documentation, and the API-key sites named in the manual.
