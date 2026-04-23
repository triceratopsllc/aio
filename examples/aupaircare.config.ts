/**
 * Example: aupaircare.intraxjp.com SiteConfig.
 *
 * This mirrors the hardcoded values currently in
 * `CLIENTS/intrax/025_AupaircareReact/user/src/components/seo/jsonLd.ts`,
 * expressed as a reusable config consumable by @triceratops/aio.
 *
 * When aupaircare migrates to this package, this file becomes its
 * single source of truth — delete the hardcoded constants from the
 * repo and point every JSON-LD / meta builder at this config.
 */
import type { SiteConfig } from '../src/core/types.js';

export const aupaircareSite: SiteConfig = {
  siteUrl: 'https://aupaircare.intraxjp.com',
  siteName: 'オペア留学 | AupairCare by Intrax',
  defaultLocale: 'ja_JP',
  defaultOgImage: '/og-image.jpg',
  publisher: { name: 'AupairCare by Intrax' },
  organization: {
    type: 'EducationalOrganization',
    name: 'AupairCare by Intrax（イントラックス）',
    alternateName: ['オペアケア', 'AupairCare', 'Intrax', 'イントラックス'],
    logo: '/favicon.ico',
    description:
      'AupairCare（オペアケア）はアメリカ国務省認定のJ-1ビザスポンサーとして、日本の若者にアメリカでの有給チャイルドケア留学（オペア留学）を提供しています。90,000件以上のホストファミリーマッチング実績。',
    foundingDate: '1980',
    address: {
      streetAddress: '海岸1-9-11 マリンクスタワー7F',
      addressLocality: '港区',
      addressRegion: '東京都',
      postalCode: '105-0022',
      addressCountry: 'JP',
    },
    contactPoint: {
      telephone: '+81-3-3434-2636',
      contactType: 'customer service',
      availableLanguage: ['Japanese', 'English'],
      hoursAvailable: {
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00',
        closes: '18:30',
      },
    },
    sameAs: [
      'https://lin.ee/5LgKpr8',
      'https://www.instagram.com/intrax_aupaircare/',
      'https://www.tiktok.com/@aupaircarejp',
      'https://www.youtube.com/@AuPairCare_JP',
    ],
  },
};
