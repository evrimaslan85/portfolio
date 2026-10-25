# Security and privacy

Current scope: original concept documents, fictional fixtures, and a local browser preview. There is no production account service or WordPress runtime here yet.

## Reporting

Use GitHub private vulnerability reporting if it is available for this repository. Otherwise open a minimal issue asking for a private reporting channel, without exploit details, credentials, client content, or private URLs. No response-time guarantee is currently offered.

## Publication rules

Schema validity is not permission to publish. Review client permissions, screenshots, captions, URLs, contextual identification, and claim provenance. Never commit client documents, credentials, raw exports, private case studies, signed-access links, or production provider data. Renaming a client does not anonymize their underlying evidence.

## Required implementation controls

- Server-side publication filtering and explicit public fields before output/export.
- Capability checks for writes and private exports; nonces supplement authentication rather than replace it.
- Escaped output and no executable imported HTML in the initial contract.
- Bounded payload/media sizes; safe paths, archive extraction, and symlink handling.
- Local assets and no default telemetry or arbitrary remote fetches.
- Cache invalidation on unpublish and documented limitations of public uploads/CDNs.
- Honest provenance for illustrative, reported, and measured outcomes.

The preview uses only its bundled fictional public data and performs no network requests. It does not implement an importer or confidentiality workflow. Future runtime packages need their own threat review and tests before release.
