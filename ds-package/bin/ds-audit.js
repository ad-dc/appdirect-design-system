#!/usr/bin/env node

/**
 * ds-audit — read-only DS checker for prototype repos.
 *
 * No LLM. No network. Writes prototype-audit.json.
 *
 * Usage:
 *   ds-audit
 *   ds-audit --ci
 *   node ds-package/bin/ds-audit.js --root /path/to/prototype
 */

const fs = require('fs');
const path = require('path');

const SKIP_DIR_NAMES = new Set([
  'node_modules',
  '.next',
  'dist',
  '.git',
  'storybook-static',
  'coverage',
  'DesignSystem',
]);

const SCAN_ROOTS = ['app', path.join('components', 'local')];
const TS_EXT = new Set(['.ts', '.tsx', '.js', '.jsx']);

const FALLBACK_COMPONENTS = [
  'Button',
  'ActionIcon',
  'Alert',
  'Avatar',
  'Badge',
  'Card',
  'Chip',
  'Pill',
  'Table',
  'DataTable',
  'PageContentHeader',
  'Stack',
  'Inline',
  'Group',
  'Grid',
  'Box',
  'TextInput',
  'Select',
  'Text',
  'Title',
  'Breadcrumb',
  'AppShellLayout',
];

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) continue;
    const key = argv[i].replace(/^--/, '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    args[key] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
  }
  return args;
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function firstNonEmpty(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && String(value).length > 0) return value;
  }
  return '';
}

function semverFromSpec(spec) {
  if (!spec || typeof spec !== 'string') return '';
  if (spec.includes('__KIT_TARBALL_URL__')) return '';
  const tarball = spec.match(/ds-prototype-kit-v?(\d+\.\d+\.\d+)\.tgz/);
  if (tarball) return tarball[1];
  const tagged = spec.match(/\/download\/v(\d+\.\d+\.\d+)\//);
  if (tagged) return tagged[1];
  if (/^https?:\/\//.test(spec)) return '';
  const matched = spec.match(/(\d+\.\d+\.\d+)/);
  return matched ? matched[1] : '';
}

function depSpec(pkg, name) {
  if (!pkg) return '';
  return (pkg.dependencies && pkg.dependencies[name]) || (pkg.devDependencies && pkg.devDependencies[name]) || '';
}

function lockfileResolvedVersion(root, name) {
  const lock = readJson(path.join(root, 'package-lock.json'));
  if (!lock) return '';
  if (lock.packages) {
    const entry = lock.packages[`node_modules/${name}`];
    if (entry && entry.version) return entry.version;
  }
  return '';
}

function installedVersion(root, name) {
  const parts = name.startsWith('@') ? name.split('/') : [name];
  const pkg = readJson(path.join(root, 'node_modules', ...parts, 'package.json'));
  return (pkg && pkg.version) || '';
}

function kitPackage(root) {
  return (
    readJson(path.join(root, 'node_modules', '@appdirect', 'ds-prototype-kit', 'package.json')) ||
    readJson(path.join(root, 'ds-package', 'package.json')) ||
    readJson(path.join(__dirname, '..', 'package.json'))
  );
}

function resolveVersions(root) {
  const pkg = readJson(path.join(root, 'package.json')) || {};
  const manifest = readJson(path.join(root, 'prototype-manifest.json')) || {};
  const kitPkg = kitPackage(root) || {};
  const previous = manifest.versions || {};

  const kit = firstNonEmpty(
    installedVersion(root, '@appdirect/ds-prototype-kit'),
    semverFromSpec(depSpec(pkg, '@appdirect/ds-prototype-kit')),
    kitPkg.version,
    previous.kit
  );
  const tokensSnapshot = firstNonEmpty(
    semverFromSpec(depSpec(pkg, '@appdirect/design-tokens')),
    kitPkg.tokensSnapshot,
    previous.tokensSnapshot
  );
  const mantine = firstNonEmpty(
    installedVersion(root, '@mantine/core'),
    lockfileResolvedVersion(root, '@mantine/core'),
    semverFromSpec(depSpec(pkg, '@mantine/core')),
    previous.mantine
  );
  const factory = firstNonEmpty(kit, previous.factory);
  const template = (manifest.template && manifest.template.version) || '';

  return {
    template,
    kit,
    tokensSnapshot,
    factory,
    mantine,
    latestKitKnown: kitPkg.version || kit,
    manifest,
    pkg,
  };
}

function collectContractFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectContractFiles(full, out);
    else if (entry.name.endsWith('.contract.json')) {
      out.push(full);
    }
  }
  return out;
}

