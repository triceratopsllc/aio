export type ChangeFreq =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

export interface UrlEntry {
  path: string;
  changefreq?: ChangeFreq;
  priority?: number;
  lastmod?: string;
}

export interface DynamicSource {
  label?: string;
  fetch: () => Promise<UrlEntry[]>;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function renderEntry(siteUrl: string, entry: UrlEntry): string {
  const base = siteUrl.replace(/\/$/, '');
  const path = entry.path.startsWith('/') ? entry.path : `/${entry.path}`;
  const loc = escapeXml(`${base}${path}`);

  const lines = [`    <loc>${loc}</loc>`];
  if (entry.lastmod) lines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
  if (entry.changefreq) lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
  if (entry.priority !== undefined) {
    lines.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
  }

  return `  <url>\n${lines.join('\n')}\n  </url>`;
}

export function buildSitemapXml(siteUrl: string, entries: UrlEntry[]): string {
  const body = entries.map((e) => renderEntry(siteUrl, e)).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

export async function buildSitemapFromSources(opts: {
  siteUrl: string;
  staticEntries?: UrlEntry[];
  dynamicSources?: DynamicSource[];
}): Promise<{ xml: string; entries: UrlEntry[]; counts: Record<string, number> }> {
  const staticEntries = opts.staticEntries ?? [];
  const sources = opts.dynamicSources ?? [];

  const counts: Record<string, number> = { static: staticEntries.length };
  const collected: UrlEntry[] = [...staticEntries];

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
