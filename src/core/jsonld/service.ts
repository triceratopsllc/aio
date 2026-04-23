import type { JsonLdObject, ServiceOfferInput, SiteConfig } from '../types.js';

export interface ServiceInput {
  name: string;
  description: string;
  serviceType?: string;
  catalogName?: string;
  offers: ServiceOfferInput[];
  areaServed?: string | string[];
}

export function buildServiceJsonLd(site: SiteConfig, input: ServiceInput): JsonLdObject {
  const jsonLd: JsonLdObject = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    provider: {
      '@type': 'Organization',
      name: site.organization?.name ?? site.siteName,
    },
    description: input.description,
  };

  if (input.serviceType) jsonLd.serviceType = input.serviceType;
  if (input.areaServed) jsonLd.areaServed = input.areaServed;

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
