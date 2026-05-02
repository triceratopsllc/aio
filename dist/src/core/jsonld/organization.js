import { absoluteUrl } from '../types.js';
export function buildOrganizationJsonLd(site) {
    const org = site.organization;
    if (!org) {
        throw new Error('[aio] SiteConfig.organization is required to build Organization JSON-LD');
    }
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': org.type ?? 'Organization',
        name: org.name,
        url: site.siteUrl,
    };
    if (org.alternateName?.length)
        jsonLd.alternateName = org.alternateName;
    if (org.logo)
        jsonLd.logo = absoluteUrl(site.siteUrl, org.logo);
    if (org.description)
        jsonLd.description = org.description;
    if (org.foundingDate)
        jsonLd.foundingDate = org.foundingDate;
    if (org.address) {
        jsonLd.address = {
            '@type': 'PostalAddress',
            ...org.address,
        };
    }
    if (org.contactPoint) {
        const points = Array.isArray(org.contactPoint) ? org.contactPoint : [org.contactPoint];
        const rendered = points.map((cp) => {
            const obj = { '@type': 'ContactPoint' };
            if (cp.telephone)
                obj.telephone = cp.telephone;
            if (cp.email)
                obj.email = cp.email;
            if (cp.contactType)
                obj.contactType = cp.contactType;
            if (cp.availableLanguage?.length)
                obj.availableLanguage = cp.availableLanguage;
            if (cp.hoursAvailable) {
                obj.hoursAvailable = {
                    '@type': 'OpeningHoursSpecification',
                    ...cp.hoursAvailable,
                };
            }
            return obj;
        });
        jsonLd.contactPoint = rendered.length === 1 ? rendered[0] : rendered;
    }
    if (org.sameAs?.length)
        jsonLd.sameAs = org.sameAs;
    return jsonLd;
}
//# sourceMappingURL=organization.js.map