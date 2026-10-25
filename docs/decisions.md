# Decisions and open questions

## Current decisions

| Decision | Rationale | Revisit when |
| --- | --- | --- |
| Two initial forms: WordPress and standalone static | Serves existing-site owners and people without WordPress while keeping operations small. | User research shows a different authoring need. |
| One portable public contract, separate runtimes | Allows content movement without copying GPL-only runtime code into an MIT package. | A concrete technical constraint requires a versioned extension. |
| Work/case studies only | Gives the first product a focused purpose and avoids inheriting the Lab integrations. | A validated extension has its own security/maintenance scope. |
| MIT for current original artifacts/independent standalone; GPL-2.0-or-later for the planned WP runtime | Clear reuse with WordPress-compatible distribution. | A rights/dependency review establishes a different requirement. |
| No default telemetry or required service account | Basic publishing can run locally on the user's chosen system. | An explicitly opted-in service provides real value. |
| No archived production code or client content in this public concept | Keeps product design independent of private assets and unverified redistribution rights. | A specifically reviewed source import is proposed. |
| File-based standalone authoring first | A useful publisher is smaller than building an editor and hosted platform together. | Tests show editing files prevents adoption. |

## Open decisions

- Final product name and package namespaces; check directory/registry availability and trademarks.
- Exact first-release WordPress/PHP/Node support matrix after implementation tests.
- Whether the WP editor uses custom field panels inside Gutenberg or a dedicated editing screen; test with real authors.
- Which legacy mode offers the least disruptive cutover for the existing Work section.
- How approved media and portable archive manifests will be managed in production.
- Whether the simple architecture model meets user needs without a diagram editor.
- Which customer segment should be the first pilot group.
- Which support/setup offer, if any, has demonstrated paid demand.

These questions do not block the concept package. They block unsupported claims about a finished product or a production release.
