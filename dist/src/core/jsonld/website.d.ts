import type { JsonLdObject, SiteConfig } from '../types.js';
export interface WebSiteInput {
    description?: string;
    inLanguage?: string;
    searchActionUrlTemplate?: string;
}
export declare function buildWebSiteJsonLd(site: SiteConfig, input?: WebSiteInput): JsonLdObject;
//# sourceMappingURL=website.d.ts.map