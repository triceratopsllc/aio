import { absoluteUrl } from '../types.js';
export function buildArticleJsonLd(site, input) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': input.type ?? 'Article',
        headline: input.headline,
        author: {
            '@type': 'Organization',
            name: input.authorName ?? site.organization?.name ?? site.siteName,
        },
        publisher: {
            '@type': 'Organization',
            name: site.publisher?.name ?? site.organization?.name ?? site.siteName,
        },
    };
    if (input.description)
        jsonLd.description = input.description;
    if (input.datePublished)
        jsonLd.datePublished = input.datePublished;
    if (input.dateModified)
        jsonLd.dateModified = input.dateModified;
    if (input.image) {
        const images = Array.isArray(input.image) ? input.image : [input.image];
        jsonLd.image = images.map((img) => absoluteUrl(site.siteUrl, img));
    }
    if (input.path) {
        jsonLd.mainEntityOfPage = {
            '@type': 'WebPage',
            '@id': absoluteUrl(site.siteUrl, input.path),
        };
    }
    return jsonLd;
}
//# sourceMappingURL=article.js.map