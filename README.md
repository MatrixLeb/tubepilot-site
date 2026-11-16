# TubePilot website

A static, dependency-free marketing site and full user manual for TubePilot 1.0.1.
English and Arabic, light/dark studio styling, responsive down to phones, with the
narrated A–Z walkthrough embedded on both landing pages.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | English landing page: features, pipeline, screenshots, demo video, downloads, pricing, FAQ |
| `index-ar.html` | Arabic landing page (`dir="rtl"`) |
| `docs.html` | Complete English manual, installation to publishing |
| `docs-ar.html` | Complete Arabic manual |
| `assets/styles.css` | All styling, including RTL and print rules |
| `assets/site.js` | Mobile nav, demo video language tabs, copy buttons, docs search, scroll-spy |
| `assets/downloads.js` | One place to change where the installers are hosted |
| `assets/video/` | English and Arabic walkthrough MP4s plus poster frames |
| `assets/social/` | 1200×630 promo image used for Open Graph and Twitter cards |
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
2. Settings → Pages → Deploy from a branch → `main` → `/(root)`.
3. Add `.nojekyll` if you later introduce files or folders beginning with `_`.

### Option C — Netlify (current production host)

The official site is <https://tubepilot-690.netlify.app/>. The Netlify project
is not connected to this repository, so a Git push does not redeploy it.

To publish an update, zip this folder without `.git` and without the large
installers in `downloads/` (keep `downloads/SHA256SUMS.txt`), then either drag
the zip onto the Netlify dashboard or POST it to the deploy API:

```powershell
curl.exe -H "Authorization: Bearer $env:NETLIFY_AUTH_TOKEN" `
  -H "Content-Type: application/zip" `
  --data-binary "@tubepilot-site.zip" `
  "https://api.netlify.com/api/v1/sites/4fbd4aee-7d16-4a47-85da-e8664619aee2/deploys"
```

Use forward slashes when building the zip; Netlify does not extract archives
whose entry names use Windows backslashes.

## Host the big downloads separately

GitHub Pages rejects files over 100 MB, and many free hosts cap repository size.
The installer is ~263 MB and the portable ZIP ~260 MB. Host them where large
files are allowed, then point the site at that folder.

**GitHub Releases** (free, 2 GB per file):

1. Create a release tagged `v1.0.1` (keep older tags so past downloads stay counted).
2. Upload `TubePilot-Setup-1.0.1.exe` and `TubePilot-1.0.1-portable.zip`.
3. Edit `assets/downloads.js`:

```js
window.TUBEPILOT_DOWNLOAD_BASE =
  "https://github.com/YOUR-NAME/YOUR-REPO/releases/download/v1.0.1/";
```

`assets/downloads.js` also sets `TUBEPILOT_RELEASE_API`. The page fetches that
endpoint and prints the live GitHub download counters under the buttons, so
every download made through the site is included automatically (GitHub counts
each asset download). The counter sums all releases, so publishing a new
version does not reset it. Set the value to `null` to hide the counters.

**Cloudflare R2** (free tier, 10 GB):

1. Create a bucket and upload both files.
2. Enable public access or attach a custom domain.
3. Set `TUBEPILOT_DOWNLOAD_BASE` to the public bucket URL.

You can keep the local `downloads/` copies for offline testing; the deployed
site will use the base URL you configure. The download page also links to
`downloads/SHA256SUMS.txt`, so keep a copy of that file at the hosted location
or update the link.

## Demo video

`index.html#demo` and `index-ar.html#demo` play the narrated walkthroughs from
`assets/video/`. The language tabs swap `src`, poster and caption in place — no
framework and no external player. Both files are about 14–15 MB, under GitHub's
100 MB per-file limit, so they are committed with the site and need no extra
hosting.

Regenerate the poster frames after re-recording:

```powershell
$ff = "E:\Business\TubePilot\dist\TubePilot-1.0.0-portable\TubePilot\app\resources\tools\ffmpeg.exe"
& $ff -y -ss 3 -i assets\video\walkthrough-en.mp4 -frames:v 1 -vf "scale=1280:-2" -q:v 3 assets\video\poster-en.jpg
& $ff -y -ss 3 -i assets\video\walkthrough-ar.mp4 -frames:v 1 -vf "scale=1280:-2" -q:v 3 assets\video\poster-ar.jpg
```

Durations are written into the tab labels (`1:47` English, `2:24` Arabic);
update them if the recordings change.

## Social preview image

`assets/social/tubepilot-promo-1200x630.png` is the link-preview image used by
all four pages (`og:image` and `twitter:image`). It is a 1200×630 composition
built from the real Home screen, the brand palette and the walkthrough badge.
Keep the absolute URL in the meta tags in sync with the deployed domain if the
site moves.

If you change the app screenshot, rebuild the card at the same 1200×630 size so
social platforms do not crop the text.

## When you ship a new build

1. Rebuild the installer and ZIP (`.\build-exe.ps1 -Installer -Zip`).
2. Copy the new files over `downloads/`.
3. Recompute the hashes:

```powershell
Get-FileHash .\downloads\TubePilot-Setup-1.0.1.exe -Algorithm SHA256
Get-FileHash .\downloads\TubePilot-1.0.1-portable.zip -Algorithm SHA256
```

4. Update the two hash values and byte counts in `index.html`, `index-ar.html`
   and `downloads/SHA256SUMS.txt`.
5. If the version changes, update the version strings in the page titles, hero,
   download headings and footers, plus `TUBEPILOT_DOWNLOAD_BASE` in
   `assets/downloads.js`.
6. If you change the WhatsApp number or prices, update them in all four HTML
   pages (they are duplicated by design so the site stays static).

### Where to read the download total

The number shown on the site comes from GitHub. To read it directly:

```powershell
gh release view v1.0.1 --repo MatrixLeb/tubepilot-site --json assets
```

or open <https://github.com/MatrixLeb/tubepilot-site/releases> — each asset
lists its own download count. The site sums every asset in every release.

## Editing notes

- Keep the English and Arabic pages structurally in sync. Anchors such as
  `#install`, `#setup`, `#visuals`, `#youtube`, `#data`, `#legal` and
  `#troubleshooting` are linked from the landing pages, so do not rename them.
- Arabic pages use `dir="rtl"`; code snippets and file paths use `dir="ltr"`.
- Screenshots live in `assets/screenshots/`. `home-en.png` and `home-ar.png` are
  1366×705 Home-screen captures used by the language cards. Replace them at the
  same dimensions or update the `width`/`height` attributes to avoid layout shift.
  The hero is text-only and deliberately has no image.
- The site has no cookies, analytics or external fonts. The only outbound links
  are WhatsApp, the documentation, and the API-key sites named in the manual.
