import type { CodeCheck, DimensionResult, Finding } from '../types.js';

export const localeCheck: CodeCheck = {
  id: 'locale',
  label: 'HTML lang / locale 宣言',
  maxScore: 5,
  async run(ctx): Promise<DimensionResult> {
    const findings: Finding[] = [];

    if (!ctx.rootLayoutFile) {
      return {
        id: this.id,
        label: this.label,
        score: 0,
        maxScore: this.maxScore,
        status: 'fail',
        summary: 'ルートレイアウトが見つからない',
        findings: [{ severity: 'fail', message: 'layout.tsx を検出できませんでした' }],
      };
    }

    const content = (await ctx.readFile(ctx.rootLayoutFile)) ?? '';
    const langMatch = content.match(/<html[^>]*\blang\s*=\s*["']([^"']+)["']/);
    const localeMatch = content.match(/locale\s*:\s*["']([a-zA-Z_-]+)["']/);

    let score = 0;
    let status: DimensionResult['status'] = 'pass';
    const parts: string[] = [];

    if (langMatch) {
      score += 3;
      parts.push(`html lang="${langMatch[1]}"`);
      findings.push({ severity: 'pass', message: `html lang 設定: ${langMatch[1]}` });
    } else {
      status = 'warn';
      findings.push({ severity: 'warn', message: 'html lang 属性が未設定' });
    }

    if (localeMatch) {
      score += 2;
      parts.push(`locale="${localeMatch[1]}"`);
      findings.push({ severity: 'pass', message: `metadata locale 設定: ${localeMatch[1]}` });
    } else {
      status = status === 'pass' ? 'warn' : status;
      findings.push({ severity: 'warn', message: 'openGraph.locale が未設定' });
    }

    return {
      id: this.id,
      label: this.label,
      score,
      maxScore: this.maxScore,
      status,
      summary: parts.length > 0 ? parts.join(', ') : '未設定',
      findings,
    };
  },
};
