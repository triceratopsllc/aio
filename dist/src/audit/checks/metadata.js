const REQUIRED_OG_KEYS = ['title', 'description', 'url', 'images', 'siteName', 'type', 'locale'];
const REQUIRED_TWITTER_KEYS = ['card', 'title', 'description', 'images'];
export const metadataCheck = {
    id: 'metadata',
    label: 'Metadata API カバレッジ',
    maxScore: 15,
    async run(ctx) {
        const pages = ctx.pages;
        const findings = [];
        if (pages.length === 0) {
            return {
                id: this.id,
                label: this.label,
                score: 0,
                maxScore: this.maxScore,
                status: 'fail',
                summary: 'ページが無いため評価不可',
                findings: [],
            };
        }
        let coveredPages = 0;
        let totalFieldSlots = 0;
        let filledFieldSlots = 0;
        for (const page of pages) {
            const hasAny = page.hasMetadata || page.hasGenerateMetadata;
            if (hasAny)
                coveredPages++;
            const fieldSlots = [
                page.metadataKeys.includes('title'),
                page.metadataKeys.includes('description'),
                page.hasAlternatesCanonical,
                page.hasRobots,
                ...REQUIRED_OG_KEYS.map((k) => page.openGraphKeys.includes(k)),
                ...REQUIRED_TWITTER_KEYS.map((k) => page.twitterKeys.includes(k)),
            ];
            totalFieldSlots += fieldSlots.length;
            filledFieldSlots += fieldSlots.filter(Boolean).length;
            const missingOg = REQUIRED_OG_KEYS.filter((k) => !page.openGraphKeys.includes(k));
            const missingTwitter = REQUIRED_TWITTER_KEYS.filter((k) => !page.twitterKeys.includes(k));
            if (!hasAny) {
                findings.push({
                    severity: 'fail',
                    message: `${page.route}: metadata 未定義`,
                    file: page.file,
                });
            }
            else {
                const missing = [];
                if (missingOg.length)
                    missing.push(`openGraph.${missingOg.join('/')}`);
                if (missingTwitter.length)
                    missing.push(`twitter.${missingTwitter.join('/')}`);
                if (!page.hasAlternatesCanonical)
                    missing.push('alternates.canonical');
                if (missing.length) {
                    findings.push({
                        severity: 'warn',
                        message: `${page.route}: 欠落 — ${missing.join(', ')}`,
                        file: page.file,
                    });
                }
                else {
                    findings.push({
                        severity: 'pass',
                        message: `${page.route}: 全フィールド充足`,
                        file: page.file,
                    });
                }
            }
        }
        const coverageRatio = totalFieldSlots > 0 ? filledFieldSlots / totalFieldSlots : 0;
        const score = Math.round(coverageRatio * this.maxScore);
        let status;
        if (coverageRatio >= 0.9)
            status = 'pass';
        else if (coverageRatio >= 0.5)
            status = 'warn';
        else
            status = 'fail';
        const percent = Math.round(coverageRatio * 100);
        const summary = `フィールド充足率 ${filledFieldSlots}/${totalFieldSlots} (${percent}%) — ページ定義 ${coveredPages}/${pages.length}`;
        return {
            id: this.id,
            label: this.label,
            score,
            maxScore: this.maxScore,
            status,
            summary,
            findings,
            data: { coveredPages, totalPages: pages.length, filledFieldSlots, totalFieldSlots },
        };
    },
};
//# sourceMappingURL=metadata.js.map