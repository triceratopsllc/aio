import type { JsonLdObject, SiteConfig } from '../types.js';

export interface WebSiteInput {
  description?: string;
  inLanguage?: string;
  searchActionUrlTemplate?: string;
}

export function buildWebSiteJsonLd(site: SiteConfig, input: WebSiteInput = {}): JsonLdObject {
  const jsonLd: JsonLdObject = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.siteName,
    url: site.siteUrl,
  };

  if (input.description) jsonLd.description = input.description;
  if (input.inLanguage) jsonLd.inLanguage = input.inLanguage;

  if (site.publisher || site.organization) {
    jsonLd.publisher = {
      '@type': 'Organization',
      name: site.publisher?.name ?? site.organization?.name ?? site.siteName,
    };
  }

  if (input.searchActionUrlTemplate) {
    jsonLd.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: input.searchActionUrlTemplate,
      },
      'query-input': 'required name=search_term_string',
    };
  }

  return jsonLd;
}
