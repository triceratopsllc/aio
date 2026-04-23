# 統合ガイド

サイトのフレームワーク別に AIO 基盤を組み込む手順。

## 共通：SiteConfig の用意

すべてのアダプタはまず `SiteConfig` を必要とする。`examples/aupaircare.config.ts` を参考に、サイトごとに1ファイル作る。

```ts
// lib/site.ts
import type { SiteConfig } from '@triceratops/aio/core';

export const site: SiteConfig = {
  siteUrl: 'https://example.com',
  siteName: 'Example Site',
  defaultLocale: 'ja_JP',
  defaultOgImage: '/og-image.jpg',
  publisher: { name: 'Example Inc.' },
  organization: {
    type: 'Organization',
    name: 'Example Inc.',
    logo: '/logo.svg',
    // ...
  },
};
```

---

## Next.js 14+ （App Router）

### 1. ルートレイアウトで Organization / WebSite JSON-LD

```tsx
// app/layout.tsx
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from '@triceratops/aio/core';
import { jsonLdScriptProps } from '@triceratops/aio/next';
import { site } from '@/lib/site';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ld = [buildOrganizationJsonLd(site), buildWebSiteJsonLd(site)];
  return (
    <html lang="ja">
      <head>
        <script {...jsonLdScriptProps({ data: ld, id: 'root-ld' })} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 2. 各ページで `generateMetadata` + ページ固有 JSON-LD

```tsx
// app/faq/page.tsx
import { buildPageMetadata, jsonLdScriptProps } from '@triceratops/aio/next';
import { buildFaqJsonLd, buildBreadcrumbJsonLd } from '@triceratops/aio/core';
import { site } from '@/lib/site';

export const metadata = buildPageMetadata({
  site,
  title: 'よくある質問',
  description: '...',
  path: '/faq',
});

export default function FaqPage() {
  const faqs = [{ question: 'Q1', answer: 'A1' }];
  return (
    <>
      <script {...jsonLdScriptProps({
        data: [
          buildBreadcrumbJsonLd(site, [{ name: 'FAQ', path: '/faq' }]),
          buildFaqJsonLd(faqs),
        ],
      })} />
      {/* ... */}
    </>
  );
}
```

### 3. サイトマップ / robots.txt

`app/sitemap.ts` と `app/robots.ts` は Next.js 組み込み API を使う方が自然だが、動的ソースが多い場合は `buildSitemapFromSources` の出力を `MetadataRoute.Sitemap` 形式に変換。

```ts
// app/robots.ts
import type { MetadataRoute } from 'next';
import { AI_CRAWLERS } from '@triceratops/aio/core';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...AI_CRAWLERS.map((ua) => ({ userAgent: ua, allow: '/' })),
    ],
    sitemap: 'https://example.com/sitemap.xml',
  };
}
```

---

## Vite + React（react-helmet-async）

### 1. `HelmetProvider` でアプリをラップ

```tsx
// src/main.tsx
import { HelmetProvider } from 'react-helmet-async';
// ...
<HelmetProvider>
  <App />
</HelmetProvider>
```

### 2. 各ページで `<PageSeo>`

```tsx
// src/pages/Faq.tsx
import { PageSeo } from '@triceratops/aio/react-helmet';
import { buildFaqJsonLd, buildBreadcrumbJsonLd } from '@triceratops/aio/core';
import { site } from '../lib/site';

export default function FaqPage() {
  return (
    <>
      <PageSeo
        site={site}
        title="よくある質問"
        description="..."
        path="/faq"
        jsonLd={[
          buildBreadcrumbJsonLd(site, [{ name: 'FAQ', path: '/faq' }]),
          buildFaqJsonLd([{ question: 'Q1', answer: 'A1' }]),
        ]}
      />
      {/* ... */}
    </>
  );
}
```

### 3. ビルド時 sitemap 生成

`scripts/generate-sitemap.ts` を作り `package.json` の `build` 前に実行。例は `README.md` 参照。

### 4. プリレンダリング

Phase 2 対応（本パッケージ未統合 — aupaircare の `scripts/prerender.js` を参考に個別実装）。

---

## WordPress

`src/wordpress/README.md` 参照。基本的には：

- title / description / canonical は Yoast or RankMath に任せる
- HowTo / Service / 追加の FAQPage / BreadcrumbList を独自 MU プラグインで出力
- robots.txt は `templates/robots.txt` を静的配置

---

## 移行チェックリスト（既存サイト → @triceratops/aio）

- [ ] `SiteConfig` ファイルを作る
- [ ] 既存の `jsonLd.ts` / `seo.ts` を core のビルダーに置き換え
- [ ] 既存の `<SEO>` / `<PageSeo>` コンポーネントを `@triceratops/aio/react-helmet` の `PageSeo` に置き換え
- [ ] `public/robots.txt` を `buildRobotsTxt` 出力または `templates/robots.txt` に差し替え
- [ ] `scripts/generate-sitemap.js` を `buildSitemapFromSources` ベースに書き直し
- [ ] ビルド後、Rich Results Test / Schema Markup Validator で検証
- [ ] Search Console の URL Inspection でレンダリング確認
