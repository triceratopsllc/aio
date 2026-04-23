# WordPress adapter

WordPress sites don't import TypeScript directly — but they can consume **data** produced by `@triceratops/aio/core`.

## Two integration patterns

### Pattern A — Static injection via theme

Generate JSON-LD / robots.txt with the core builders (Node script), then paste the output into:

- `wp-content/themes/<theme>/inc/aio-jsonld.php` — echoed in `wp_head`
- `<site-root>/robots.txt` — static file served by Apache/Nginx

Works for sites that rarely change their Organization / Service data.

### Pattern B — Dynamic via must-use plugin

Ship a small MU plugin that:

1. Reads site config from WP options / ACF
2. Calls an internal Node service (or a cached JSON file built at deploy time) to get JSON-LD
3. Hooks into `wp_head` to emit `<script type="application/ld+json">`

Recommended when the site uses Yoast/RankMath — let them handle title/description/canonical, and have this plugin add **only** the JSON-LD that Yoast doesn't produce (HowTo, Service, custom FAQPage).

## Deliverable

A proper `aio-wp` MU plugin is tracked as future work. For now, use Pattern A with `pnpm tsx scripts/generate-aio-static.ts` producing a PHP file that the theme includes.
