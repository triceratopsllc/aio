import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Helmet } from 'react-helmet-async';
import { absoluteUrl } from '../core/types.js';
export const PageSeo = ({ site, title, description, path, ogImage, ogType = 'website', noindex = false, jsonLd, }) => {
    const canonicalUrl = absoluteUrl(site.siteUrl, path);
    const resolvedOgImage = ogImage
        ? absoluteUrl(site.siteUrl, ogImage)
        : site.defaultOgImage
            ? absoluteUrl(site.siteUrl, site.defaultOgImage)
            : undefined;
    const jsonLdArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
    return (_jsxs(Helmet, { children: [_jsx("title", { children: title }), _jsx("meta", { name: "description", content: description }), _jsx("link", { rel: "canonical", href: canonicalUrl }), noindex && _jsx("meta", { name: "robots", content: "noindex,nofollow" }), _jsx("meta", { property: "og:title", content: title }), _jsx("meta", { property: "og:description", content: description }), _jsx("meta", { property: "og:url", content: canonicalUrl }), resolvedOgImage && _jsx("meta", { property: "og:image", content: resolvedOgImage }), _jsx("meta", { property: "og:type", content: ogType }), _jsx("meta", { property: "og:site_name", content: site.siteName }), _jsx("meta", { property: "og:locale", content: site.defaultLocale ?? 'ja_JP' }), _jsx("meta", { name: "twitter:card", content: "summary_large_image" }), _jsx("meta", { name: "twitter:title", content: title }), _jsx("meta", { name: "twitter:description", content: description }), resolvedOgImage && _jsx("meta", { name: "twitter:image", content: resolvedOgImage }), jsonLdArray.map((ld, i) => (_jsx("script", { type: "application/ld+json", children: JSON.stringify(ld) }, i)))] }));
};
export default PageSeo;
//# sourceMappingURL=PageSeo.js.map