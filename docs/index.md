# Documentation

Start with [downloads and installation](downloads.md). The [README](../README.md) has six direct ZIP links.

## Shipped in 0.2.0

- [WordPress plugin](products/wordpress.md)
- [Standalone / cPanel website and editor](products/standalone.md)
- [Builder embed kits](products/extensions.md)
- [Architecture and data flows](architecture/system.md)
- [Public format](architecture/content-model.md) and [JSON Schema](../schemas/portfolio.schema.json)
- [Security](../SECURITY.md)
- [Deployment, maintenance, release/change rules](operations.md)
- [Verification and gaps](verification.md)
- [Licensing](business/licensing.md) and [notices](../NOTICE.md)

## Plans retained for reference

[Concept](concept.md), [experience](experience.md), [roadmap](roadmap.md), [migration](migration.md), [decisions](decisions.md), and [business options](business/business-model.md) include future targets. Current product pages and verification are authoritative about implemented behavior.

[Optional signup](business/downloads-and-signup.md) remains a plan. No mailing service is connected.

## Developer checks

Node.js 22+; no install needed for core checks:

```sh
npm test
npm run build
```

Build creates six ZIPs, SHA256SUMS.txt, and manifest.json in dist/. Browser tests need Playwright/Chromium; WordPress integration needs disposable WordPress/MySQL. See [release workflow](../.github/workflows/release.yml).
