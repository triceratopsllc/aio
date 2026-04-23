# @triceratops/aio

AI Overview / 生成AI検索対策のための共通ツールキット。JSON-LD ビルダー、sitemap、robots.txt、OGP メタタグを、Vite / Next.js / WordPress のどのサイトにも適用できる形で提供します。

## 提供モジュール

| モジュール | import | 用途 |
|---|---|---|
| Core（FW非依存） | `@triceratops/aio/core` | JSON-LD 7種、sitemap XML、robots.txt 生成 |
| React + react-helmet-async | `@triceratops/aio/react-helmet` | Vite/CRA 系用 `<PageSeo>` コンポーネント |
| Next.js 14+ | `@triceratops/aio/next` | `generateMetadata()` helper、JSON-LD script helper |
| WordPress | `src/wordpress/README.md` 参照 | テーマ / MU プラグイン経由の統合パターン |

## クイックスタート（Next.js）

```ts
// lib/site.ts
import type { SiteConfig } from '@triceratops/aio/core';
export const site: SiteConfig = {
  siteUrl: 'https://example.com',
  siteName: 'Example Site',
  organization: { name: 'Example Inc.', type: 'Organization' },
};

// app/page.tsx
import { buildPageMetadata, jsonLdScriptProps } from '@triceratops/aio/next';
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from '@triceratops/aio/core';
import { site } from '@/lib/site';

export const metadata = buildPageMetadata({
  site,
  title: 'Home',
  description: '...',
  path: '/',
});

export default function HomePage() {
  return (
    <>
      <script {...jsonLdScriptProps({
        data: [buildOrganizationJsonLd(site), buildWebSiteJsonLd(site)],
      })} />
      {/* page body */}
    </>
  );
}
```

## クイックスタート（Vite + React Helmet）

```tsx
import { PageSeo } from '@triceratops/aio/react-helmet';
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from '@triceratops/aio/core';
import { site } from './site-config';

<PageSeo
  site={site}
  title="FAQ"
  description="よくある質問"
  path="/faq"
  jsonLd={[
    buildBreadcrumbJsonLd(site, [{ name: 'FAQ', path: '/faq' }]),
    buildFaqJsonLd([{ question: 'Q1', answer: 'A1' }]),
  ]}
/>
```

## sitemap 生成

```ts
import { buildSitemapFromSources } from '@triceratops/aio/core';
import { writeFileSync } from 'node:fs';

const { xml, counts } = await buildSitemapFromSources({
  siteUrl: site.siteUrl,
  staticEntries: [
    { path: '/', changefreq: 'weekly', priority: 1.0 },
    { path: '/about', changefreq: 'monthly', priority: 0.9 },
  ],
  dynamicSources: [
    {
      label: 'blogs',
      fetch: async () => {
        const res = await fetch('https://api.example.com/blogs');
        const data = await res.json();
        return data.records.map((r: any) => ({
          path: `/blog/${r.slug}`,
          changefreq: 'monthly' as const,
          priority: 0.6,
        }));
      },
    },
  ],
});

writeFileSync('public/sitemap.xml', xml);
console.log(counts);
```

## robots.txt 生成

```ts
import { buildRobotsTxt } from '@triceratops/aio/core';
import { writeFileSync } from 'node:fs';

writeFileSync(
  'public/robots.txt',
  buildRobotsTxt({
    siteUrl: 'https://example.com',
    allowAiCrawlers: true,
  }),
);
```

もしくは `templates/robots.txt` を `{{SITE_URL}}` 置換してコピーするだけでも可。

## 提供内容 / 営業項目

詳細は `docs/offering.md` 参照。

## ステータス

- [x] Core（JSON-LD 7種、sitemap、robots.txt）
- [x] React + react-helmet-async アダプタ
- [x] Next.js 14+ アダプタ
- [ ] WordPress MU プラグイン（ドキュメントのみ、実装は未着手）
- [ ] OGP 画像ランタイム生成（Satori / @vercel/og）
- [ ] プリレンダリング抽出（Puppeteer）
- [ ] aupaircare の移行
