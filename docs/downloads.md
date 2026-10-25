# Choose your download

Use the direct ZIP links in the [README](../README.md), or the [0.2.0 release](https://github.com/evrimaslan85/portfolio/releases/tag/v0.2.0).

## WordPress

Download portfolio-wordpress-0.2.0.zip. Keep it zipped. Upload through **Plugins → Add New → Upload Plugin**, then activate.

Open **Portfolio → Setup / Import / Export**. Create a Work page or place `[portfolio]` on an existing page. Add projects under **Portfolio → Add Project**. Title and Excerpt control the card; the story editor holds sections, implementations, evidence, architecture, and results. Systems/Services and Technologies control filters. Publish when ready.

Optional samples import as drafts. Draft, private, and password-protected projects are excluded from the plugin's public gallery, public export, and custom REST endpoint. Media Library URLs are not confidential storage.

Requires WordPress 6.4+, PHP 8.1+. The theme supplies the outer shell. No external account or page builder required. JSON export includes public projects only, up to 1,000; it is not a full backup. Media moves separately. Structured story fields do not have revision recovery in this release.

## cPanel and ordinary hosting

Download portfolio-cpanel-0.2.0.zip. Unzip locally, open editor.html, edit, preview, and click **Download content.js**. Replace the supplied content.js with that download. Export JSON for an editable backup.

Upload all website files into a new folder such as public_html/portfolio; do not overwrite an existing site. Alternatively upload the ZIP into that new folder and extract using cPanel File Manager. Keep index.html, content.js, assets/, and media/ together. Upload approved images to media/ and reference their relative paths. Read the included INSTALL.md.

If you extract the original download ZIP on the server, upload your **edited content.js afterward** to replace its fictional sample data. The original ZIP does not change when you edit the local folder. Uploading the edited local files directly also works.

No PHP, database, package installation, or terminal is required. The editor downloads files to your computer; it does not update hosted files automatically. Everything uploaded is public, including the editor and content file. Neither contains a server password or server-write capability.

## Webflow, Wix, Squarespace, HTML

Choose your platform's embed ZIP. Each contains hosted-portfolio/ (complete website/editor), make-embed.html (local code generator), INSTALL.md, and START-HERE.html.

Edit the included site as above, then host hosted-portfolio/ on HTTPS hosting you control. Put the resulting HTTPS embed.html URL into the generator.

Webflow: paste generated iframe into Code Embed on an eligible plan. Wix: use Embed Code → Embed a Site with that URL. Squarespace: paste the iframe into a Code block with source display disabled, on an iframe-capable plan. Other builders must permit external iframes.

These are not native apps, marketplace extensions, CMS importers, or automatic builder uploads. They do not supply hosting or bypass plan restrictions. Hosting frame headers must permit the parent site. Height is manual; long stories can scroll inside the frame.

Generic cross-origin iframe rendering is browser-tested. No live Webflow/Wix/Squarespace account has been used to certify publication.

## Updates

Each release includes SHA256SUMS.txt and manifest.json. Keep your prior ZIP, JSON backup, media, and full WordPress/site backup before updating.

[Verification](verification.md) · [Operations](operations.md) · [Licenses](business/licensing.md)
