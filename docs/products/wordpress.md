# WordPress plugin

Implemented early release 0.2.0. [Download/install](../downloads.md). Source: [plugin entry point](../../packages/wordpress-plugin/portfolio-case-studies.php).

## Authoring and setup

Registers cportfolio_project, separate from legacy portfolio_project, with native title, Excerpt, publication status, thumbnail, and native-field revisions. Adds cportfolio_system and cportfolio_tech classifications. A structured metabox stores story sections, implementations, evidence, architecture steps, and outcomes/provenance.

The Media Library picker selects URLs. Plain-text fields do not execute imported HTML. The setup page offers explicit Work page creation, optional fictional draft import, heading/introduction/contact-button settings, and JSON import/export. It does not replace an existing Work page, front page, menu, MU-plugin, or theme.

## Presentation

Shortcode `[portfolio]` server-renders 24 cards per page, pagination, real project permalinks, and optional JavaScript filters for the **current page**, not the whole database.

The singular the_content filter appends the structured story inside the active theme. Theme header/footer/layout remain in charge; a theme may already render the project title. There is no bundled theme/fallback template. Local scoped assets keep cards/stories readable without JavaScript. Authored images/links can load external resources; video evidence is an outbound link, not an automatic player.

## Persistence

- WordPress posts/taxonomies, _cportfolio_data structured meta, _cportfolio_portable_id duplicate mapping, cportfolio_settings option; no custom tables.
- Imported technology IDs map to stable local term identities, preserving existing same-label terms.
- Story meta is **not revisioned** in 0.2.0. Native revisions do not restore those fields.
- Deactivation/deletion preserves posts, terms, settings, and media. Full backup is the recovery method.
- Story saves require nonce plus edit_post. Administrative setup/import/export require manage_options plus nonce.

## REST and portability

Anonymous **GET /wp-json/portfolio/v1/projects?page=1** returns 50 public projects per page in the shared contract. Draft/private/password-protected posts and arbitrary post meta are excluded. There is no public mutating endpoint. Core native REST permissions still apply; custom story meta is not exposed as raw registered REST meta.

Upload import limit is 2 MB. Entire document is validated before writes, then sanitized/revalidated. Imports create drafts and skip existing portable IDs. Database failures may leave partial drafts; no transaction/rollback. Media is never fetched or copied.

Export includes public, non-password-protected projects only and refuses collections above 1,000 instead of silently truncating. It is not a full backup. Public title/summary/classification labels are bounded to contract lengths; native values may be longer. Relative evidence paths resolve against the site origin and need review when moving sites.

## Requirements and gaps

Declared minimum WP 6.4/PHP 8.1. Release CI uses the current WordPress download and PHP 8.3, not a full version/theme/multisite matrix. [Verification](../verification.md).

Not implemented: Gutenberg grid block, structured-meta revision recovery, arbitrary visual graph editor, automatic legacy migration, SEO adapters, broad theme/multisite certification, complete translations, Plugin Check/WordPress.org submission.

GPL-2.0-or-later runtime; MIT shared CSS/schema/examples retain notices. No private site source or Interactive Lab integrations included.
