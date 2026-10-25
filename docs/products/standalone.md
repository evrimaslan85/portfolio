# Portfolio Standalone

Status: proposed product specification. The repository contains a browser preview of its presentation, not a publishing tool.

## Promise

Create a case-study portfolio without WordPress or a database. Keep the source content, produce a static website, and move the result between hosts.

## First release: a file-based publisher

The smallest useful independent product is a static publisher. An author starts with a documented JSON file and approved local media. A local command validates the public content and builds listing pages, project pages, filters, a sitemap, and social metadata. The output is ordinary HTML/CSS with optional progressive JavaScript.

The following are proposed commands, **not available commands today**:

```text
portfolio init
portfolio validate ./content/portfolio.json
portfolio preview ./content/portfolio.json
portfolio build ./content/portfolio.json --output ./dist
```

Users comfortable with Git can version their source content. Users who want only a visual interface should start with the WordPress product until a standalone editor is implemented.

## Input and output contract

| Input | Output |
| --- | --- |
| One validated public portfolio document | Index/listing plus a stable route per project |
| Approved local media referenced by safe relative paths | Reviewed copies under the output assets directory |
| Appearance and site settings | Scoped theme CSS, configured title/navigation/CTA |
| Optional approved external evidence links | Outbound links; embeds require a separate explicit choice |

A publisher must reject traversal, symlinks escaping the input root, executable markup, unsafe URL schemes, duplicate slugs, broken evidence references, and unknown schema versions. It must not silently download remote media or fetch arbitrary URLs while building. Local media copying is bounded by explicit file and size rules.

## MVP behavior

- Clean project grid and full case-study pages.
- System/technology filters, with readable output without JavaScript.
- Implementations, evidence, architecture as an accessible list/map, and outcomes with their provenance.
- Responsive output, print styles, descriptive page titles, canonical URLs, sitemap, and social metadata from explicit public fields.
- Local preview and deterministic builds: identical input/settings produces identical output, apart from explicitly enabled build metadata.
- Relative asset paths and a configurable base path so a subdirectory installation works.
- A ZIP or directory of output for any compatible static host; no host provisioning or domain purchase is included.

## Later: a local visual editor

A browser or desktop editor could let authors reorder sections, manage evidence, preview both forms, and export the same content file. First validate whether file editing is an adoption barrier. Avoid shipping a browser-only editor that promises durable storage while relying solely on temporary browser storage. A visual editor needs explicit save/export, recovery, version migration, and media handling.

## Limitations worth stating

A static site has no built-in contact processing, private visitor portal, realtime editing, or access-controlled file sharing. A noindex tag does not make a case study confidential. Deleting a page from a build does not remove copies from CDN caches, source repositories, screenshots, or search indexes.

No multi-tenant backend is needed for the first release. Hosting, account recovery, collaboration, analytics, subscriptions, and support commitments belong to a later service decision.

## Acceptance

Build and navigate a sample at the domain root and a subpath; inspect output with JavaScript disabled; run keyboard/mobile checks; reject invalid/unapproved input; verify output includes only selected assets; inspect archives for private files; move the same build to a second local static server without changing the project content.

The planned standalone implementation is MIT licensed and must be independent of GPL-only WordPress runtime code. The shared schema is MIT and can be used by both.
