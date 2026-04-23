import React from 'react';
import { Helmet } from 'react-helmet-async';
import { absoluteUrl, type JsonLdObject, type SiteConfig } from '../core/types.js';

export interface PageSeoProps {
  site: SiteConfig;
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: JsonLdObject | JsonLdObject[];
}

export const PageSeo: React.FC<PageSeoProps> = ({
  site,
  title,
  description,
  path,
  ogImage,
  ogType = 'website',
  noindex = false,
  jsonLd,
}) => {
  const canonicalUrl = absoluteUrl(site.siteUrl, path);
  const resolvedOgImage = ogImage
    ? absoluteUrl(site.siteUrl, ogImage)
    : site.defaultOgImage
      ? absoluteUrl(site.siteUrl, site.defaultOgImage)
      : undefined;

  const jsonLdArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      {resolvedOgImage && <meta property="og:image" content={resolvedOgImage} />}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={site.siteName} />
      <meta property="og:locale" content={site.defaultLocale ?? 'ja_JP'} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {resolvedOgImage && <meta name="twitter:image" content={resolvedOgImage} />}

      {jsonLdArray.map((ld, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}
    </Helmet>
  );
};

export default PageSeo;