function loadContracts(root) {
  const candidates = [
    path.join(root, 'node_modules', '@appdirect', 'ds-prototype-kit', 'dist', 'contracts'),
    path.join(root, 'ds-package', 'dist', 'contracts'),
    path.join(__dirname, '..', 'dist', 'contracts'),
    path.join(__dirname, '..', 'contracts'),
  ];
  for (const dir of candidates) {
    const index = readJson(path.join(dir, 'index.json'));
    if (index && Array.isArray(index.contracts)) {
      return index.contracts
        .map((item) => readJson(path.join(dir, `${item.id}.json`)))
        .filter(Boolean);
    }
  }
  const source = path.join(root, 'components', 'DesignSystem');
  return collectContractFiles(source).map((file) => readJson(file)).filter(Boolean);
}

function shouldSkipDir(name) {
  return SKIP_DIR_NAMES.has(name);
}

function shouldSkipFile(filePath) {
  const base = path.basename(filePath);
  if (base.endsWith('.stories.tsx') || base.endsWith('.stories.ts')) return true;
  if (base.endsWith('.test.ts') || base.endsWith('.test.tsx') || base.endsWith('.test.mjs')) return true;
  if (base.endsWith('.figma.tsx')) return true;
  if (filePath.includes(`${path.sep}DesignSystem${path.sep}`)) return true;
  return !TS_EXT.has(path.extname(filePath));
}

function walkFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!shouldSkipDir(entry.name)) walkFiles(full, out);
    } else if (!shouldSkipFile(full)) {
      out.push(full);
    }
  }
  return out;
}

function scanTargets(root) {
  const files = [];
  for (const rel of SCAN_ROOTS) {
    walkFiles(path.join(root, rel), files);
  }
  return files;
}

function rel(root, filePath) {
  return path.relative(root, filePath).replace(/\\/g, '/');
}

function parseNamedImports(content, source) {
  const names = [];
  const re = new RegExp(`import\\s+\\{([^}]+)\\}\\s+from\\s+['"]${source}['"]`, 'g');
  let match;
  while ((match = re.exec(content))) {
    for (const part of match[1].split(',')) {
      const name = part.trim().split(/\s+as\s+/)[0].trim();
      if (name && !name.startsWith('type ')) names.push(name);
    }
  }
  return names;
}

function countJsx(content, name) {
  const re = new RegExp(`<${name}(\\s|>|/)`, 'g');
  return (content.match(re) || []).length;
}

function lineFindings(content, fileRel, test, extra) {
  const findings = [];
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (test(line)) findings.push({ file: fileRel, line: index + 1, ...extra });
  });
  return findings;
}

function styleBlockHas(content, pattern) {
  const blocks = content.match(/style=\{\{[\s\S]*?\}\}/g) || [];
  return blocks.some((block) => pattern.test(block));
}

function isPrototypePage(fileRel) {
  return /^app\/prototype\/.+\/page\.tsx$/.test(fileRel);
}

function isPrototypeIndex(fileRel) {
  return fileRel === 'app/prototype/page.tsx';
}

function githubEscape(value) {
  return String(value).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}

function githubAnnotation(kind, finding, message) {
  const params = [];
  if (finding.file) params.push(`file=${githubEscape(finding.file)}`);
  if (finding.line) params.push(`line=${finding.line}`);
  if (finding.rule || finding.id) params.push(`title=${githubEscape(finding.rule || finding.id)}`);
  const prefix = params.length ? `::${kind} ${params.join(',')}::` : `::${kind} ::`;
  return `${prefix}${githubEscape(message)}`;
}

