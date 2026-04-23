/**
 * Smoke test: generate AIO artifacts for aupaircare and print them.
 *   pnpm dlx tsx examples/smoke-test.ts
 */
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildRobotsTxt,
  buildSitemapXml,
} from '../src/core/index.js';
import { aupaircareSite } from './aupaircare.config.js';

console.log('=== Organization ===');
console.log(JSON.stringify(buildOrganizationJsonLd(aupaircareSite), null, 2));

console.log('\n=== WebSite ===');
console.log(JSON.stringify(buildWebSiteJsonLd(aupaircareSite, { inLanguage: 'ja' }), null, 2));

console.log('\n=== Breadcrumb (FAQ page) ===');
console.log(
  JSON.stringify(
    buildBreadcrumbJsonLd(aupaircareSite, [{ name: 'よくある質問', path: '/faq' }]),
    null,
    2,
  ),
);

console.log('\n=== FAQ ===');
console.log(
  JSON.stringify(
    buildFaqJsonLd([
      { question: 'オペア留学とは？', answer: 'アメリカ家庭に滞在してチャイルドケアをする文化交流プログラム。' },
    ]),
    null,
    2,
  ),
);

console.log('\n=== robots.txt ===');
console.log(buildRobotsTxt({ siteUrl: aupaircareSite.siteUrl }));

console.log('=== sitemap.xml (sample) ===');
console.log(
  buildSitemapXml(aupaircareSite.siteUrl, [
    { path: '/', changefreq: 'weekly', priority: 1.0 },
    { path: '/faq', changefreq: 'monthly', priority: 0.8 },
  ]),
);
