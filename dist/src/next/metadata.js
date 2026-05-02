import { absoluteUrl } from '../core/types.js';
export function buildPageMetadata(input) {
    const { site, title, description, path, ogImage, ogType = 'website', noindex = false, publishedTime, modifiedTime, } = input;
    const canonicalUrl = absoluteUrl(site.siteUrl, path);
    const resolvedOgImage = ogImage
        ? absoluteUrl(site.siteUrl, ogImage)
        : site.defaultOgImage
            ? absoluteUrl(site.siteUrl, site.defaultOgImage)
            : undefined;
    const metadata = {
        title,
        description,
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            siteName: site.siteName,
            locale: site.defaultLocale ?? 'ja_JP',
            type: ogType,
            ...(resolvedOgImage ? { images: [{ url: resolvedOgImage, width: 1200, height: 630 }] } : {}),
            ...(publishedTime ? { publishedTime } : {}),
            ...(modifiedTime ? { modifiedTime } : {}),
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            ...(resolvedOgImage ? { images: [resolvedOgImage] } : {}),
        },
        robots: noindex ? { index: false, follow: false } : undefined,
    };
    return metadata;
}
export function jsonLdScriptProps({ data, id }) {
    const arr = Array.isArray(data) ? data : [data];
    const json = arr.length === 1 ? JSON.stringify(arr[0]) : JSON.stringify(arr);
    return {
        type: 'application/ld+json',
        ...(id ? { id } : {}),
        dangerouslySetInnerHTML: { __html: json },
    };
}
//# sourceMappingURL=metadata.js.map