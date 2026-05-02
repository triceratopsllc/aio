export const otherCheck = {
    id: 'other',
    label: 'その他の AIO 関連項目',
    maxScore: 5,
    async run(ctx) {
        const findings = [];
        const pkgRaw = await ctx.readFile('package.json');
        let score = 0;
        if (pkgRaw) {
            try {
                const pkg = JSON.parse(pkgRaw);
                const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
                if (deps['@sentry/nextjs'] || deps['@sentry/node']) {
                    score += 1;
                    findings.push({ severity: 'pass', message: 'Sentry 導入済み（監視基盤OK）' });
                }
                if (deps['next']) {
                    score += 2;
                    findings.push({ severity: 'pass', message: `Next.js ${deps['next']}（SSR/SSG対応）` });
                }
                else if (deps['vite']) {
                    findings.push({ severity: 'warn', message: 'Vite — プリレンダリング推奨' });
                }
            }
            catch {
                findings.push({ severity: 'warn', message: 'package.json 解析失敗' });
            }
        }
        const hasManifest = await ctx.fileExists('public/manifest.json') || await ctx.fileExists('public/site.webmanifest');
        if (hasManifest) {
            score += 1;
            findings.push({ severity: 'pass', message: 'Web App Manifest あり' });
        }
        else {
            findings.push({ severity: 'info', message: 'Web App Manifest 無し（必須ではないが推奨）' });
        }
        const hasFavicon = (await ctx.fileExists('public/favicon.ico')) ||
            (await ctx.fileExists('src/app/favicon.ico')) ||
            (await ctx.fileExists('app/favicon.ico'));
        if (hasFavicon) {
            score += 1;
            findings.push({ severity: 'pass', message: 'favicon 設定済み' });
        }
        score = Math.min(score, this.maxScore);
        let status = 'pass';
        if (score < this.maxScore * 0.5)
            status = 'warn';
        return {
            id: this.id,
            label: this.label,
            score,
            maxScore: this.maxScore,
            status,
            summary: `付帯項目 ${score}/${this.maxScore}`,
            findings,
        };
    },
};
//# sourceMappingURL=other.js.map