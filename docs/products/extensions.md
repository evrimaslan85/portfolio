# Website builder kits and other forms

## Shipped in 0.2.0

Separate Webflow, Wix, Squarespace, and HTML embed ZIPs. [Downloads](../downloads.md).

Each includes hosted-portfolio/ (complete standalone site/editor), make-embed.html (offline code generator), START-HERE.html, and platform INSTALL.md. Generator accepts HTTPS URLs without credentials and bounded height, escapes output, and contacts no entered URL.

Host the portfolio over HTTPS, then iframe its embed.html. Webflow uses Code Embed; Wix uses Embed a Site; Squarespace uses an iframe-capable Code block. Plan limits and official guidance are in each kit.

These are **not native marketplace apps, CMS importers, automatic platform uploads, or PHP plugins for builders**. No account is connected. Hosting frame headers and builder plan permissions are external requirements; frame height is manual.

Generic cross-origin rendering is tested in a browser. No live builder account publication is certified.

MIT packages. Source: [embed files](../../packages/embed), [site](../../packages/site), [shared](../../packages/shared). No platform SDK/provider credentials.

## Future, not shipped

Native apps/CMS adapters, a React package, hosted collaboration, dedicated PDF export, managed hosting, and optional signup require separate approval/design/testing. Browser print styles exist, not a server-side PDF product.
