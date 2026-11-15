/*
 * Download location configuration.
 *
 * TubePilot 1.0.0 installers are hosted as GitHub Release assets because they
 * are far larger than GitHub Pages allows in a repository. The site itself is
 * published from the same repository with GitHub Pages.
 *
 * Point this at another folder (Cloudflare R2, your own server) if you move the
 * files. Leave it as "downloads/" when testing with the local copies in
 * website/downloads/.
 */
window.TUBEPILOT_DOWNLOAD_BASE =
  "https://github.com/MatrixLeb/tubepilot-site/releases/download/v1.0.0/";
