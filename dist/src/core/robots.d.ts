/**
 * Known AI / LLM crawlers as of 2026-04.
 * Keep this list under review — new ones appear roughly quarterly.
 */
export declare const AI_CRAWLERS: readonly ["GPTBot", "ChatGPT-User", "OAI-SearchBot", "ClaudeBot", "anthropic-ai", "Claude-Web", "Google-Extended", "PerplexityBot", "Perplexity-User", "Applebot-Extended", "meta-externalagent", "Meta-ExternalFetcher", "Bytespider", "Amazonbot", "CCBot", "cohere-ai", "Diffbot", "DuckAssistBot", "MistralAI-User"];
export interface UserAgentRule {
    userAgent: string;
    allow?: string[];
    disallow?: string[];
}
export interface RobotsOptions {
    siteUrl: string;
    sitemapPath?: string;
    allowAllDefault?: boolean;
    allowAiCrawlers?: boolean;
    aiCrawlers?: string[];
    additionalRules?: UserAgentRule[];
    disallowPaths?: string[];
    extraLines?: string[];
}
export declare function buildRobotsTxt(opts: RobotsOptions): string;
//# sourceMappingURL=robots.d.ts.map