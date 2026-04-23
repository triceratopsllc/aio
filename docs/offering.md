# AIO（AI Overview対策）提供メニュー

ChatGPT / Claude / Perplexity / Google AI Overview などの**生成AI検索**にサイトを認識・引用してもらうための施策パッケージ。

## なぜ今やるか

- Google 検索結果の AI Overview 表示比率が上昇中。従来の SEO だけではクリック流入が減衰する
- ChatGPT・Claude・Perplexity からの引用は**新しい流入ソース**。早期対応するほど学習データに取り込まれる
- 構造化データ（JSON-LD）が整っているサイトほど AI に正しく要約される
- AI クローラーを `robots.txt` でブロックしているとそもそも学習対象にならない

## 対象フレームワーク

| FW | アダプタ | 備考 |
|---|---|---|
| Next.js（App Router） | `@triceratops/aio/next` | 推奨。SSR / SSG で生成AIに強い |
| Vite + React | `@triceratops/aio/react-helmet` | 既存資産活用時のオプション |
| WordPress | テーマ / MU プラグイン | Yoast / RankMath との共存可 |
| その他（純HTML） | Core API から静的出力 | ビルド時にJSON-LD/robots.txt生成 |

## フェーズ構成

### Phase 1 — AI基盤整備（必須）

**目的:** 生成AIにサイトを「見つけてもらう・正しく読んでもらう」土台を作る

| 作業項目 | 内容 | 工数目安 |
|---|---|---|
| JSON-LD構造化データ | Organization / WebSite / BreadcrumbList / FAQPage / Service / HowTo / Article の 7 スキーマを全ページに埋め込み | 2〜3人日 |
| robots.txt 最適化 | GPTBot, ClaudeBot, PerplexityBot, Google-Extended など 19種の AI クローラーを明示的に許可 | 0.5人日 |
| サイトマップ拡張 | 静的ページ + 動的コンテンツ（ブログ / カテゴリ / 事例）を全URL網羅 | 1人日 |
| OGP / メタタグ整備 | canonical / description / og:* / twitter:* を全ページに設定、OGP画像（1200×630）用意 | 1〜2人日 |

**標準価格:** ¥480,000〜（ページ数により変動）

### Phase 2 — プリレンダリング / SSR化（Vite系のみ）

**目的:** クライアントサイドレンダリングのサイトを AI / 検索エンジンが読める静的HTMLに変換

| 作業項目 | 内容 |
|---|---|
| Puppeteer プリレンダリング | ビルド時に全ルートをヘッドレスブラウザで描画し静的HTML化 |
| ビルド時 API プロキシ | 動的ルート（ブログ / 事例）をビルド時に API 取得して展開 |
| Helmet同期検証 | head メタタグが正しく生成されていることを自動検証 |

**標準価格:** ¥300,000〜

**注:** Next.js で構築済みの場合は Phase 2 不要（SSG/SSR で対応済み）。

### Phase 3 — AIO コンテンツ最適化

**目的:** AI が「このサイトを引用しよう」と判断するコンテンツを増やす

| 作業項目 | 内容 |
|---|---|
| FAQ / 料金の構造化 | AI が質問応答に使いやすい FAQPage スキーマを充実 |
| プログラム / 商品比較データ | ComparisonTable 相当の構造化 + 本文 |
| AI ナレッジベース | サイト固有の一次情報（事例数・実績・定義）をまとめる |
| AIO コピーライティング | 見出し / 回答を AI 引用しやすい形に書き換え |

**標準価格:** ¥200,000〜¥600,000（ボリューム次第）

### Phase 4 — 運用 / モニタリング（任意）

- AI検索（Perplexity / ChatGPT）でのサイト引用状況モニタリング
- robots.txt / JSON-LD の定期レビュー（AI クローラーは四半期単位で増える）
- Google Search Console の AI Overview パフォーマンス分析

**月額:** ¥30,000〜¥80,000

## 提供フロー

1. ヒアリング（サイト現状 / 業種 / 既存 SEO 施策）
2. 監査レポート（JSON-LD カバレッジ / robots.txt / サイトマップ / コンテンツ構造の現状診断）
3. 見積 / 実施計画
4. 実装 → テスト → デプロイ
5. 引き渡し + 運用ドキュメント

## 差別化ポイント

- **共通ライブラリ化済み:** `@triceratops/aio` を用いるため、同じ品質を短期間・低単価で提供可能
- **主要 3FW 対応:** Next.js / Vite / WordPress のいずれでも適用可
- **実績:** aupaircare.intraxjp.com で Phase 1 + 2 完了（157 ページをプリレンダリング、7種 JSON-LD 実装）
- **最新の AI クローラー網羅:** Applebot-Extended、meta-externalagent、MistralAI-User など 2026 年時点の最新クローラーに対応

## よくある質問

**Q: 既存サイトのSEO施策（Yoast など）と共存できますか？**
A: 可能です。Yoast / RankMath は title / description / canonical を担当し、`@triceratops/aio` は生成AI向けの拡張 JSON-LD（HowTo / Service / FAQPage）を担当する形で分業できます。

**Q: 効果が出るまでの期間は？**
A: Google AI Overview / Perplexity は数週間〜1ヶ月で反映され始めます。ChatGPT / Claude の学習反映は数ヶ月かかる場合があります。

**Q: どの業界に効きますか？**
A: 特に効果が大きいのは、「比較検討 / 手順説明 / FAQ / 料金」が検索される業種（教育、人材、士業、BtoB SaaS、医療、不動産など）です。
