# A portfolio that explains what happened

## The problem

A project gallery can show attractive work while leaving the important questions unanswered: What was the problem? What did you actually build? How did the pieces connect? What changed afterward? What evidence supports the result?

Portfolio gives those questions a consistent structure. A visitor can scan a short project card, open a full case study, inspect individual implementations, and follow the evidence. Authors do not have to invent a new page layout for each engagement.

This is a product hypothesis, not a validated market claim. The initial pattern comes from an existing WordPress Work implementation; demand outside that site still needs testing.

## Who it serves

| Audience | What they need to explain | Useful outcome |
| --- | --- | --- |
| Independent consultant | The operational problem, approach, and result | A buyer understands the kind of engagement they could commission. |
| Agency | Several capabilities within one client engagement | A case study shows both the overall story and the separate deliverables. |
| Developer or systems builder | Architecture, implementation, and working evidence | A technical reviewer can inspect substance without reading a long sales page. |
| Small service business | Work completed across repeatable service categories | A visitor can find relevant examples and take a clear next step. |

## The central object: a project

A project has a title, summary, classification, publication state in its authoring system, narrative sections, optional architecture, implementations, evidence, and outcomes. A project is not a client database record, a billing record, or an interactive Lab.

The default narrative is:

1. **Overview:** context, scope, role, and a short explanation of the work.
2. **Challenge:** the problem and the constraints.
3. **Solution:** how the system works and why it was designed that way.
4. **What we built:** reusable cards for the individual implementations.
5. **Outcomes:** qualitative or quantitative results, with their basis and evidence.

Authors can omit optional sections. An absent metric must not become a made-up performance claim. Confidential projects can use a public description, but anonymization still requires review of screenshots, URLs, captions, and contextual clues.

## Two products, one idea

**WordPress:** the website owner authors projects in familiar WordPress screens and publishes them using a grid, archive, and case-study layout. Media stays in the site's Media Library. No service account is needed for the basic product.

**Standalone:** the author maintains a versioned content document, validates it, and generates a static site that can be hosted on ordinary static hosting. The first release targets people comfortable editing files. A visual local editor is a later usability improvement, not a dependency hidden inside the MVP.

Both products exchange the same public JSON format. They do not share one PHP/JavaScript runtime. The WordPress adapter and the standalone adapter implement the contract separately.

## Positioning to test

> Turn your work into clear case studies: the problem, the system, the implementation, and the evidence.

The differentiator to test is the connection between a case study, its implementation cards, and its evidence. Do not claim that this is the first or only product to do it. A competitive review and user interviews are part of the validation plan.

## Boundaries

The first version does not include CRM access, public write endpoints into external business systems, visitor accounts, a page builder, AI-generated results, team approval SaaS, hosting subscriptions, billing, or the original Interactive Lab modules. Those would create different support and privacy requirements.

The working name and proposed features can change. Preserve the content model, migration commitments, and explicit publication boundary as the product develops.
