const STANDARD_SCHEMAS = [
    'Organization',
    'EducationalOrganization',
    'LocalBusiness',
    'Corporation',
    'WebSite',
    'BreadcrumbList',
    'FAQPage',
    'Service',
    'HowTo',
    'Article',
    'NewsArticle',
    'BlogPosting',
];
const CORE_SCHEMA_FAMILIES = [
    { family: 'Organization', members: ['Organization', 'EducationalOrganization', 'LocalBusiness', 'Corporation'] },
    { family: 'WebSite', members: ['WebSite'] },
    { family: 'BreadcrumbList', members: ['BreadcrumbList'] },
    { family: 'FAQPage', members: ['FAQPage'] },
    { family: 'Service', members: ['Service'] },
    { family: 'HowTo', members: ['HowTo'] },
    { family: 'Article', members: ['Article', 'NewsArticle', 'BlogPosting'] },
];
export const jsonldCheck = {
    id: 'jsonld',
    label: 'JSON-LD 構造化データ',
    maxScore: 20,
    async run(ctx) {
        const findings = [];
        const allTypes = new Set();
        let pagesWithJsonLd = 0;
        for (const page of ctx.pages) {
            if (page.hasJsonLd) {
                pagesWithJsonLd++;
                for (const t of page.jsonLdTypes)
                    allTypes.add(t);
                findings.push({
                    severity: 'pass',
                    message: `${page.route}: JSON-LD あり (${page.jsonLdTypes.join(', ') || '型不明'})`,
                    file: page.file,
                });
            }
            else {
                findings.push({
                    severity: 'fail',
                    message: `${page.route}: JSON-LD 無し`,
                    file: page.file,
                });
            }
        }
        const coveredFamilies = CORE_SCHEMA_FAMILIES.filter((fam) => fam.members.some((m) => allTypes.has(m))).map((fam) => fam.family);
        const missingFamilies = CORE_SCHEMA_FAMILIES.filter((fam) => !fam.members.some((m) => allTypes.has(m))).map((fam) => fam.family);
        for (const fam of missingFamilies) {
            findings.push({
                severity: 'warn',
                message: `${fam} スキーマ未実装`,
            });
        }
        const familyScore = (coveredFamilies.length / CORE_SCHEMA_FAMILIES.length) * (this.maxScore * 0.7);
        const coverageScore = ctx.pages.length > 0 ? (pagesWithJsonLd / ctx.pages.length) * (this.maxScore * 0.3) : 0;
        const score = Math.round(familyScore + coverageScore);
        let status;
        if (pagesWithJsonLd === 0)
            status = 'fail';
        else if (missingFamilies.length > 3)
            status = 'warn';
        else if (missingFamilies.length === 0)
            status = 'pass';
        else
            status = 'warn';
        const summary = `${coveredFamilies.length}/${CORE_SCHEMA_FAMILIES.length} コアスキーマ実装 — ${pagesWithJsonLd}/${ctx.pages.length} ページに埋め込み`;
        return {
            id: this.id,
            label: this.label,
            score,
            maxScore: this.maxScore,
            status,
            summary,
            findings,
            data: {
                coveredFamilies,
                missingFamilies,
                allTypes: [...allTypes],
                pagesWithJsonLd,
                totalPages: ctx.pages.length,
            },
        };
    },
};
export { STANDARD_SCHEMAS };
//# sourceMappingURL=jsonld.js.map