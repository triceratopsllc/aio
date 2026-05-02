import { type JsonLdObject, type SiteConfig } from '../types.js';
export interface ArticleInput {
    headline: string;
    description?: string;
    image?: string | string[];
    datePublished?: string;
    dateModified?: string;
    authorName?: string;
    path?: string;
    type?: 'Article' | 'NewsArticle' | 'BlogPosting';
}
export declare function buildArticleJsonLd(site: SiteConfig, input: ArticleInput): JsonLdObject;
//# sourceMappingURL=article.d.ts.map