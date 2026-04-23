import { absoluteUrl, type BreadcrumbItem, type JsonLdObject, type SiteConfig } from '../types.js';

export interface BreadcrumbOptions {
  rootName?: string;
  includeRoot?: boolean;
}

export function buildBreadcrumbJsonLd(
  site: SiteConfig,
  items: BreadcrumbItem[],
  opts: BreadcrumbOptions = {},
): JsonLdObject {
  const { rootName = 'ホーム', includeRoot = true } = opts;

  const list: JsonLdObject[] = [];
  let position = 1;

  if (includeRoot) {
    list.push({
      '@type': 'ListItem',
      position: position++,
      name: rootName,
      item: site.siteUrl,
    });
  }

  for (const item of items) {
    const entry: JsonLdObject = {
      '@type': 'ListItem',
      position: position++,
      name: item.name,
    };
    if (item.path) entry.item = absoluteUrl(site.siteUrl, item.path);
    list.push(entry);
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: list,
  };
}
