# Deployment, releases, maintenance, change rules

## Build and release

The [README](../README.md) is the visitor-facing download page. Its purpose-built release ZIPs are not GitHub source snapshots.

Node.js 22+:

```sh
npm test
npm run build
```

Dependency-free build produces six ZIPs, SHA256SUMS.txt, manifest.json in dist/. Explicit sources only; no whole-workspace archive. Fixed entry order/timestamps; tests compare repeat builds in one environment and inspect entries, licenses, local targets, checksums, unzip integrity.

[release.yml](../.github/workflows/release.yml) runs on relevant main changes: source/contracts, PHP lint, build, browser, disposable WordPress install of exact ZIP, permission/publication/REST/HTTP checks, then prerelease publication using the runner's scoped repository token. Browser test tooling is pinned, not shipped.

Bump release.json, package.json, plugin header/class/readme, direct download links, and release notes together. Existing tags are not overwritten; an existing version causes publishing to fail. Verify published assets/hashes. Never publish a production website archive as the product.

## Deployment and recovery

WordPress: full database/media backup; staging; install/activate; new Work page or shortcode; add/preview/publish; verify permalinks, theme, filters, mobile. No automatic legacy migration or duplicate registration.

Static: new folder, relative files together, approved images, explicit content.js replacement. Back up the old folder before updates. Editor downloads to your computer, not server. Embed: HTTPS host, test embed.html, frame headers, eligible builder plan, then publish parent.

Plugin deactivation/deletion preserves data. Native revisions do not recover structured story fields. Public JSON excludes drafts/private/password-protected posts and binary media; it is not full recovery. Restore full site backups when needed.

Static rollback restores prior folder/content/media. Remove obsolete public files deliberately. WordPress uploads, old deployments, CDN, browser and search caches can remain reachable after unpublishing.

## Change rules

1. Preserve existing user work; legacy source/migration changes require separate review.
2. Document observed behavior and clearly label future targets.
3. Contract changes update schema, PHP/JS validators, wrappers, fixtures, imports, docs, and tests together. No silent schema breaks in patches.
4. Keep GPL plugin and MIT standalone boundaries; preserve source/notices and asset provenance.
5. Test auth/nonce, publication exclusions, hostile input, imports, packages, and public output after changes.
6. No hidden telemetry, mandatory signup, remote provider, or fetching without explicit approval/disclosure.
7. Public issues use sanitized reproductions, never credentials/client backups.
8. Review/pin build-tool updates. CI needs no production site credentials.
9. Fix failed release gates; do not bypass them.
10. No support SLA or universal compatibility promise currently exists.

Deferred: full WP/PHP/theme/multisite matrix, Plugin Check/directory submission, independent security/accessibility audit, live builder-account certification.
