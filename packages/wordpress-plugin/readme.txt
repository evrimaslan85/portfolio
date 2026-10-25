=== Portfolio Case Studies ===
Contributors: evrimaslan85
Tags: portfolio, case-studies, projects
Requires at least: 6.4
Requires PHP: 8.1
Stable tag: 0.2.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/old-licenses/gpl-2.0.html

Publish project galleries and case studies with implementations, screenshots, architecture, and results. Free, local, and account-free.

== Description ==

Add projects from the WordPress dashboard. Describe the overview, challenge, solution, implementations, evidence, and outcomes. Use Systems and Technologies to organize your work.

Put [portfolio] on any page, or use Portfolio > Setup to create a Work page. Project pages use your theme's normal single-post layout and the plugin's scoped case-study content. The gallery is server-rendered and remains readable without JavaScript; filtering is on the current page of up to 24 projects.

JSON import/export lets you move the public project format to the standalone HTML version. Imports create drafts and skip existing portable IDs. Media files must be moved separately. Relative evidence paths resolve from the WordPress site root. Password-protected, draft, and private projects are excluded from galleries, the public read API, and exports.

This first installable release has no account requirement, telemetry, marketing form, CRM access, or external-service connection. Install and update manually from the official GitHub releases. This plugin has not been submitted to WordPress.org.

== Installation ==

1. Download portfolio-wordpress-0.2.0.zip from the official repository release.
2. In WordPress, choose Plugins > Add New > Upload Plugin. Select the ZIP and choose Install Now, then Activate.
3. Open Portfolio > Setup / Import / Export and create a Work page.
4. Add and publish projects under Portfolio. Alternatively import the fictional examples as drafts, review them, and publish individually.

== Frequently Asked Questions ==

= Can I put this on an existing page? =
Yes. Add [portfolio] using a Shortcode block. The plugin does not replace your homepage or menus.

= Does it replace an existing MU-plugin Work system? =
No. It uses separate identifiers and does not alter the existing site's custom Work or Lab code. Migrating the old implementation needs a separate staging migration.

= Where is my data? =
Projects and their story fields live in your WordPress database. Media stays in your Media Library or at addresses you choose. Deactivating or deleting the plugin preserves this data. Core revisions cover core post fields; custom story-field revision restoration is not implemented in this release. Keep backups.

= Is the standalone editor a server admin panel? =
No. The separate static package edits and downloads files locally. It does not log in to or write directly to your hosting.

== Changelog ==

= 0.2.0 =
First installable release: project editor, shortcode gallery, narrative/implementation/evidence/outcome fields, architecture sequence, JSON import/export, draft-only sample import, and public read-only projection.
