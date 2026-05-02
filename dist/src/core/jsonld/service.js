export function buildServiceJsonLd(site, input) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: input.name,
        provider: {
            '@type': 'Organization',
            name: site.organization?.name ?? site.siteName,
        },
        description: input.description,
    };
    if (input.serviceType)
        jsonLd.serviceType = input.serviceType;
    if (input.areaServed)
        jsonLd.areaServed = input.areaServed;
    if (input.offers.length) {
        jsonLd.hasOfferCatalog = {
            '@type': 'OfferCatalog',
            name: input.catalogName ?? input.name,
            itemListElement: input.offers.map((offer) => ({
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'Service',
                    name: offer.name,
                    description: offer.description,
                },
            })),
        };
    }
    return jsonLd;
}
//# sourceMappingURL=service.js.map