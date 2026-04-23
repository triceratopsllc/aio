#!/usr/bin/env node
import { resolve } from 'node:path';
import { writeFile } from 'node:fs/promises';
import { runNextjsCodeAudit, renderMarkdownReport } from '../src/audit/index.js';

interface Args {
  path: string;
  name?: string;
  output?: string;
  json?: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = { path: '' };
  const positional: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a === '--name' || a === '-n') args.name = argv[++i];
    else if (a === '--output' || a === '-o') args.output = argv[++i];
    else if (a === '--json') args.json = true;
    else if (a === '--help' || a === '-h') {
      console.log(`
Usage: aio-audit <project-path> [options]

Options:
  -n, --name <name>    Site name for the report header
  -o, --output <path>  Write the report to a file (default: stdout)
  --json               Emit JSON instead of Markdown
  -h, --help           Show this help
`);
      process.exit(0);
    } else if (!a.startsWith('-')) {
      positional.push(a);
    }
  }
  args.path = positional[0] ?? '';
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.path) {
    console.error('error: project path required. see --help');
    process.exit(2);
  }

  const projectRoot = resolve(args.path);
  const result = await runNextjsCodeAudit({ projectRoot, name: args.name });

  const output = args.json
    ? JSON.stringify(result, null, 2)
    : renderMarkdownReport(result);

  if (args.output) {
    await writeFile(resolve(args.output), output, 'utf8');
    console.error(`Report written to ${args.output}`);
    console.error(`AIO Readiness: ${result.readinessPercent}% (${result.overallScore}/${result.maxScore})`);
  } else {
    process.stdout.write(output);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
