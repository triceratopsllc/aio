import type { CodeCheck, DimensionResult, Finding } from '../types.js';

const DEFAULT_OG_CANDIDATES = [
  'public/og-image.jpg',
  'public/og-image.png',
  'public/og-image.webp',
  'public/opengraph-image.jpg',
  'public/opengraph-image.png',
  'src/app/opengraph-image.png',
  'src/app/opengraph-image.jpg',
  'src/app/opengraph-image.tsx',
  'app/opengraph-image.png',
  'app/opengraph-image.jpg',
  'app/opengraph-image.tsx',
];

export const ogpCheck: CodeCheck = {
  id: 'ogp',
  label: 'OGP 画像',
  maxScore: 10,
  async run(ctx): Promise<DimensionResult> {
    const findings: Finding[] = [];

    const foundDefaults: string[] = [];
    for (const candidate of DEFAULT_OG_CANDIDATES) {
      if (await ctx.fileExists(candidate)) foundDefaults.push(candidate);
    }

    let perRouteCount = 0;
    for (const page of ctx.pages) {
      const dir = page.file.replace(/\/page\.tsx?$/, '');
      const candidates = [
        `${dir}/opengraph-image.png`,
        `${dir}/opengraph-image.jpg`,
        `${dir}/opengraph-image.tsx`,
      ];
      for (const c of candidates) {
        if (await ctx.fileExists(c)) {
          perRouteCount++;
          findings.push({ severity: 'pass', message: `${page.route}: 専用OGP画像あり`, file: c });
          break;
        }
      }
    }

    let score = 0;
    let status: DimensionResult['status'];
    let summary: string;

    if (foundDefaults.length === 0 && perRouteCount === 0) {
      status = 'fail';
      summary = 'デフォルトOGP画像・ルート別画像いずれも無し';
      findings.push({ severity: 'fail', message: 'OGP画像が1枚も存在しません' });
    } else if (foundDefaults.length > 0 && perRouteCount === 0) {
      score = Math.round(this.maxScore * 0.5);
      status = 'warn';
      summary = `デフォルト画像のみ（${foundDefaults[0]}）— ルート別画像推奨`;
      findings.push({ severity: 'pass', message: `デフォルトOGP: ${foundDefaults[0]}` });
    } else if (foundDefaults.length > 0 && perRouteCount >= ctx.pages.length * 0.5) {
      score = this.maxScore;
      status = 'pass';
      summary = `デフォルト + ${perRouteCount}ルート別画像`;
    } else {
      score = Math.round(this.maxScore * 0.7);
      status = 'warn';
      summary = `デフォルト ${foundDefaults.length}件 / ルート別 ${perRouteCount}件 — カバレッジ部分的`;
    }

    return {
      id: this.id,
      label: this.label,
      score,
      maxScore: this.maxScore,
      status,
      summary,
      findings,
      data: { foundDefaults, perRouteCount },
    };
  },
};
