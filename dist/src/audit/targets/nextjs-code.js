import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { ALL_CHECKS } from '../checks/index.js';
async function exists(path) {
    try {
        await stat(path);
        return true;
    }
    catch {
        return false;
    }
}
async function safeRead(path) {
    try {
        return await readFile(path, 'utf8');
    }
    catch {
        return null;
    }
}
async function walk(dir, out, root) {
    let entries;
    try {
        entries = await readdir(dir, { withFileTypes: true });
    }
    catch {
        return;
    }
    for (const entry of entries) {
        if (entry.name === 'node_modules' || entry.name.startsWith('.'))
            continue;
        const abs = join(dir, entry.name);
        if (entry.isDirectory()) {
            await walk(abs, out, root);
        }
        else if (entry.isFile()) {
            out.push(abs);
        }
    }
}
function fileToRoute(appRoot, file) {
    const rel = relative(appRoot, file);
    const dir = rel.split(sep).slice(0, -1).join('/');
    if (!dir)
        return '/';
    const segments = dir.split('/').filter((s) => {
        if (s.startsWith('(') && s.endsWith(')'))
            return false;
        if (s.startsWith('@'))
            return false;
        return true;
    });
    return '/' + segments.join('/');
}
function extractBlockKeys(source, blockName) {
    const idx = source.indexOf(`${blockName}:`);
    if (idx < 0)
        return [];
    let i = source.indexOf('{', idx);
    if (i < 0)
        return [];
    let depth = 0;
    let end = -1;
    for (let j = i; j < source.length; j++) {
        const c = source[j];
        if (c === '{')
            depth++;
        else if (c === '}') {
            depth--;
            if (depth === 0) {
                end = j;
                break;
            }
        }
    }
    if (end < 0)
        return [];
    const block = source.slice(i + 1, end);
    const keys = new Set();
    const keyRe = /(?:^|[,{\s])([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g;
    let m;
    while ((m = keyRe.exec(block)))
        keys.add(m[1]);
    return [...keys];
}
function analyzePageSource(source) {
    const hasMetadata = /export\s+(const|let|var)\s+metadata\b/.test(source);
    const hasGenerateMetadata = /export\s+(async\s+)?function\s+generateMetadata\b/.test(source);
    const metadataKeys = extractBlockKeys(source, 'metadata').length
        ? extractBlockKeys(source, 'metadata')
        : [];
    const topLevelKeys = new Set();
    if (hasMetadata) {
        const match = source.match(/export\s+(?:const|let|var)\s+metadata[^=]*=\s*\{/);
        if (match) {
            const startIdx = (match.index ?? 0) + match[0].length - 1;
            let depth = 0;
            let end = -1;
            for (let j = startIdx; j < source.length; j++) {
                if (source[j] === '{')
                    depth++;
                else if (source[j] === '}') {
                    depth--;
                    if (depth === 0) {
                        end = j;
                        break;
                    }
                }
            }
            if (end > 0) {
                const body = source.slice(startIdx + 1, end);
                const keyRe = /(?:^|[,\s{])([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g;
                let m;
                while ((m = keyRe.exec(body)))
                    topLevelKeys.add(m[1]);
            }
        }
    }
    const openGraphKeys = extractBlockKeys(source, 'openGraph');
    const twitterKeys = extractBlockKeys(source, 'twitter');
    const alternatesKeys = extractBlockKeys(source, 'alternates');
    const hasAlternatesCanonical = alternatesKeys.includes('canonical');
    const hasRobots = /robots\s*:/.test(source);
    const hasJsonLd = /application\/ld\+json/.test(source);
    const jsonLdTypes = [];
    const typeRe = /['"]@type['"]\s*:\s*['"]([A-Za-z]+)['"]/g;
    let m;
    while ((m = typeRe.exec(source)))
        jsonLdTypes.push(m[1]);
    return {
        hasMetadata,
        hasGenerateMetadata,
        metadataKeys: [...topLevelKeys, ...metadataKeys].filter((k, i, arr) => arr.indexOf(k) === i),
        openGraphKeys,
        twitterKeys,
        hasAlternatesCanonical,
        hasRobots,
        hasJsonLd,
        jsonLdTypes,
    };
}
async function collectPages(projectRoot) {
    const candidates = [join(projectRoot, 'src', 'app'), join(projectRoot, 'app')];
    let appRoot = null;
    for (const c of candidates) {
        if (await exists(c)) {
            appRoot = c;
            break;
        }
    }
    if (!appRoot)
        return { pages: [], rootLayout: null };
    const all = [];
    await walk(appRoot, all, appRoot);
    const pageFiles = all.filter((p) => /\/page\.tsx?$/.test(p.replace(/\\/g, '/')));
    const pages = [];
    for (const file of pageFiles) {
        const source = (await safeRead(file)) ?? '';
        const route = fileToRoute(appRoot, file);
        const isDynamic = /\[[^\]]+\]/.test(route);
        const analysis = analyzePageSource(source);
        pages.push({
            route,
            file: relative(projectRoot, file),
            isDynamic,
            ...analysis,
        });
    }
    const layoutCandidates = [
        join(appRoot, 'layout.tsx'),
        join(appRoot, 'layout.ts'),
    ];
    let rootLayout = null;
    for (const c of layoutCandidates) {
        if (await exists(c)) {
            rootLayout = relative(projectRoot, c);
            break;
        }
    }
    return { pages, rootLayout };
}
export async function runNextjsCodeAudit(opts) {
    const { projectRoot } = opts;
    const { pages, rootLayout } = await collectPages(projectRoot);
    const layoutSource = rootLayout ? (await safeRead(join(projectRoot, rootLayout))) ?? '' : '';
    const layoutAnalysis = rootLayout ? analyzePageSource(layoutSource) : null;
    const mergedPages = pages.map((p) => {
        if (!layoutAnalysis)
            return p;
        const mergeKeys = (a, b) => [...new Set([...a, ...b])];
        return {
            ...p,
            hasMetadata: p.hasMetadata || layoutAnalysis.hasMetadata,
            hasGenerateMetadata: p.hasGenerateMetadata || layoutAnalysis.hasGenerateMetadata,
            metadataKeys: mergeKeys(p.metadataKeys, layoutAnalysis.metadataKeys),
            openGraphKeys: mergeKeys(p.openGraphKeys, layoutAnalysis.openGraphKeys),
            twitterKeys: mergeKeys(p.twitterKeys, layoutAnalysis.twitterKeys),
            hasAlternatesCanonical: p.hasAlternatesCanonical || layoutAnalysis.hasAlternatesCanonical,
            hasRobots: p.hasRobots || layoutAnalysis.hasRobots,
        };
    });
    const ctx = {
        projectRoot,
        pages: mergedPages,
        rootLayoutFile: rootLayout,
        readFile: (rel) => safeRead(join(projectRoot, rel)),
        fileExists: (rel) => exists(join(projectRoot, rel)),
    };
    const dimensions = await Promise.all(ALL_CHECKS.map((c) => c.run(ctx)));
    const maxScore = dimensions.reduce((s, d) => s + d.maxScore, 0);
    const overallScore = dimensions.reduce((s, d) => s + d.score, 0);
    const readinessPercent = maxScore > 0 ? Math.round((overallScore / maxScore) * 100) : 0;
    return {
        target: {
            kind: 'nextjs-code',
            path: projectRoot,
            name: opts.name,
        },
        timestamp: new Date().toISOString(),
        overallScore,
        maxScore,
        readinessPercent,
        dimensions,
        meta: {
            totalPages: ctx.pages.length,
            rootLayout: rootLayout ?? null,
        },
    };
}
//# sourceMappingURL=nextjs-code.js.map