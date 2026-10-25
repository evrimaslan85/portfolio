# Security and privacy

Scope: WordPress plugin, independent website/editor, hosted-iframe kits, version 0.2.0.

Report privately using GitHub private vulnerability reporting if enabled, otherwise ask for a private channel in a minimal issue. Do not publish credentials, exploit details, private URLs, or client records. No response SLA is offered.

## Controls

- Story save: target-post edit capability plus nonce. Admin setup/import/export: manage_options plus nonce.
- Plugin public queries: published and non-password-protected only; explicit projection, not arbitrary meta. No public mutating endpoint.
- Upload: 2 MB JSON limit, full validation before writes, draft-only import, known-ID skip. DB failures can leave partial drafts.
- PHP/browser output escapes text/attributes. Contract rejects unknown fields, broken references, unsafe URLs, credentials, and traversal paths.
- Editor persists only through explicit downloads. No accounts, server save, default telemetry/email collection, provider secrets, remote fonts, or arbitrary fetching.
- Packages use explicit sources, reject symlinks/unsafe entries, and include original fictional media.

## Publication limits

Validation is not permission to publish. Review rights, screenshots, captions, URLs, contextual identification, and outcome claims. Never publish private exports, client documents, secrets, signed-access URLs, or production backups.

WordPress Media Library and uploaded static files are public URLs, not confidential storage. Unpublishing does not erase old files or CDN/search/browser copies. Host cache invalidation is outside the plugin.

Authored external images/links can contact their hosts; default samples are local. Image/SVG sanitization is not supplied; use trusted media and WordPress upload restrictions. This is not a protected client portal.

Uploading editor.html makes it public, but grants no server-write capability. All content.js data is public even if not immediately visible as a card.

[Tests and known gaps](docs/verification.md). No independent audit/universal security assurance is claimed.
