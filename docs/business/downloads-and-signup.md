# Downloads, optional signup, and owner controls

Decision date: 2026-10-25. Product direction: public, free basic downloads with an optional mailing list. This is a design and operating plan; no email-collection service is connected.

## What is downloadable now

The [preview ZIP](https://github.com/evrimaslan85/portfolio/archive/refs/heads/main.zip) is GitHub's current repository snapshot. Unzip it and open `prototype/index.html`. It includes the browser preview, original fictional examples, and product plans. It is not an installable plugin, a tagged product release, or a static-site generator.

The repository has no plugin release yet. Do not rename the source archive to make it look like an installable plugin. When a real package exists, its download must be a tested, purpose-built release asset with an exact version, requirements, installation steps, and release notes.

## The visitor's front door

Use a simple product page for ordinary visitors, with GitHub as the source and detailed-documentation home. A page could live on the existing business website; no page is published by this document.

The page should show, in order:

1. What Portfolio does and who it helps.
2. A screenshot or live demo and an honest release status.
3. A direct download for each available product, with format, version, requirements, and three-step setup.
4. An optional invitation to get release news and practical case-study tips.
5. Plain-language licensing, help, and a link to the detailed documentation.

Do not make the download depend on submitting a form. Provide a visible direct link before and after any signup invitation. A failure in the mailing-list service must not break downloading or using the product.

GitHub Releases is the proposed home for versioned packages and release notes. A normal GitHub source ZIP is a snapshot of the repository, not automatically a clean installable plugin. [GitHub release documentation](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases).

## Optional email signup

Keep the form separate from the download. Ask for an email address only; name, company, phone number, and website are not needed for a basic update list. Explain the sender, topic, expected frequency, confirmation step, unsubscribe option, and link to the actual privacy notice before submission.

Suggested wording, to finalize when the sender and list are configured:

> Get Portfolio release news and practical case-study tips by email. Optional. Confirm your address to subscribe, and unsubscribe anytime. Your download is available without signing up.

Button: **Subscribe to Portfolio updates**. Separate link: **Download without subscribing**.

For a form dedicated entirely to that clearly described list, the explicit subscribe action can express the choice; do not add a misleading required “agree to privacy policy” checkbox as a substitute for stating the purpose. If the same form has another purpose, such as requesting a download email, use a separate unchecked marketing choice. Download delivery is not automatic permission for newsletters or unrelated sales follow-up.

Consent must be specific, informed, freely chosen, and withdrawable. Privacy information must be supplied when collecting the data. [EDPB small-business guidance](https://www.edpb.europa.eu/sme/find-practical-info/faq_en?page=1).

For a German/EU-facing launch, use prior express consent for the proposed marketing list rather than assuming a free download qualifies for the narrow existing-customer exception. Use confirmation by email (double opt-in) to reduce abuse and preserve evidence of the request. Include a working unsubscribe method in every marketing message. [German UWG §7](https://www.gesetze-im-internet.de/uwg_2004/__7.html), [Saxon data-protection authority guidance](https://www.datenschutz.sachsen.de/werbung-5904.html).

## Signup lifecycle

```text
Download link ───────────────────────────→ available immediately

Optional signup → pending confirmation → confirmed subscriber → optional updates
                      │                          │
                      └─ expires if unused       └─ unsubscribe → stop updates
```

Do not send promotional sequences before confirmation. The confirmation message should be limited to confirming the requested subscription. Keep the consent wording/version, source form, request/confirmation time, and subscription state. Collect additional logs only when justified; an email list does not require indefinite IP/device tracking.

Use a private mailing-list store with restricted access. Never put subscribers in GitHub issues, commits, public JSON files, or browser code. A static preview cannot securely store a list by itself. Credentials and form processing belong in a protected service or backend. Choose and configure the actual processor and privacy notice before connecting a live form.

Set retention for unconfirmed requests and consent evidence; process withdrawals promptly; maintain only the suppression information needed to avoid resubscribing someone accidentally. Define processor arrangements and any international transfers for the actual service. These are launch-specific decisions, not claims that this design alone establishes legal compliance.

## A future WordPress welcome screen

Offer a small dismissible “Get updates” invitation on the plugin's own welcome/settings screen. Do not block setup, repeat nags across the dashboard, or automatically send the WordPress administrator's email/site details. A subscription requires a deliberate action by that person. The plugin's users are not permission to collect their website visitors' information.

WordPress.org requires consent for tracking/external contact and limits intrusive dashboard behavior. A basic local plugin should not require registration solely to unlock its own functionality. [Directory guidelines, sections 6, 7, and 11](https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/).

## What the owner controls

| Area | Owner control | Practical limit |
| --- | --- | --- |
| Official source and releases | Review contributions, choose maintainers, tag/package releases | Others can fork and redistribute within the license. |
| Website and product presentation | Manage downloads, demo, docs, support, and positioning | Public distribution cannot identify every user. |
| Email list | Manage confirmed subscribers, topics, frequency, and unsubscribe | Only people who opt in belong on the proposed marketing list. |
| Paid services | Offer setup, support, maintenance, or separately scoped services | Service terms do not cancel already granted open-source permissions. |
| User portfolios | Provide settings and authoring tools | Users retain their content and hosting; they are not forced into a central account. |

Do not describe a license key as proof of ownership of every copy. For a future commercial update/support service, a key can manage that service's entitlement without making the free local product depend on the vendor's availability.

## Sensible measures

Measure official release-asset download counts, confirmed subscriptions, unsubscribes, support demand, and repeat use when those systems exist. Counts do not equal unique installed users; GitHub source archives and forks can bypass the main product page. Reading a README, starring a repository, downloading a ZIP, or installing the plugin is not consent to marketing.

## What has changed now

The README provides a direct preview download, simple opening instructions, plain licensing, and accurate availability labels. Detailed documentation is moved behind a guide. This plan records the optional signup design. No actual mailing list, data collection, activation gate, plugin ZIP, or production signup page has been created.
