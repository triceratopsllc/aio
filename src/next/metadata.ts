import type { Metadata } from 'next';
import { absoluteUrl, type JsonLdObject, type SiteConfig } from '../core/types.js';

export interface PageMetaInput {
  site: SiteConfig;
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

export function buildPageMetadata(input: PageMetaInput): Metadata {
  const {
    site,
    title,
    description,
    path,
    ogImage,
    ogType = 'website',
    noindex = false,
    publishedTime,
    modifiedTime,
  } = input;

  const canonicalUrl = absoluteUrl(site.siteUrl, path);
  const resolvedOgImage = ogImage
    ? absoluteUrl(site.siteUrl, ogImage)
    : site.defaultOgImage
      ? absoluteUrl(site.siteUrl, site.defaultOgImage)
      : undefined;

  const metadata: Metadata = {
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

/**
 * Render a JSON-LD `<script>` tag inside a Next.js Server Component.
 *
 * Usage in `app/layout.tsx` or page:
 *   <JsonLdScript data={[orgJsonLd, websiteJsonLd]} />
 */
export interface JsonLdScriptProps {
  data: JsonLdObject | JsonLdObject[];
  id?: string;
}

export function jsonLdScriptProps({ data, id }: JsonLdScriptProps): {
  type: string;
  id?: string;
  dangerouslySetInnerHTML: { __html: string };
} {
  const arr = Array.isArray(data) ? data : [data];
  const json = arr.length === 1 ? JSON.stringify(arr[0]) : JSON.stringify(arr);
  return {
    type: 'application/ld+json',
    ...(id ? { id } : {}),
    dangerouslySetInnerHTML: { __html: json },
  };
}
