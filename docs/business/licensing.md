# Licensing and ownership

Policy date: 2026-10-25. This is the project's practical licensing plan, not an opinion about any particular client's contract or a guarantee of directory acceptance.

## Current files and planned packages

| Material | License / treatment | Why |
| --- | --- | --- |
| Original concept docs, JSON Schema, validation scripts, browser preview, and fictional examples currently here | [MIT](../../LICENSE) | Easy reuse of the concept and independent implementations, including commercial use. |
| Planned WordPress plugin runtime | GPL-2.0-or-later, with a package notice and [full GPL text](../../LICENSES/GPL-2.0-or-later.txt) | Aligns with WordPress's recommended plugin license. |
| Planned independently written standalone publisher | MIT | Allows people to adapt and commercially use the standalone tool. |
| Shared original JSON content contract | MIT | Both adapters can implement it without sharing GPL-only runtime code. |
| Future third-party libraries, assets, or copied source | Their actual licenses and notices | Inclusion requires compatibility and provenance review. |
| A user's original case-study text, screenshots, videos, and client material | Rights remain with their respective owners | Installing a tool does not transfer those rights to the project. |
| Product name, logos, domains, endorsement | No trademark permission or clearance implied by the code license | Software licensing and brand rights are separate matters. |

Every new package must declare its own license explicitly. The root MIT license does not override a license notice on imported code or the GPL license document itself. No future GPL-only WordPress code may be copied into the MIT standalone package without permission from all relevant rights holders or a compatible licensing change.

WordPress recommends a GPL-compatible license and specifically GPL version 2 or later for plugins. Its directory requires compatible bundled materials. [WordPress licensing guidance](https://developer.wordpress.org/plugins/plugin-basics/including-a-software-license/), [directory guidelines](https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/).

## What commercial licensing means here

MIT permits commercial use subject to its notice and warranty terms. GPL software can also be sold. A business may charge for distribution, updates, support, setup, or hosting while respecting the rights granted with the software. Recipients of GPL code retain redistribution and modification rights; a paid plan must not describe those rights as revoked when a subscription ends. [GNU FAQ on selling GPL software](https://www.gnu.org/licenses/gpl-faq.en.html#DoesTheGPLAllowMoney).

Use “subscription for updates and support” when that is what is sold. A site-count tier may define support/update-service scope; it must not misrepresent the underlying GPL permissions. A directory plugin should remain useful without a key. If paid code is distributed separately, its license still needs review; “paid” does not mean “proprietary.” WordPress.org distinguishes separate add-ons and substantive hosted services from locked local trialware. [Directory guidelines, sections 5–7](https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/).

No prices, payment integration, service contract, or active subscription are created by this document.

## Source obligations and generated portfolios

Distributing GPL-covered software carries notice and source obligations. Private modifications do not automatically require public posting; distribution changes the obligations. Do not promise that GPL means every private repository or customer record must be published. [GNU FAQ](https://www.gnu.org/licenses/gpl-faq.en.html#GPLRequireSourcePostedPublic).

The user's independently created project content is separate from the software license. Copied templates, CSS, scripts, or artwork in generated output may keep their own license obligations. The planned independent MIT renderer keeps those obligations simple; it does not acquire rights to a client's screenshots or testimonials. [GNU FAQ on output](https://www.gnu.org/licenses/gpl-faq.en.html#WhatCaseIsOutputGPL).

## Existing site and contribution rights

This public concept does not relicense the private site's PHP/JS/CSS. Before extraction, check who owns that source, which third-party work it incorporates, and whether employment/client agreements limit redistribution. A sanitization pass removes data; it does not prove copyright ownership.

Contributors retain their rights and submit contributions under the relevant package license. No copyright assignment or contributor agreement is currently required. A different licensing model for existing contributions would require an actual rights review; a maintainer cannot simply relabel third-party work.

## Names, assets, and distribution

“Portfolio” is a working title. Check the final name, slug, domain, and trademarks before launch. Do not copy a third-party logo or assume permission to package a client's media. Public case studies need permission to publish the actual content, not merely a license to the tool.

Keep a dependency/asset inventory and license notices in each release. A WordPress.org submission must be a complete working plugin; this concept repository is not a submission package. Private client data, production credentials, archived deployment ZIPs, and unreviewed media must not be included in a public release.
