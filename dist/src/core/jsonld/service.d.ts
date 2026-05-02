import type { JsonLdObject, ServiceOfferInput, SiteConfig } from '../types.js';
export interface ServiceInput {
    name: string;
    description: string;
    serviceType?: string;
    catalogName?: string;
    offers: ServiceOfferInput[];
    areaServed?: string | string[];
}
export declare function buildServiceJsonLd(site: SiteConfig, input: ServiceInput): JsonLdObject;
//# sourceMappingURL=service.d.ts.map