export const layoutJsonLdCheck = {
    id: 'layout-jsonld',
    label: 'ルートレイアウト JSON-LD 注入',
    maxScore: 10,
    async run(ctx) {
        const findings = [];
        if (!ctx.rootLayoutFile) {
            return {
                id: this.id,
                label: this.label,
                score: 0,
                maxScore: this.maxScore,
                status: 'fail',
                summary: 'ルートレイアウトが見つからない',
                findings: [],
            };
        }
        const content = (await ctx.readFile(ctx.rootLayoutFile)) ?? '';
        const hasLdScript = /application\/ld\+json/.test(content);
        const types = [];
        const typeRe = /['"]@type['"]\s*:\s*['"]([A-Za-z]+)['"]/g;
        let m;
        while ((m = typeRe.exec(content)))
            types.push(m[1]);
        if (!hasLdScript) {
            return {
                id: this.id,
                label: this.label,
                score: 0,
                maxScore: this.maxScore,
                status: 'fail',
                summary: 'レイアウトに JSON-LD 注入無し — Organization/WebSite がサイト全体で不足',
                findings: [{ severity: 'fail', message: 'ルートレイアウトに application/ld+json script が無し', file: ctx.rootLayoutFile }],
            };
        }
        findings.push({ severity: 'pass', message: `JSON-LD script 検出（型: ${types.join(', ') || '不明'}）`, file: ctx.rootLayoutFile });
        const hasOrg = types.some((t) => ['Organization', 'EducationalOrganization', 'LocalBusiness', 'Corporation'].includes(t));
        const hasSite = types.includes('WebSite');
        let score = this.maxScore * 0.5;
        if (hasOrg)
            score += this.maxScore * 0.3;
        if (hasSite)
            score += this.maxScore * 0.2;
        score = Math.round(score);
        let status = 'pass';
        if (!hasOrg || !hasSite)
            status = 'warn';
        const missing = [];
        if (!hasOrg)
            missing.push('Organization');
        if (!hasSite)
            missing.push('WebSite');
        return {
            id: this.id,
            label: this.label,
            score,
            maxScore: this.maxScore,
            status,
            summary: missing.length === 0 ? 'Organization + WebSite 注入済み' : `欠落: ${missing.join(', ')}`,
            findings,
            data: { types },
        };
    },
};
//# sourceMappingURL=layout-jsonld.js.map