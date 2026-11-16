/*
 * Download location configuration.
 *
 * TubePilot 1.0.2 installers are hosted as GitHub Release assets because they
 * are far larger than GitHub Pages allows in a repository. The site itself is
 * published from the same repository with GitHub Pages.
 *
 * Point this at another folder (Cloudflare R2, your own server) if you move the
 * files. Leave it as "downloads/" when testing with the local copies in
 * website/downloads/.
 */
window.TUBEPILOT_DOWNLOAD_BASE =
  "https://github.com/MatrixLeb/tubepilot-site/releases/download/v1.0.2/";

/*
 * Public GitHub API endpoint the site reads to show live download counts.
 * The list covers every release, so the total keeps growing across versions
 * instead of resetting when a new build is published. Set to null to hide it.
 */
window.TUBEPILOT_RELEASE_API =
  "https://api.github.com/repos/MatrixLeb/tubepilot-site/releases?per_page=100";
