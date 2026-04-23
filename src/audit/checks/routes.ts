import type { CodeCheck, DimensionResult } from '../types.js';

export const routesCheck: CodeCheck = {
  id: 'routes',
  label: 'ページ / ルート構成',
  maxScore: 5,
  async run(ctx): Promise<DimensionResult> {
    const pages = ctx.pages;
    const dynamicCount = pages.filter((p) => p.isDynamic).length;
    const staticCount = pages.length - dynamicCount;

    let score = 0;
    let status: DimensionResult['status'] = 'info';
    let summary: string;

    if (pages.length === 0) {
      score = 0;
      status = 'fail';
      summary = 'ページが検出されませんでした';
    } else if (pages.length < 3) {
      score = 2;
      status = 'warn';
      summary = `ページ数が少ない（${pages.length}ページ）— 初期段階の可能性`;
    } else {
      score = 5;
      status = 'pass';
      summary = `${pages.length}ページ検出（静的${staticCount} / 動的${dynamicCount}）`;
    }

    return {
      id: this.id,
      label: this.label,
      score,
      maxScore: this.maxScore,
      status,
      summary,
      findings: pages.map((p) => ({
        severity: 'info' as const,
        message: `${p.route}${p.isDynamic ? ' (動的)' : ''}`,
        file: p.file,
      })),
      data: { total: pages.length, static: staticCount, dynamic: dynamicCount },
    };
  },
};
