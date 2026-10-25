# Product and developer documentation

For downloading and trying the preview, start with the [main README](../README.md). This page holds the detailed planning and implementation references.

## Product plans

- [Concept and positioning](concept.md)
- [WordPress plugin specification](products/wordpress.md)
- [Standalone publisher specification](products/standalone.md)
- [Possible extensions](products/extensions.md)
- [User experience and design](experience.md)
- [Roadmap and scope](roadmap.md)

## Architecture and delivery

- [Shared content model](architecture/content-model.md) and [JSON Schema](../schemas/portfolio.schema.json)
- [System architecture and publication boundaries](architecture/system.md)
- [Migration from the original Work implementation](migration.md)
- [Security and privacy](../SECURITY.md)
- [Release and maintenance](operations.md)
- [Verification record](verification.md)
- [Decisions and open questions](decisions.md)

## Business and licensing

- [Licensing and ownership](business/licensing.md)
- [Download experience, optional signup, and owner controls](business/downloads-and-signup.md)
- [Commercial options and validation](business/business-model.md)
- [Sources and evidence boundaries](research/sources.md)
- [Third-party notices](../NOTICE.md)

## What runs today

The [browser preview](../prototype/index.html), [fictional content](../examples/portfolio.json), [schema](../schemas/portfolio.schema.json), and repository validation scripts are implemented. The WordPress plugin and standalone publisher are specifications, not working runtime packages.

Node.js 22 or later is required for the repository checks; the preview has no Node requirement. No dependency installation is needed.

```sh
npm test
```

The command checks local links, example/schema conformance, public asset paths, internal references, preview-data parity, and JavaScript syntax. Its six behavioral tests cover selected contract and unsafe-input cases. Product runtime checks will be added when those implementations exist.

Working name: Portfolio. Final names, registry/directory availability, and trademark clearance remain open.
