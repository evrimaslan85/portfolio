# Portfolio

Show your work. Explain what you built, how it works, and why it matters.

Free, public project galleries and case studies. No account, activation key, email signup, or paid service required.

## Download

**Version 0.2.0 · Early release**

| Your website | Download ZIP | How it works |
| --- | --- | --- |
| WordPress | [WordPress plugin](https://github.com/evrimaslan85/portfolio/releases/download/v0.2.0/portfolio-wordpress-0.2.0.zip) | Install in your dashboard. Add and publish projects. |
| cPanel / ordinary web hosting | [Complete website](https://github.com/evrimaslan85/portfolio/releases/download/v0.2.0/portfolio-cpanel-0.2.0.zip) | Edit locally with the included visual editor, then upload. |
| Webflow | [Webflow embed kit](https://github.com/evrimaslan85/portfolio/releases/download/v0.2.0/portfolio-webflow-embed-0.2.0.zip) | Host the included portfolio, then use Code Embed. |
| Wix | [Wix embed kit](https://github.com/evrimaslan85/portfolio/releases/download/v0.2.0/portfolio-wix-embed-0.2.0.zip) | Host the included portfolio, then use Embed a Site. |
| Squarespace | [Squarespace embed kit](https://github.com/evrimaslan85/portfolio/releases/download/v0.2.0/portfolio-squarespace-embed-0.2.0.zip) | Host the included portfolio, then use an eligible Code block. |
| Another website | [HTML embed kit](https://github.com/evrimaslan85/portfolio/releases/download/v0.2.0/portfolio-html-embed-0.2.0.zip) | Works where external iframes are permitted. |

[All downloads and release notes](https://github.com/evrimaslan85/portfolio/releases/tag/v0.2.0) · [Installation help](docs/downloads.md)

The builder kits are **hosted embeds, not native Webflow/Wix/Squarespace apps or CMS imports**. Each includes the complete website, editor, embed-code generator, and platform instructions. You need HTTPS hosting; some builders require a paid plan for custom code. Hosting is not included.

## WordPress: three steps

1. Download the **WordPress plugin ZIP** above. Keep it zipped.
2. In WordPress, open **Plugins → Add New → Upload Plugin**, choose the ZIP, install, and activate.
3. Open **Portfolio → Setup / Import / Export**, create your Work page, then add and publish projects.

Or add `[portfolio]` to an existing page. Requires **WordPress 6.4+ and PHP 8.1+**. Back up and test on staging before adding it to an established website. It does not replace an existing MU-plugin implementation.

## cPanel: three steps

1. Download and unzip the complete website. Open **editor.html** in a current desktop browser.
2. Edit your projects and click **Download content.js**. Replace the supplied file with that download.
3. Upload the site and approved images into a **new folder**, such as `public_html/portfolio`.

No WordPress, database, Node.js, or build command needed. Editing happens locally; there is no server login or automatic save. Read the included **INSTALL.md**.

## What you get

Project cards and filters; overview, challenge, solution, and outcomes; expandable implementation details; evidence images and links; a simple architecture map/list; responsive and print styles; JSON import/export.

All included examples and results are fictional. Replace them with material you have permission to publish.

This is an early release, not universal theme/builder certification. The standalone site requires JavaScript. WordPress cards and stories remain readable without it. [Tests and known gaps](docs/verification.md).

## Free means free

Use it for personal or commercial projects. No forced branding or email collection.

The WordPress plugin uses **GPL-2.0-or-later**. The independent website, embed kits, shared contract, and docs use **MIT**. These licenses let people use, change, and share the software under their notice/source terms. Your project content stays yours. [License guide](docs/business/licensing.md).

For updates, use GitHub **Watch → Custom → Releases**. An optional mailing list may come later; no signup is connected now.

## More

[Help / issues](https://github.com/evrimaslan85/portfolio/issues) · [Documentation](docs/index.md) · [Architecture](docs/architecture/system.md) · [Contribute](CONTRIBUTING.md)

For developers: Node.js 22+, `npm test`, then `npm run build`. ZIPs go into `dist/`. GitHub's repository “Download ZIP” is the source repository, **not** the installable plugin.