function formatAnnotations(report) {
  const lines = [];
  for (const item of (report.findings && report.findings.restrictedImports) || []) {
    lines.push(
      githubAnnotation(
        'error',
        item,
        'Do not import @mantine/core in prototype app/ or components/local. Use the kit (or @/components/DesignSystem in this repo).'
      )
    );
  }
  for (const item of (report.patterns && report.patterns.unsupported) || []) {
    let message = item.id;
    if (item.id === 'missing-page-content-header') {
      message = 'Prototype page is missing PageContentHeader.';
    } else if (item.id === 'handmade-record-list') {
      message = `Handmade record list; use ${item.insteadOf || 'DataTable or Table'}.`;
    }
    lines.push(githubAnnotation('warning', item, message));
  }
  return lines;
}

function shouldAnnotate(args = {}, env = process.env) {
  return Boolean(args.ci) || env.GITHUB_ACTIONS === 'true';
}

function localComponentFiles(root) {
  const dir = path.join(root, 'components', 'local');
  const files = walkFiles(dir).filter((file) => path.basename(file) !== 'index.ts' && path.basename(file) !== 'index.tsx');
  return files.map((file) => rel(root, file));
}

function runAudit(root, options = {}) {
  const now = options.now || new Date().toISOString();
  const versions = resolveVersions(root);
  const contracts = loadContracts(root);
  const contractIds = contracts.map((item) => item.id).filter(Boolean);
  const systemNames = new Set([...FALLBACK_COMPONENTS, ...contractIds]);

  const restrictedImports = [];
  const deprecatedApi = [];
  const tokenViolations = [];
  const contractViolations = [];
  const unsupported = [];
  const systemComponents = {};
  for (const name of systemNames) systemComponents[name] = 0;

  const files = scanTargets(root);
  for (const filePath of files) {
    const fileRel = rel(root, filePath);
    const content = fs.readFileSync(filePath, 'utf8');

    restrictedImports.push(
      ...lineFindings(content, fileRel, (line) => /from\s+['"]@mantine\/core['"]/.test(line), {
        rule: 'restricted-import.mantine-core',
      })
    );

    deprecatedApi.push(
      ...lineFindings(content, fileRel, (line) => /<Button\b[^>]*\bcolor=/.test(line), {
        component: 'Button',
        rule: 'api.props.color.deprecated',
      }),
      ...lineFindings(content, fileRel, (line) => /variant=["']disabled["']/.test(line), {
        component: 'Button',
        rule: 'api.props.variant.disabled-alias',
      }),
      ...lineFindings(content, fileRel, (line) => /<Alert\b[^>]*\btype=/.test(line), {
        component: 'Alert',
        rule: 'api.props.type.deprecated',
      })
    );

    tokenViolations.push(
      ...lineFindings(content, fileRel, (line) => /style=\{\{/.test(line), {
        rule: 'tokens.style-prop',
      })
    );
    if (styleBlockHas(content, /#[0-9A-Fa-f]{3,8}\b/)) {
      tokenViolations.push({ file: fileRel, rule: 'tokens.raw-hex' });
    }
    if (styleBlockHas(content, /\d+px\b/)) {
      tokenViolations.push({ file: fileRel, rule: 'tokens.raw-px' });
    }

    const imported = [
      ...parseNamedImports(content, '@\\/components\\/DesignSystem'),
      ...parseNamedImports(content, '@appdirect\\/ds-prototype-kit'),
    ];
    for (const name of imported) {
      if (!systemNames.has(name)) continue;
      systemComponents[name] += countJsx(content, name);
    }

    if (isPrototypePage(fileRel) && !isPrototypeIndex(fileRel)) {
      if (!imported.includes('PageContentHeader') && !/<PageContentHeader[\s>/]/.test(content)) {
        unsupported.push({
          id: 'missing-page-content-header',
          file: fileRel,
          insteadOf: 'PageContentHeader',
        });
      }
      const hasTable = imported.includes('DataTable') || imported.includes('Table') || /<(DataTable|Table)[\s>/]/.test(content);
      const handmade = /\.map\s*\(/.test(content) && /<(Card|Inline)[\s>/]/.test(content);
      if (handmade && !hasTable) {
        unsupported.push({
          id: 'handmade-record-list',
          file: fileRel,
          insteadOf: 'DataTable or Table',
        });
      }
    }
  }

  const moduleCss = [];
  function walkCss(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!shouldSkipDir(entry.name)) walkCss(full);
      } else if (entry.name.endsWith('.module.css') && !full.includes(`${path.sep}DesignSystem${path.sep}`)) {
        moduleCss.push(rel(root, full));
      }
    }
  }
  walkCss(path.join(root, 'app'));
  walkCss(path.join(root, 'components', 'local'));
  for (const cssPath of moduleCss) {
    tokenViolations.push({ file: cssPath, rule: 'tokens.consumer-css-module' });
  }

  const customPaths = localComponentFiles(root);
  const exceptions = Array.isArray(versions.manifest.exceptions) ? versions.manifest.exceptions : [];

  if (versions.manifest.versions && versions.kit && versions.manifest.versions.kit && versions.manifest.versions.kit !== versions.kit) {
    contractViolations.push({
      component: 'versions',
      rule: 'versions.kit-mismatch',
      file: 'prototype-manifest.json',
      expected: versions.kit,
      actual: versions.manifest.versions.kit,
    });
  }

  for (const item of deprecatedApi) {
    contractViolations.push({
      component: item.component,
      rule: item.rule,
      file: item.file,
      line: item.line,
    });
  }

  const auditFail = restrictedImports.length > 0;
  const report = {
    schemaVersion: 1,
    generatedAt: now,
    repo: (versions.pkg && versions.pkg.name) || path.basename(root),
    versions: {
      template: versions.template,
      kit: versions.kit,
      tokensSnapshot: versions.tokensSnapshot,
      factory: versions.factory,
      mantine: versions.mantine,
      latestKitKnown: versions.latestKitKnown,
    },
    health: {
      typecheck: 'skipped',
      lint: 'skipped',
      build: 'skipped',
      audit: auditFail ? 'fail' : 'pass',
    },
    adoption: {
      systemComponents,
      customComponents: { count: customPaths.length, paths: customPaths },
    },
    compliance: {
      restrictedImports: restrictedImports.length,
      deprecatedApi: deprecatedApi.length,
      tokenViolations: tokenViolations.length,
      contractViolations,
      a11y: { violations: 0, tool: 'not-run' },
    },
    patterns: { unsupported },
    exceptions,
    findings: {
      restrictedImports,
      deprecatedApi,
      tokenViolations,
    },
  };

  const outPath =
    options.out === false
      ? null
      : typeof options.out === 'string'
        ? options.out
        : path.join(root, 'prototype-audit.json');
  if (outPath) writeJson(outPath, report);

  return { report, exitCode: auditFail ? 1 : 0, outPath };
}

function main(argv = process.argv, env = process.env) {
  const args = parseArgs(argv);
  if (args.help) {
    console.log('Usage: ds-audit [--root <dir>] [--out <file>] [--ci]');
    return { exitCode: 0 };
  }
  const root = typeof args.root === 'string' ? path.resolve(args.root) : process.cwd();
  const result = runAudit(root, { out: typeof args.out === 'string' ? path.resolve(args.out) : undefined });
  const { report } = result;
  console.log(`ds-audit ${report.health.audit}`);
  console.log(`  kit:                ${report.versions.kit || '(empty)'}`);
  console.log(`  restrictedImports:  ${report.compliance.restrictedImports}`);
  console.log(`  deprecatedApi:      ${report.compliance.deprecatedApi}`);
  console.log(`  tokenViolations:    ${report.compliance.tokenViolations}`);
  console.log(`  unsupported:        ${report.patterns.unsupported.length}`);
  console.log(`  customComponents:   ${report.adoption.customComponents.count}`);
  if (result.outPath) console.log(`  wrote:              ${result.outPath}`);
  if (shouldAnnotate(args, env)) {
    for (const line of formatAnnotations(report)) console.log(line);
  }
  return result;
}

if (require.main === module) {
  const result = main();
  process.exit(result.exitCode);
}

module.exports = { runAudit, main, parseArgs, formatAnnotations, shouldAnnotate };
