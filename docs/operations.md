# Releases, distribution, and maintenance

## Current concept package

Run `npm test` on Node.js 22+. Open `prototype/index.html` in a browser for the visual preview. No dependency installation, production configuration, provider connection, or WordPress instance is required for these checks. The workflow validates the repository on pushes to main and pull requests.

The preview performs no network requests and has no editing/persistence backend. Repository checks do not prove WordPress installability, hosting support, accessibility conformance, or production security.

## Future release channels

| Artifact | Expected channel | Release requirements |
| --- | --- | --- |
| WordPress plugin ZIP | GitHub releases; WordPress.org after approval | Installable package, GPL notices, readme, tested version matrix, source/build instructions, Plugin Check and security review. |
| Standalone publisher | GitHub release; package registry if selected | Independent MIT implementation, locked dependencies, deterministic build, input/path tests, supported Node versions, source and notices. |
| Static site output | User-selected compatible host | Only approved public content/assets, base-path verification, stale-file removal, rollback to previous output. |
| Concept/docs/preview | Git repository | Clear status, valid references/fixtures, original/public content, accurate license scope. |

No registry package, WordPress.org submission, release ZIP, hosting project, domain, or production deployment exists as a result of this concept package.

## Versioning

Version the public contract and each runtime separately. A plugin bug fix need not force a standalone release. Record which contract versions each adapter reads/writes. Once stability is promised, do not make a schema-breaking change under a patch release. Use explicit migration tools and changelogs.

## Build and security checks when implementation starts

For WordPress: PHP syntax/coding checks, Plugin Check, authenticated capability and public-projection tests, HTML/URL escaping, malicious import fixtures, draft/private content tests, theme/accessibility checks, and deactivation/uninstall behavior.

For standalone: production schema validation, path/symlink/archive tests, media size/type limits, escaped output, deterministic build snapshots, clean/subpath hosting checks, no-network build checks, and missing-asset errors. Never put arbitrary content into a script block or execute imported markup.

Pin actual dependencies, record licenses, keep source available for shipped compiled code, and review update alerts. CI permissions should be minimal. Release publishing credentials remain in protected CI settings, never in project content or example configuration.

## Maintenance policy to set before release

Assign maintainers, supported versions, security response ownership, release cadence, support channels, and end-of-life policy. Do not claim a response SLA before capacity exists. User support should request sanitized reproductions; never ask someone to paste production credentials or a private WordPress backup into a public issue.

## Backups and deletion

WordPress content/media backups remain the site owner's responsibility. Document restore and plugin removal before promising portability. Static output rollback needs the previous build and deployment configuration. Deleting local content does not remove external copies or caches. A hosted product would require additional retention, export, deletion, and incident procedures.

## Change checklist

Update the relevant spec and fixtures with schema/behavior changes; review license boundaries and public output; run repository tests; run the relevant runtime tests when packages exist; document migrations; publish artifacts only after reviewing their exact contents.
