import type { CodeCheck, DimensionResult, Finding } from '../types.js';
import { AI_CRAWLERS } from '../../core/robots.js';

export const robotsCheck: CodeCheck = {
  id: 'robots',
  label: 'robots.txt / AI クローラー許可',
  maxScore: 10,
  async run(ctx): Promise<DimensionResult> {
    const findings: Finding[] = [];

    const robotsTsExists = await ctx.fileExists('src/app/robots.ts') || await ctx.fileExists('app/robots.ts');
    const robotsTxtExists = await ctx.fileExists('public/robots.txt');

    if (!robotsTsExists && !robotsTxtExists) {
      return {
        id: this.id,
        label: this.label,
        score: 0,
        maxScore: this.maxScore,
        status: 'fail',
        summary: 'robots.ts / robots.txt が存在しない（全AIクローラーブロック状態）',
        findings: [
          {
            severity: 'fail',
            message: 'robots 設定が見つかりません',
            detail: 'app/robots.ts または public/robots.txt のどちらも存在しないため、デフォルトの挙動になります。',
          },
        ],
      };
    }

    let content = '';
    let source = '';
    if (robotsTsExists) {
      source = 'app/robots.ts';
      content =
        (await ctx.readFile('src/app/robots.ts')) ??
        (await ctx.readFile('app/robots.ts')) ??
        '';
    } else if (robotsTxtExists) {
      source = 'public/robots.txt';
      content = (await ctx.readFile('public/robots.txt')) ?? '';
    }

    findings.push({
      severity: 'pass',
      message: `${source} 存在`,
      file: source,
    });

    const allowedCrawlers: string[] = [];
    const missingCrawlers: string[] = [];

    for (const crawler of AI_CRAWLERS) {
      if (content.toLowerCase().includes(crawler.toLowerCase())) {
        allowedCrawlers.push(crawler);
      } else {
        missingCrawlers.push(crawler);
      }
    }

    const ratio = allowedCrawlers.length / AI_CRAWLERS.length;
    const score = Math.round(ratio * this.maxScore);

    for (const c of missingCrawlers) {
      findings.push({ severity: 'warn', message: `${c} が許可リストに無し` });
    }

    let status: DimensionResult['status'];
    if (ratio >= 0.8) status = 'pass';
    else if (ratio >= 0.3) status = 'warn';
    else status = 'fail';

    const summary = `AI クローラー許可: ${allowedCrawlers.length}/${AI_CRAWLERS.length} (${Math.round(ratio * 100)}%)`;

    return {
      id: this.id,
      label: this.label,
      score,
      maxScore: this.maxScore,
      status,
      summary,
      findings,
      data: { source, allowedCrawlers, missingCrawlers },
    };
  },
};
