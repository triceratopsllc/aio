import { absoluteUrl } from '../types.js';
export function buildBreadcrumbJsonLd(site, items, opts = {}) {
    const { rootName = 'ホーム', includeRoot = true } = opts;
    const list = [];
    let position = 1;
    if (includeRoot) {
        list.push({
            '@type': 'ListItem',
            position: position++,
            name: rootName,
            item: site.siteUrl,
        });
    }
    for (const item of items) {
        const entry = {
            '@type': 'ListItem',
            position: position++,
            name: item.name,
        };
        if (item.path)
            entry.item = absoluteUrl(site.siteUrl, item.path);
        list.push(entry);
    }
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: list,
    };
}
//# sourceMappingURL=breadcrumb.js.map