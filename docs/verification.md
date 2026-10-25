# Verification record

Date: 2026-10-25. Scope: this concept repository and its original fictional preview. WordPress and standalone product runtimes are not implemented and were not tested.

## Repeatable repository checks

Run `npm test` with Node.js 22 or later. The command has no dependency-install requirement.

- Validate the example against every schema keyword used in the bundled subset.
- Reject unknown/private fields and unsupported schema versions.
- Check portable IDs, unique routes, evidence/technology references, and graph edges.
- Check dangerous media schemes, path traversal, encoded bypasses, and URL credentials.
- Require image alternative text and keep the browser data identical to the example JSON.
- Check local documentation/HTML targets exist and scan text artifacts for selected credential patterns.
- Check browser JavaScript syntax.

Six behavioral tests passed locally on Node.js 22.22.0. The GitHub workflow runs the same repository command; inspect its actual result on the current commit before relying on it. External documentation URLs were researched separately, not network-checked by `npm test`.

## Browser smoke check

The installed Google Chrome engine was driven locally through Playwright using the `file://` preview on 2026-10-25. Checks passed for:

- Three initial project cards and both presentation modes.
- System/technology filtering, including an empty result.
- Case-study dialog, expandable implementations, Escape, and focus return.
- Print-media styling that hides the surrounding listing and removes dialog clipping.
- A 390-pixel mobile viewport without horizontal page overflow.
- No browser JavaScript/console errors and no HTTP/HTTPS requests during the tested interactions.

Screenshots were inspected at desktop size; the README image is an original capture of the fictional preview. The browser test used the machine's installed tooling rather than adding a runtime dependency to the concept package. To reproduce manually, open `prototype/index.html`, switch forms, combine filters, open/close a case study with the keyboard, inspect print preview, and check a narrow viewport.

## Limits

This is not a complete accessibility audit or cross-browser certification. It does not test a WordPress install, a production importer, a static-site generator, external hosting, directory acceptance, rights to client materials, or live customer integrations. No schema or credential regex can determine whether content is confidential or approved for publication.
