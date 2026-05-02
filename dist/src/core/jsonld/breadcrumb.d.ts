import { type BreadcrumbItem, type JsonLdObject, type SiteConfig } from '../types.js';
export interface BreadcrumbOptions {
    rootName?: string;
    includeRoot?: boolean;
}
export declare function buildBreadcrumbJsonLd(site: SiteConfig, items: BreadcrumbItem[], opts?: BreadcrumbOptions): JsonLdObject;
//# sourceMappingURL=breadcrumb.d.ts.map