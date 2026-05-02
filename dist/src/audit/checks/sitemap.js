export const sitemapCheck = {
    id: 'sitemap',
    label: 'sitemap.xml',
    maxScore: 10,
    async run(ctx) {
        const findings = [];
        const sitemapTsExists = (await ctx.fileExists('src/app/sitemap.ts')) || (await ctx.fileExists('app/sitemap.ts'));
        const sitemapXmlExists = await ctx.fileExists('public/sitemap.xml');
        const generatorExists = (await ctx.fileExists('scripts/generate-sitemap.js')) ||
            (await ctx.fileExists('scripts/generate-sitemap.ts')) ||
            (await ctx.fileExists('scripts/sitemap.ts'));
        if (!sitemapTsExists && !sitemapXmlExists && !generatorExists) {
            return {
                id: this.id,
                label: this.label,
                score: 0,
                maxScore: this.maxScore,
                status: 'fail',
                summary: 'sitemap 定義が見つからない — 検索エンジン・AI がページ構造を把握できない',
                findings: [{ severity: 'fail', message: 'app/sitemap.ts / public/sitemap.xml / generator script いずれも無し' }],
            };
        }
        let source = '';
        let content = '';
        if (sitemapTsExists) {
            source = 'app/sitemap.ts';
            content =
                (await ctx.readFile('src/app/sitemap.ts')) ?? (await ctx.readFile('app/sitemap.ts')) ?? '';
        }
        else if (sitemapXmlExists) {
            source = 'public/sitemap.xml';
            content = (await ctx.readFile('public/sitemap.xml')) ?? '';
        }
        else {
            source = 'scripts/generate-sitemap.*';
        }
        findings.push({ severity: 'pass', message: `${source} 存在`, file: source });
        let urlCount = 0;
        if (source === 'public/sitemap.xml') {
            urlCount = (content.match(/<url>/g) ?? []).length;
        }
        else if (source === 'app/sitemap.ts') {
            const pushes = (content.match(/\{\s*url\s*:/g) ?? []).length;
            urlCount = pushes;
        }
        const referencesDynamic = /params|generateStaticParams|fetch|await|map\(/.test(content);
        let score = this.maxScore * 0.5;
        if (urlCount >= 10)
            score = this.maxScore * 0.8;
        if (referencesDynamic)
            score = this.maxScore;
        score = Math.round(score);
        let status = 'pass';
        if (urlCount < 3 && !referencesDynamic)
            status = 'warn';
        const summary = urlCount > 0
            ? `${urlCount} URL検出${referencesDynamic ? '（動的ルート対応）' : '（静的のみ）'}`
            : '存在するが URL 数を計測できず';
        if (!referencesDynamic) {
            findings.push({ severity: 'warn', message: '動的ルート（ブログ等）のカバレッジが不明' });
        }
        return {
            id: this.id,
            label: this.label,
            score,
            maxScore: this.maxScore,
            status,
            summary,
            findings,
            data: { source, urlCount, referencesDynamic },
        };
    },
};
//# sourceMappingURL=sitemap.js.map