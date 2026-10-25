# Verification and gaps

Scope: early release 0.2.0, actual packages, fictional fixtures, release gates. Not comprehensive certification.

## Local repository/package checks

npm test on Node.js 22.22.0 passes ten tests plus local link, contract, credential-pattern, and JavaScript syntax checks. Covers supported schema keywords, unknown/private fields, IDs/slugs, evidence/technology/graph references, unsafe URL/path inputs, image alt text, canonical wrapper parity, ZIP layouts/notices, repeat builds, hashes, safe entries, and unzip integrity.

npm run build produces six purpose-built ZIPs. Local-link checks do not network-check every external documentation URL. Credential regexes are not confidentiality guarantees.

## Packaged browser checks

[tests/browser-smoke.cjs](../tests/browser-smoke.cjs) extracts actual cPanel and Webflow ZIPs, serves them locally, and uses a second-origin iframe parent. Locally passed on installed Chrome 155.0.8059.86 with Playwright 1.57.0 on 2026-10-25:

Cards; filters and empty state; details/dialog/Escape; repeated editor preview; adding project; content.js download and reopening saved data; hostile-text escaping; invalid JSON rejection; mobile width; HTTPS generator; cross-origin iframe; zero unexpected external HTTP requests and page errors.

This is not full accessibility, print, or cross-browser certification.

## WordPress release gates

[tests/wordpress-integration.php](../tests/wordpress-integration.php) runs on disposable WordPress/PHP 8.3, installing the exact generated ZIP. It checks activation, draft import, duplicate protection, authorized saves, nonce/capability rejection, sanitation, graph preservation, unsafe evidence, private/password/raw-meta exclusions, gallery/REST, PHP/JS contract agreement, and HTTP Work page. The run records WordPress/PHP versions.

Declared WP 6.4/PHP 8.1 minimums are not a full tested matrix. Consult the [workflow results](https://github.com/evrimaslan85/portfolio/actions) for the release commit. Defined tests are evidence only once the run passes.

## Gaps

No live cPanel or Webflow/Wix/Squarespace publication, full WP/theme/minimum-version/multisite matrix, Plugin Check/WordPress.org acceptance, complete translations/accessibility audit, structured-meta revision recovery, legacy migration, large/concurrent-site testing, or independent security audit.

No production website, private archive/client data, external CRM, mailing list, payments, or hosted service is connected.
