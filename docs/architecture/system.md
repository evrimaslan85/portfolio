# Architecture and data flows

Version 0.2.0 is implemented under [packages](../../packages). Independent PHP and browser renderers share the [public JSON contract](../../schemas/portfolio.schema.json), not a central service.

## Components

| Source | Responsibility |
| --- | --- |
| packages/wordpress-plugin/portfolio-case-studies.php | WordPress persistence, story validation, setup, import/export, public query, PHP rendering, REST |
| packages/wordpress-plugin/assets/admin.js and admin.css | Repeatable fields and Media Library selection; server validates all saves |
| packages/wordpress-plugin/assets/frontend.js | Current-page filters |
| packages/shared/schema.js and contract.js | Schema/reference/safe-source validation, defaults |
| packages/shared/portfolio.js and portfolio.css | Escaped views, filters/dialogs, print/mobile styles |
| packages/site/editor.html and editor.js | In-memory authoring, validated import, explicit file downloads |
| packages/site/index.html, site.js, site.css | Standalone shell, content.js loading, renderer mount |
| packages/embed | HTTPS iframe generator and platform instructions |
| scripts/build-release.mjs | Allowlisted ZIP assembly, manifest, checksums |
| tests and .github/workflows/release.yml | Source/package/browser/WordPress gates before publication |

## WordPress flow

Authenticated editor → nonce + target-post capability → sanitized story → contract validation → _cportfolio_data. Invalid story keeps prior story and displays a notice; WordPress native title/Excerpt can still save independently.

Public query → published non-password-protected posts → explicit project fields → shortcode/single case study or read-only JSON. Arbitrary meta is not exported. The active theme supplies outer layout; core REST retains WordPress's permission model.

Admin import → full validation → sanitize/revalidate → skip portable IDs → draft posts → classification-ID mapping → structured fields. A DB error can leave partial drafts; media is not fetched. Admin public export refuses collections above 1,000.

Persistence: posts, two taxonomies, structured-story and portable-ID meta, one Settings API option. No custom tables, scheduled jobs, provider secrets, central account, or plugin response cache. Host/page-cache/CDN invalidation remains outside the plugin.

## Standalone flow

content.js → schema/reference validation → escaped DOM. Editor changes memory → explicit file download → user replaces content.js → upload to host. No server writes, localStorage autosave, authentication, or API.

All uploaded files and content are public. Author-chosen external images/links may contact their hosts. Defaults are local. Supported data cannot inject executable HTML, credentialed URLs, unsafe schemes, or traversal paths.

## Builder flow

Local editing → downloaded content.js → HTTPS-hosted site → iframe in builder. No SDK, native CMS, or automatic sync. Frame height, builder code permissions, and hosting frame headers are external requirements.

## Isolation

WordPress ZIP includes only plugin code plus MIT shared CSS/schema/fictional examples and notices. Other ZIPs use independent MIT website/embed code. Builder rejects symlinks and unsafe entry paths.

Interactive Lab, MU loader, private archived source, CRM/automation integrations, client data, credentials, and production backups are excluded. cportfolio_project avoids silently taking over legacy portfolio_project. [Migration](../migration.md) remains a separate reviewed operation.
