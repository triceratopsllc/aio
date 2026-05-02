export type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
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
export declare function buildSitemapXml(siteUrl: string, entries: UrlEntry[]): string;
export declare function buildSitemapFromSources(opts: {
    siteUrl: string;
    staticEntries?: UrlEntry[];
    dynamicSources?: DynamicSource[];
}): Promise<{
    xml: string;
    entries: UrlEntry[];
    counts: Record<string, number>;
}>;
//# sourceMappingURL=sitemap.d.ts.map