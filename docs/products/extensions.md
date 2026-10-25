# Other forms of the concept

Keep the case-study content portable. Add delivery forms only when there is a clear user need and an owner for maintenance.

| Form | What it would provide | Relationship to the first two products | Decision |
| --- | --- | --- | --- |
| Embedded project grid | A portfolio inside an existing external website | An output of the standalone renderer, with scoped styles and a documented content source | Later; validate demand and cross-origin/privacy behavior. |
| Printable case study | A clean page for a proposal or conversation | Print CSS first; dedicated PDF export later | Print preview exists; automated PDF is not implemented. |
| Static starter/template | A developer-owned code starter | A distribution of the standalone product, not another content model | Possible after the publisher works. |
| Local visual editor | File-based portfolio authoring without WordPress | An authoring interface for the standalone format | Later; depends on import/export, durable saves, and media design. |
| Hosted editor/publisher | Accounts, project authoring, hosted pages, optional custom domains | A service around the same public content contract | Research only; creates auth, tenancy, billing, recovery, privacy, and on-call obligations. |
| Headless API adapter | Approved project content consumed by another frontend | A read-only integration over the public contract | Optional; retain explicit publication filtering. |
| Paid layout pack | Specialized, tested layouts | An extension or service rather than a locked part of the directory plugin | Commercial hypothesis; license depends on the actual package. |

## Why the second product is static

It gives people an independent option while keeping operations small. It also makes the portability claim testable: export a project from WordPress and render it somewhere else. A hosted service would add substantial work before proving that content model is useful.

## Outputs are not separate product lines

A grid, full case study, print view, and evidence manifest are views of the same approved content. Avoid maintaining four separate copies or asking authors to edit them independently. If an output omits a section, it must still respect the same publication decisions.

## What must be decided before a service

Validate paid demand; define account ownership and project sharing; design tenant isolation, export/deletion, backups and restore; identify the legal operator and processors; write actual service terms and privacy disclosures; establish security response and support capacity; price against operating cost. No vendor has been selected, no account has been provisioned, and no recurring charge is authorized by this concept.
