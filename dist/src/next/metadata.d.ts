import type { Metadata } from 'next';
import { type JsonLdObject, type SiteConfig } from '../core/types.js';
export interface PageMetaInput {
    site: SiteConfig;
    title: string;
    description: string;
    path: string;
    ogImage?: string;
    ogType?: 'website' | 'article';
    noindex?: boolean;
    publishedTime?: string;
    modifiedTime?: string;
}
export declare function buildPageMetadata(input: PageMetaInput): Metadata;
/**
 * Render a JSON-LD `<script>` tag inside a Next.js Server Component.
 *
 * Usage in `app/layout.tsx` or page:
 *   <JsonLdScript data={[orgJsonLd, websiteJsonLd]} />
 */
export interface JsonLdScriptProps {
    data: JsonLdObject | JsonLdObject[];
    id?: string;
}
export declare function jsonLdScriptProps({ data, id }: JsonLdScriptProps): {
    type: string;
    id?: string;
    dangerouslySetInnerHTML: {
        __html: string;
    };
};
//# sourceMappingURL=metadata.d.ts.map