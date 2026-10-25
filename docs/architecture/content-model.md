# Shared content contract

Version: `0.1.0`, design-stage. Machine definition: [portfolio.schema.json](../../schemas/portfolio.schema.json). Example: [portfolio.json](../../examples/portfolio.json).

## Separate authoring from publication

Authoring systems may hold drafts, internal notes, approval records, attachment mappings, and private client names. The exchange format in this repository describes an **already reviewed public portfolio**. Passing its schema is not approval and cannot establish rights or confidentiality.

Every implementation needs an explicit publication step that selects published records, builds a public allowlist, checks evidence approval, and strips internal fields before serialization. Never ship the full authoring record to a browser and hide sensitive fields with CSS.

## Objects

| Object | Purpose | Important rules |
| --- | --- | --- |
| Portfolio | Title, summary, locale, projects | `schemaVersion` is explicit; unsupported versions fail. |
| Project | A complete story about one engagement | Stable portable ID plus unique URL slug; title/summary required. |
| Client | Optional public display label | No legal name or contact fields; review contextual identification separately. |
| Systems / technologies | Classification objects with stable IDs and labels | IDs are portable slugs, not local WordPress term IDs. |
| Sections | Overview, challenge, solution, outcomes | Plain text in v0.1; render as text, not executable HTML. |
| Implementation | One concrete deliverable | Has its own title, summary, details, status, technology references, and evidence references. |
| Architecture | Nodes and directed edges | Node IDs unique; edge endpoints must exist; a textual equivalent is required. |
| Result | An outcome claim and its basis | `provenance`: illustrative, reported, or measured; context is required. |
| Evidence | Approved image, video link, or public URL | Stable ID; title/caption/alt; no embedded credentials or arbitrary iframe HTML. |

Delivery statuses are `live`, `completed`, `ongoing`, or `prototype`. They do not determine whether a project is publishable. Publication/private-state fields do not belong in this public contract.

## Identity and references

Project IDs survive export/import and are independent of WordPress post IDs. Slugs are editable route labels; changing one requires redirects in the publishing adapter. Repeated imports match a stored portable ID, never an arbitrary external ID supplied to overwrite unrelated records.

Implementations reference technology IDs defined on their own project. Sections, implementations, and results reference evidence IDs on that project. Architecture edges reference node IDs. Validate these relationships after ordinary JSON Schema validation. Arrays preserve editorial order; objects should not be used as an ordering mechanism.

## Evidence and media

`src` may be a safe relative media path or an HTTPS URL. The standalone builder may copy approved relative files; it must not resolve an arbitrary filesystem path or fetch remote media automatically. A WordPress adapter maps portable references to attachment IDs locally; attachment IDs are not part of a cross-site export.

Reject `..`, absolute filesystem paths, protocol-relative URLs, `file:`, `javascript:`, `data:`, credentials in URLs, and encoded path bypasses. A safe scheme does not prove a URL is approved. Signed access links, tokens in query strings, filenames, embedded image metadata, screenshots, and external redirects require a separate content review.

Video is a link in the initial format. Embedding a service later requires supported providers, explicit visitor interaction where appropriate, and a review of requests/cookies. Raw HTML and script strings have no executable meaning in v0.1.

## Results and truthfulness

`illustrative` means demonstration data and is labeled as such. `reported` means supplied by the author/client and must explain its basis. `measured` means the author has a measurement and context, not that the software verified it. An evidence URL does not automatically validate a causal claim.

The example portfolio is entirely fictional. Its figures are illustrative and must never be presented as customer proof or product performance.

## Version and migration policy

The schema is pre-release and may change. Record migration instructions for every shape change. Before 1.0, adapters should reject unsupported versions instead of guessing. At 1.0, commit to a defined compatibility window and a round-trip suite.

Future private authoring export is a different authenticated backup format with a conspicuous warning, not a flag that makes the public format include secrets. Media archives need a separate manifest, checksums, archive-size limits, and traversal protection. They are not specified as working features here.

## Validation today

`npm test` validates the fictional example against the used schema subset, checks cross-references and safe paths, and checks preview-data parity. The bundled validator is a concept-package check, not a general JSON Schema engine or a production import security boundary. A future importer should use maintained standards-compliant validation plus adapter-specific authorization, media, and size controls.
