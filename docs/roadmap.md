# Scope and roadmap

The 0.2.0 early release ships an installable WordPress plugin, a cPanel/static website with local visual editor, and four hosted-embed kits. See the [current product pages](index.md) for observed behavior. The target matrix and milestones below retain earlier planning, including features not yet implemented; they are not a release checklist marked complete.

## What is complete in this repository

- Product concept and the two delivery specifications.
- Shared public schema and original fictional fixtures.
- Browser preview with both presentation forms, filtering, detail, and print styling.
- Licensing policy, migration plan, release rules, and repository validation.
- Six purpose-built downloadable ZIPs, shared browser renderer/validator, local visual editing and explicit file save, WordPress persistence/shortcode/REST/import-export, platform instructions, package/browser/WordPress release gates.

## Feature scope

| Capability | WordPress first release | Standalone first release | Later |
| --- | --- | --- | --- |
| Case-study narrative | Native editor fields | JSON authoring | Local visual editor |
| Implementation cards | Yes | Yes | Reusable authoring library |
| Grid and classifications | Block/shortcode/archive | Static listing | External-site embed |
| Evidence | Reviewed Media Library references/links | Reviewed local files/links | Managed media workflow |
| Architecture | Simple structured map plus text | Same contract | Visual graph editor |
| Outcomes | Claim, context, provenance | Same contract | Review workflow |
| Portability | Public JSON export/import | Same JSON input | Authenticated private backups |
| Customization | Focused theme-aware controls | Small theme configuration | Additional layouts |
| Print | Print stylesheet | Print stylesheet | Deterministic PDF export |
| External accounts | None required | None required | Explicit optional integrations |
| Collaboration/hosting/billing | Out of scope | Out of scope | Separate service decision |

## M0 — validate the concept

Use the preview, speak to prospective users, select a working product name, confirm rights for any source reused from the original site, and resolve the open decisions. Exit with a small acceptance-tested scope, not a growing wishlist.

## M1 — implement the content contract

Create production validators in the chosen runtimes, import/export fixtures, public projection logic, media rules, and version handling. Exit when valid data round-trips without private-field leakage and invalid inputs fail usefully.

## M2 — WordPress alpha

Implement install/activate/edit/preview/publish, listings, fallback case-study templates, scoped styling, permission checks, and public export/import. Test classic/block themes and prepare the existing site's migration report. Exit with a real installable ZIP and a documented support matrix.

## M3 — standalone alpha

Implement local validate/preview/build with deterministic HTML, safe media copying, base-path support, metadata, and print output. Exit when an approved WordPress export builds a coherent independent site and can be moved between hosts.

## M4 — beta and migration

Run pilots, accessibility/theme tests, import round trips, restore/rollback, and the original Work cutover on staging. Fix support-heavy tasks. Exit with no unresolved release-blocking defects and an owner for maintenance.

## M5 — release and distribution

Version packages independently, ship licenses/notices/changelog, run release checks, then publish through the selected channels. Submit to WordPress.org only when the plugin is complete and guideline checks are satisfied. Directory review/acceptance and name availability are not guaranteed.

## M6 — commercial experiments

Test setup services and support offers using actual scopes and costs. Add a separate paid extension or hosted service only after validation. None of these require making the core content proprietary.

## Definition of done for a product release

A working package, passing runtime/security/compatibility checks, accurate docs, tested content portability, reviewed public fixtures, license inventory, known support limits, reproducible artifacts, rollback instructions, and a maintained issue/security path. A concept preview or green documentation check alone does not meet that definition.
