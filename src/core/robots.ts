/**
 * Known AI / LLM crawlers as of 2026-04.
 * Keep this list under review — new ones appear roughly quarterly.
 */
export const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-Web',
  'Google-Extended',
  'PerplexityBot',
  'Perplexity-User',
  'Applebot-Extended',
  'meta-externalagent',
  'Meta-ExternalFetcher',
  'Bytespider',
  'Amazonbot',
  'CCBot',
  'cohere-ai',
  'Diffbot',
  'DuckAssistBot',
  'MistralAI-User',
] as const;

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

function renderRule(rule: UserAgentRule): string {
  const lines = [`User-agent: ${rule.userAgent}`];
  for (const path of rule.allow ?? []) lines.push(`Allow: ${path}`);
  for (const path of rule.disallow ?? []) lines.push(`Disallow: ${path}`);
  return lines.join('\n');
}

export function buildRobotsTxt(opts: RobotsOptions): string {
  const {
    siteUrl,
    sitemapPath = '/sitemap.xml',
    allowAllDefault = true,
    allowAiCrawlers = true,
    aiCrawlers = [...AI_CRAWLERS],
    additionalRules = [],
    disallowPaths = [],
    extraLines = [],
  } = opts;

  const blocks: string[] = [];

  if (allowAllDefault) {
    blocks.push(
      renderRule({
        userAgent: '*',
        allow: disallowPaths.length ? undefined : ['/'],
        disallow: disallowPaths.length ? disallowPaths : undefined,
      }),
    );
  }

  if (allowAiCrawlers) {
    blocks.push('# AI Crawlers');
    for (const ua of aiCrawlers) {
      blocks.push(renderRule({ userAgent: ua, allow: ['/'] }));
    }
  }

  for (const rule of additionalRules) {
    blocks.push(renderRule(rule));
  }

  if (extraLines.length) blocks.push(extraLines.join('\n'));

  const base = siteUrl.replace(/\/$/, '');
  const sitemapAbs = sitemapPath.startsWith('http')
    ? sitemapPath
    : `${base}${sitemapPath.startsWith('/') ? sitemapPath : `/${sitemapPath}`}`;

  blocks.push(`Sitemap: ${sitemapAbs}`);

  return blocks.join('\n\n') + '\n';
}
