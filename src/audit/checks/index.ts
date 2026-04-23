import { routesCheck } from './routes.js';
import { metadataCheck } from './metadata.js';
import { jsonldCheck } from './jsonld.js';
import { robotsCheck } from './robots.js';
import { sitemapCheck } from './sitemap.js';
import { ogpCheck } from './ogp.js';
import { localeCheck } from './locale.js';
import { layoutJsonLdCheck } from './layout-jsonld.js';
import { siteConfigCheck } from './site-config.js';
import { otherCheck } from './other.js';

export const ALL_CHECKS = [
  routesCheck,
  metadataCheck,
  jsonldCheck,
  robotsCheck,
  sitemapCheck,
  ogpCheck,
  localeCheck,
  layoutJsonLdCheck,
  siteConfigCheck,
  otherCheck,
];
