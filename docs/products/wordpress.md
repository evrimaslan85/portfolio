# Portfolio for WordPress

Status: proposed product specification. No installable plugin is included in this repository yet.

## Promise

Install a plugin, add a project, describe the work, attach evidence, and publish a clear Work section on an existing WordPress site.

## First-use journey

1. Activate the plugin. A scoped setup screen offers a new Work archive or a grid on an existing page.
2. Add the first project: title, summary, overview, challenge, solution, and outcomes.
3. Add optional implementation cards, technologies, architecture, and media.
4. Preview the project in the active theme. Check accessibility, mobile layout, and the public evidence summary.
5. Publish through normal WordPress permissions. Choose whether to add navigation; do not silently replace the site's home page or menu.

No sample content is inserted automatically. Importing fictional examples is an explicit action and creates drafts.

## MVP features

| Area | Required behavior |
| --- | --- |
| Projects | A namespaced project post type; native draft, published, private, revision, and trash behavior. |
| Classification | Systems/services and technologies; labels may be changed without changing internal identifiers. |
| Case-study editor | Structured sections, repeatable implementation cards, media selection, field descriptions, and an ordered preview. |
| Listings | Responsive grid, category and technology filters, pagination, empty states, and links that work without JavaScript. |
| Project page | Semantic headings, optional sections, media captions, accessible evidence links, and a clear optional CTA. |
| Placement | A server-rendered project-grid block and shortcode using the same query/render service. Full project pages have a bundled fallback template. |
| Appearance | Theme inheritance plus small scoped style settings: accent, width, card density, section order, and button text/link. |
| Portability | Authenticated import/export of the public exchange format. Exports include published, explicitly approved content only. |
| Lifecycle | Activation registers rewrites once; deactivation preserves data; deletion requires a separate explicit data-removal choice. |

The shortcode and block syntax remain provisional until the final slug and namespace are chosen.

## Proposed package boundary

```text
wordpress-plugin/
  portfolio.php           plugin header and bootstrap
  includes/               post types, meta, capabilities, settings, queries
  admin/                  editing and authenticated import/export
  blocks/project-grid/    registered block and assets
  templates/              accessible fallbacks
  assets/                 local CSS/JS only
  languages/              translation template
  readme.txt              WordPress.org distribution readme
  license.txt             GPL version 2 or later
  uninstall.php           respects the explicit deletion setting
```

This is a target layout, not a list of implemented files.

## Theme and plugin compatibility

Use plugin-relative paths and WordPress URL helpers. Avoid fixed MU-plugin paths and site domains. Classic and block themes need separate integration tests; support is earned by those tests, not implied by calling `get_header()`.

Let themes override documented templates. Avoid global resets. Keep styling under a plugin wrapper. Use WordPress script dependencies and local assets. The listing must remain readable when JavaScript fails.

SEO metadata should have one owner. Use core output by default and an optional tested Yoast adapter when Yoast is active; do not emit duplicate titles, descriptions, or social tags. Other SEO integrations follow only after testing.

No mandatory Supabase, ClickUp, HubSpot, Make, page-builder, or analytics dependency is proposed.

## Permissions and public output

Check the target post's edit capability for every authoring mutation and import/export action. Use nonces for cookie-authenticated requests and permissions for authorization. A nonce alone is not a capability check. Public endpoints return only an allowlisted projection of published projects and approved evidence; never a raw dump of post meta.

Private/draft content must remain absent from grids, REST responses, search snippets, sitemaps, exports, and public attachment manifests. Media Library files can remain publicly reachable by URL; the plugin cannot promise private file storage on a standard public uploads directory.

## Release acceptance

- Install and activate on clean supported WordPress/PHP combinations with debugging enabled.
- Create, edit, preview, publish, unpublish, and export a project using a non-admin editor.
- Verify a subscriber and anonymous user cannot edit or export drafts/private content.
- Test a classic theme and a block theme, keyboard navigation, small screens, reduced motion, and a non-English locale.
- Verify no external request occurs from the default plugin configuration.
- Run Plugin Check, PHP coding/security checks, and the import/export fixtures.
- Test migration collision detection before replacing the site's existing MU registration.

Exact supported WordPress/PHP versions are selected during implementation and recorded in release metadata after testing. Do not copy the legacy archive's version as a support claim.

See [migration](../migration.md), [licensing](../business/licensing.md), and [operations](../operations.md).
