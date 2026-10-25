# Standalone / cPanel website

Implemented early-release website and visual editor. [Download/install](../downloads.md). Source: [site](../../packages/site), [shared renderer/contract](../../packages/shared), [builder](../../scripts/build-release.mjs).

## Workflow and persistence

Open editor.html locally, edit, preview, download content.js, replace the supplied file, then upload the whole site into a new hosting folder. No Node/PHP/database/account/terminal required for users.

Unsaved edits live in browser memory; leaving prompts a warning. Downloads/JSON export are the durable saves. There is no server dashboard or automatic hosted-file update. Copy images separately into media/ and reference safe relative paths or HTTPS URLs.

JSON import validates before replacing memory state. Unknown fields, unsafe paths, and broken references are rejected. All content.js fields are public; this is not private-note storage.

## Rendering and deployment

index.html loads content.js and bundled assets. The renderer validates and escapes data, shows filterable cards, case-study dialog, sections, implementations, evidence, graph/list, and results/provenance. Filters cover the loaded file. embed.html removes the outer website navigation/footer.

JavaScript is required. Separate crawlable project pages, sitemap, per-project social metadata, and a CLI static-site generator are not implemented; those were earlier target ideas. Print styles are included.

The ZIP is ready to upload with index.html, editor.html, embed.html, content.js, assets/, media/, LICENSE, INSTALL.md. Relative assets support subdirectory hosting. Default assets are local and examples fictional.

Back up before updates. Everything uploaded is publicly reachable. Removing a local file does not remove host/CDN/search copies. No authentication, protected client portal, server contact processing, telemetry, provider integration, or hosting is supplied.

Independent MIT implementation; no GPL-only plugin runtime copied into the site.
