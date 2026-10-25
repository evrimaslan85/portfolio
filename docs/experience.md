# Experience and design direction

## The visitor journey

The first screen should answer three questions: what kind of work is here, which example is relevant to me, and what can I inspect? Use short summaries, meaningful classifications, and clear titles. Do not make animation or video a prerequisite for understanding a project.

```text
Project listing → relevant case study → implementation/evidence → optional contact CTA
```

A card shows the project title, short summary, system/service, technologies, and delivery status. A case study starts with a short overview and navigates through challenge, solution, architecture, implementations, and outcomes. Optional sections disappear cleanly.

## The author journey

```text
Draft → structure the story → add evidence → review public output → publish → maintain
```

The editor should distinguish delivery status from publication status. A prototype can be publicly published. A completed engagement can remain a private draft. These are separate concepts.

Keep useful defaults, help text, and preview close to the fields. Adding a new implementation should not require code. Missing optional fields should not produce blank headings or empty image frames. Display export errors with a field path and recovery action.

## Design principles

- **Content first:** readable typography, generous spacing, restrained color, and clear section hierarchy.
- **Evidence nearby:** attach an image, clip, or approved public link to the implementation or claim it supports.
- **Progressive detail:** let visitors scan, then expand an implementation or follow evidence.
- **Theme respect:** WordPress inherits its surrounding site; the standalone form provides its own header and footer.
- **Truthful presentation:** illustrative, reported, and measured outcomes are visibly distinct. No automatic success percentages.
- **Optional conversion:** authors control the CTA. Project branding/credits are off by default in the eventual plugin.

## Customization boundaries

First release: accent color with contrast checking, content width, compact/comfortable cards, light/dark color tokens where tested, section order, CTA text/link, and listing labels. Typography inherits from the site or uses a system font stack. Full arbitrary CSS/HTML fields and a general page builder are outside MVP.

## Accessibility targets

Target WCAG 2.2 AA during implementation; this concept is not an accessibility certification. Use real buttons and links, visible focus, labeled filters, semantic headings, descriptive image alternatives, reduced-motion support, captions/transcripts where needed, and keyboard-operable dialogs with focus restoration. Architecture diagrams need an equivalent text structure. Test screen-reader announcements for filtering and error states.

## The repository preview

[The preview](../prototype/index.html) is an original lightweight illustration with fictional data. It switches the site shell between WordPress-style and standalone presentation, filters projects, opens a detailed project dialog, and offers browser printing. It does not imitate WordPress admin, persist editing, generate a site, or claim production compatibility. Print output depends on the browser and is not an implemented PDF export pipeline.
