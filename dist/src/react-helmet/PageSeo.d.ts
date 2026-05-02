import React from 'react';
import { type JsonLdObject, type SiteConfig } from '../core/types.js';
export interface PageSeoProps {
    site: SiteConfig;
    title: string;
    description: string;
    path: string;
    ogImage?: string;
    ogType?: 'website' | 'article';
    noindex?: boolean;
    jsonLd?: JsonLdObject | JsonLdObject[];
}
export declare const PageSeo: React.FC<PageSeoProps>;
export default PageSeo;
//# sourceMappingURL=PageSeo.d.ts.map