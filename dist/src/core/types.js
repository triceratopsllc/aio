export function absoluteUrl(siteUrl, pathOrUrl) {
    if (/^https?:\/\//i.test(pathOrUrl))
        return pathOrUrl;
    const base = siteUrl.replace(/\/$/, '');
    const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
    return `${base}${path}`;
}
//# sourceMappingURL=types.js.map