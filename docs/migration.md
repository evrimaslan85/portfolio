# Migrating the existing Work section

This is a migration design, not an executed migration. The current website and the original audit repository are unchanged by this product concept.

## Known starting shape

The inspected implementation uses `portfolio_project`, the taxonomies `portfolio_category` and `portfolio_technology`, registered `portfolio_*` meta, repeated `portfolio_implementations` JSON, and custom MU templates/styles. Its core also includes Lab SEO behavior, fixed site links, and a Supabase health route that do not belong in the independent Work package.

Original evidence locations:

- `wp-content/mu-plugins/portfolio-core.php`: `consultevo_register_project_post_type`, `consultevo_register_project_meta`, `consultevo_save_project_details`, `consultevo_get_implementations`, and template/asset hooks.
- `wp-content/mu-plugins/consultevo-portfolio/templates/archive-project.php` and `single-project.php`.

These are source observations. The filesystem archive did not supply the WordPress database, so actual project counts, IDs, content values, and activation state remain unknown.

## Proposed mapping

| Existing data | Portable concept | Migration treatment |
| --- | --- | --- |
| `portfolio_project` post title/excerpt | title/summary | Preserve content; create a portable ID once and store the mapping. |
| Existing permalink | slug plus adapter route | Preserve route where possible; record redirects for changes. |
| `portfolio_overview`, `portfolio_challenge`, `portfolio_system`, `portfolio_results` | overview/challenge/solution/outcomes | Convert permitted formatting to the v0.1 plain-text contract; warn about formatting loss. |
| `portfolio_implementations` JSON | implementations | Parse, preserve editorial order, report malformed data, and map technologies/evidence. |
| Taxonomy term IDs | stable IDs and labels | Generate portable slugs and preserve a local term map. |
| Attachment IDs / section visual fields | evidence | Resolve only reviewed public media; do not export uploads wholesale. |
| Architecture source/automation/operations/data/output labels | nodes/edges | Mapping needs review; the source fields do not prove every connection. |
| Project/client label | optional public client display label | Require an explicit content/rights decision. |
| Post status / private notes | authoring state | Keep local; omit from the public exchange document. |

## Safe cutover sequence

1. Obtain a protected database/media backup and a working staging restore. Record active MU files, plugin/theme state, project counts, routes, and baseline screenshots.
2. Build a read-only inventory and migration report. Do not publish media or case studies as part of discovery.
3. Run the new plugin in a guarded legacy compatibility mode on staging. If the old MU implementation still registers the same post type/functions, show a clear conflict and stop the takeover.
4. Extract/retire only the old Work responsibilities in a controlled deployment. Preserve separate Lab responsibilities still required by the existing site. MU plugins cannot be disabled through the ordinary Plugins screen.
5. Test editing, revisions, every important Work route, classifications, visual slots, social metadata, proof consumers, and rollback. Confirm Lab still works if it remains installed.
6. Compare counts, content checksums, approved evidence, routes, and public output. Resolve every skipped or malformed field explicitly.
7. Back up again, cut over during a recorded window, purge relevant caches, and verify anonymously.

No automated migration utility is included yet. A migration must support dry run, stable mapping, idempotent retries, and a report; it must never change publication state merely because data was imported.

## Rollback and removal

Retain the previous reviewed MU code and a matched database/media snapshot. A file rollback alone cannot reverse content/schema changes. Default deactivation preserves content. Any uninstall purge is explicit, scoped, and recoverable from backup. A migration should not remove the original metadata until the new implementation and rollback have been exercised.
