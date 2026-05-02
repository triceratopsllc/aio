function escapeXml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
function renderEntry(siteUrl, entry) {
    const base = siteUrl.replace(/\/$/, '');
    const path = entry.path.startsWith('/') ? entry.path : `/${entry.path}`;
    const loc = escapeXml(`${base}${path}`);
    const lines = [`    <loc>${loc}</loc>`];
    if (entry.lastmod)
        lines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
    if (entry.changefreq)
        lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    if (entry.priority !== undefined) {
        lines.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
    }
    return `  <url>\n${lines.join('\n')}\n  </url>`;
}
export function buildSitemapXml(siteUrl, entries) {
    const body = entries.map((e) => renderEntry(siteUrl, e)).join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}
export async function buildSitemapFromSources(opts) {
    const staticEntries = opts.staticEntries ?? [];
    const sources = opts.dynamicSources ?? [];
    const counts = { static: staticEntries.length };
    const collected = [...staticEntries];
    const results = await Promise.all(sources.map((s) => s.fetch()));
    results.forEach((entries, i) => {
        const label = sources[i]?.label ?? `source_${i}`;
        counts[label] = entries.length;
        collected.push(...entries);
    });
    return {
        xml: buildSitemapXml(opts.siteUrl, collected),
        entries: collected,
        counts,
    };
}
//# sourceMappingURL=sitemap.js.map