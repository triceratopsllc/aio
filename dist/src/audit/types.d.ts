export type Severity = 'pass' | 'warn' | 'fail' | 'info';
export interface Finding {
    severity: Severity;
    message: string;
    detail?: string;
    file?: string;
    line?: number;
}
export interface DimensionResult {
    id: string;
    label: string;
    score: number;
    maxScore: number;
    status: Severity;
    summary: string;
    findings: Finding[];
    data?: Record<string, unknown>;
}
export type AuditTargetKind = 'nextjs-code' | 'vite-code' | 'live-url';
export interface AuditTarget {
    kind: AuditTargetKind;
    path?: string;
    url?: string;
    name?: string;
}
export interface AuditResult {
    target: AuditTarget;
    timestamp: string;
    overallScore: number;
    maxScore: number;
    readinessPercent: number;
    dimensions: DimensionResult[];
    meta: Record<string, unknown>;
}
export interface PageInfo {
    route: string;
    file: string;
    isDynamic: boolean;
    hasMetadata: boolean;
    hasGenerateMetadata: boolean;
    metadataKeys: string[];
    openGraphKeys: string[];
    twitterKeys: string[];
    hasAlternatesCanonical: boolean;
    hasRobots: boolean;
    hasJsonLd: boolean;
    jsonLdTypes: string[];
}
export interface CodeAuditContext {
    projectRoot: string;
    readFile: (relPath: string) => Promise<string | null>;
    fileExists: (relPath: string) => Promise<boolean>;
    pages: PageInfo[];
    rootLayoutFile: string | null;
}
export interface CodeCheck {
    id: string;
    label: string;
    maxScore: number;
    run: (ctx: CodeAuditContext) => Promise<DimensionResult>;
}
//# sourceMappingURL=types.d.ts.map