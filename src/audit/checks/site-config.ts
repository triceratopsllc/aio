import type { CodeCheck, DimensionResult, Finding } from '../types.js';

const CANDIDATES = [
  'src/lib/site.ts',
  'src/lib/site-config.ts',
  'src/config/site.ts',
  'src/config/site-config.ts',
  'lib/site.ts',
  'lib/site-config.ts',
  'config/site.ts',
  'config/site-config.ts',
  'src/lib/config.ts',
  'lib/config.ts',
];

export const siteConfigCheck: CodeCheck = {
  id: 'site-config',
  label: 'サイト中央設定ファイル',
  maxScore: 10,
  async run(ctx): Promise<DimensionResult> {
    const findings: Finding[] = [];

    let found: string | null = null;
    for (const c of CANDIDATES) {
      if (await ctx.fileExists(c)) {
        found = c;
        break;
      }
    }

    if (!found) {
      return {
        id: this.id,
        label: this.label,
        score: 0,
        maxScore: this.maxScore,
        status: 'fail',
        summary: '中央 SiteConfig 無し — siteUrl / organization がハードコード散在',
        findings: [
          {
            severity: 'fail',
            message: 'lib/site.ts 等の中央サイト設定ファイルが見つかりません',
            detail:
              'JSON-LD や metadata を生成する際にハードコード値が複数箇所に散るため保守性が低下します',
          },
        ],
      };
    }

    const content = (await ctx.readFile(found)) ?? '';
    const hasSiteUrl = /siteUrl/.test(content);
    const hasSiteName = /siteName/.test(content);
    const hasOrg = /organization/i.test(content);

    let score = this.maxScore * 0.5;
    const parts: string[] = [];
    if (hasSiteUrl) {
      score += this.maxScore * 0.2;
      parts.push('siteUrl');
    }
    if (hasSiteName) {
      score += this.maxScore * 0.15;
      parts.push('siteName');
    }
    if (hasOrg) {
      score += this.maxScore * 0.15;
      parts.push('organization');
    }
    score = Math.round(score);

    findings.push({ severity: 'pass', message: `SiteConfig 検出: ${found}`, file: found });

    let status: DimensionResult['status'] = 'pass';
    if (!hasSiteUrl || !hasOrg) status = 'warn';

    return {
      id: this.id,
      label: this.label,
      score,
      maxScore: this.maxScore,
      status,
      summary: parts.length > 0 ? `${found} — ${parts.join(', ')} 定義` : `${found} は存在するが内容が薄い`,
      findings,
      data: { path: found, hasSiteUrl, hasSiteName, hasOrg },
    };
  },
};
