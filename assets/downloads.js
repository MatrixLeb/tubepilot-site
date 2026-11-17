/*
 * Download location configuration.
 *
 * Local previews (file:// or localhost) serve the 1.0.2 files staged in
 * website/downloads/ directly. Deployed copies use the identical GitHub
 * Release assets, because a 275 MB installer cannot be committed to GitHub
 * Pages / Netlify / Cloudflare Pages alongside the site.
 *
 * Change the URL below if you move the hosted files (e.g. to Cloudflare R2).
 */
var tubepilotLocalPreview =
  window.location.protocol === "file:" ||
  /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);

window.TUBEPILOT_DOWNLOAD_BASE = tubepilotLocalPreview
  ? "downloads/"
  : "https://github.com/MatrixLeb/tubepilot-site/releases/download/v1.0.2/";

/*
 * Public GitHub API endpoint the site reads to show live download counts.
 * The list covers every release, so the total keeps growing across versions
 * instead of resetting when a new build is published. Set to null to hide it.
 */
window.TUBEPILOT_RELEASE_API =
  "https://api.github.com/repos/MatrixLeb/tubepilot-site/releases?per_page=100";
