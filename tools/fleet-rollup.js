#!/usr/bin/env node

/**
 * Fleet rollup — maintainer table from prototype-audit.json files.
 *
 * No analytics platform. No prompts. Paths and counts only.
 *
 * Usage:
 *   npm run fleet-rollup
 *   node tools/fleet-rollup.js
 *   node tools/fleet-rollup.js --fleet fleet.json --out /tmp/fleet.md
 *   node tools/fleet-rollup.js --discover
 *   node tools/fleet-rollup.js --audits-dir ./fixtures
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_TEMPLATE = 'ad-dc/appdirect-prototype-template';
const GAP_THRESHOLD = 3;

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) continue;
    const key = argv[i].replace(/^--/, '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    if (key === 'help' || key === 'discover') {
      args[key] = true;
      continue;
    }
    args[key] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
  }
  return args;
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function parseRepo(entry) {
  if (!entry) return '';
  const value = String(entry).trim();
  const url = value.match(/github\.com[:/]([^/]+\/[^/]+?)(?:\.git)?$/i);
  if (url) return url[1].replace(/\.git$/, '');
  if (/^[^/]+\/[^/]+$/.test(value)) return value;
  return '';
}

function parseSemver(value) {
  if (!value) return null;
  const matched = String(value).match(/(\d+)\.(\d+)\.(\d+)/);
  if (!matched) return null;
  return {
    major: Number(matched[1]),
    minor: Number(matched[2]),
    patch: Number(matched[3]),
    raw: `${matched[1]}.${matched[2]}.${matched[3]}`,
  };
}

function cmpSemver(a, b) {
  if (!a && !b) return 0;
  if (!a) return -1;
  if (!b) return 1;
  return a.major - b.major || a.minor - b.minor || a.patch - b.patch;
}

function lagLabel(kit, latest) {
  if (!kit) return 'unknown';
  if (!latest) return 'unknown';
  const delta = cmpSemver(kit, latest);
  if (delta < 0) return 'behind';
  if (delta > 0) return 'ahead';
  return 'current';
}

function medianSemver(versions) {
  const sorted = versions.filter(Boolean).sort(cmpSemver);
  if (!sorted.length) return '';
  return sorted[Math.floor((sorted.length - 1) / 2)].raw;
}

function normalizeLocalName(filePath) {
  if (!filePath) return '';
  const parts = String(filePath).replace(/\\/g, '/').split('/').filter(Boolean);
  let base = parts[parts.length - 1] || '';
  base = base.replace(/\.(tsx|ts|jsx|js)$/i, '');
  if (/^index$/i.test(base) && parts.length >= 2) {
    base = parts[parts.length - 2];
  }
  return base.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

function loadFleet(filePath) {
  const json = readJson(filePath) || {};
  const repos = Array.isArray(json.repos) ? json.repos.map(parseRepo).filter(Boolean) : [];
  return {
    template: json.template || DEFAULT_TEMPLATE,
    repos: [...new Set(repos)],
  };
}

function latestKitFromRepo(root) {
  const kitPkg = readJson(path.join(root, 'ds-package', 'package.json'));
  return (kitPkg && kitPkg.version) || '';
}

function collectRules(audit) {
  const rules = [];
  if (!audit) return rules;
  for (const item of (audit.findings && audit.findings.restrictedImports) || []) {
    rules.push(item.rule || 'restricted-import');
  }
  for (const item of (audit.findings && audit.findings.deprecatedApi) || []) {
    rules.push(item.rule || 'deprecated-api');
  }
  for (const item of (audit.findings && audit.findings.tokenViolations) || []) {
    rules.push(item.rule || 'token-violation');
  }
  for (const item of (audit.compliance && audit.compliance.contractViolations) || []) {
    rules.push(item.rule || 'contract-violation');
  }
  for (const item of (audit.patterns && audit.patterns.unsupported) || []) {
    rules.push(item.id || 'unsupported');
  }
  return rules;
}

function rollup(rows, options = {}) {
  const latestKit = parseSemver(options.latestKit || '');
  const gapThreshold = options.gapThreshold || GAP_THRESHOLD;
  const generatedAt = options.generatedAt || new Date().toISOString();

  const ruleStats = new Map();
  const clusters = new Map();
  let customFiles = 0;
  let declaredExceptions = 0;

  const repos = rows.map((row) => {
    const audit = row.audit;
    const kit = parseSemver(audit && audit.versions && audit.versions.kit);
    const status = row.error || (audit ? (audit.health && audit.health.audit) || 'unknown' : 'missing');
    const restricted =
      audit && audit.compliance && typeof audit.compliance.restrictedImports === 'number'
        ? audit.compliance.restrictedImports
        : (audit && audit.findings && audit.findings.restrictedImports
            ? audit.findings.restrictedImports.length
            : 0);
    const custom = (audit && audit.adoption && audit.adoption.customComponents) || { count: 0, paths: [] };
    const exceptions = (audit && Array.isArray(audit.exceptions) && audit.exceptions) || [];
    customFiles += custom.count || 0;
    declaredExceptions += exceptions.length;

    if (audit) {
      for (const rule of collectRules(audit)) {
        const current = ruleStats.get(rule) || { rule, count: 0, repos: new Set() };
        current.count += 1;
        current.repos.add(row.repo);
        ruleStats.set(rule, current);
      }
      for (const filePath of custom.paths || []) {
        const name = normalizeLocalName(filePath);
        if (!name) continue;
        const key = `local:${name}`;
        const current = clusters.get(key) || { key, name, kind: 'local-component', repos: new Set() };
        current.repos.add(row.repo);
        clusters.set(key, current);
      }
      for (const item of (audit.patterns && audit.patterns.unsupported) || []) {
        const id = item.id || 'unsupported';
        const key = `unsupported:${id}`;
        const current = clusters.get(key) || { key, name: id, kind: 'unsupported', repos: new Set() };
        current.repos.add(row.repo);
        clusters.set(key, current);
      }
    }

    return {
      repo: row.repo,
      kit: (kit && kit.raw) || '',
      lag: lagLabel(kit, latestKit),
      audit: status,
      restrictedImports: restricted,
      customCount: custom.count || 0,
      exceptions: exceptions.length,
    };
  });

  const kitVersions = repos.map((item) => parseSemver(item.kit)).filter(Boolean);
  const topRules = [...ruleStats.values()]
    .map((item) => ({ rule: item.rule, count: item.count, repos: item.repos.size }))
    .sort((a, b) => b.count - a.count || b.repos - a.repos || a.rule.localeCompare(b.rule));

  const clusterRows = [...clusters.values()]
    .map((item) => ({
      name: item.name,
      kind: item.kind,
      repos: item.repos.size,
      gapCandidate: item.repos.size >= gapThreshold,
    }))
    .sort((a, b) => b.repos - a.repos || a.name.localeCompare(b.name));

  return {
    generatedAt,
    latestKit: (latestKit && latestKit.raw) || '',
    gapThreshold,
    repoCount: repos.length,
    auditedCount: repos.filter((item) => item.audit !== 'missing' && item.audit !== 'fetch-failed').length,
    missingCount: repos.filter((item) => item.audit === 'missing').length,
    fetchFailedCount: repos.filter((item) => item.audit === 'fetch-failed').length,
    behindCount: repos.filter((item) => item.lag === 'behind').length,
    medianKit: medianSemver(kitVersions),
    customFiles,
    declaredExceptions,
    exceptionRatio: customFiles ? declaredExceptions / customFiles : null,
    repos,
    topRules,
    clusters: clusterRows,
  };
}

function formatMarkdown(report) {
  const lines = [];
  lines.push('# Fleet rollup');
  lines.push('');
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push(`Latest kit: ${report.latestKit || '(unknown)'}`);
  lines.push(
    `Repos: ${report.repoCount} listed, ${report.auditedCount} audited, ${report.missingCount} missing audit, ${report.fetchFailedCount} fetch failed`
  );
  lines.push('');
  lines.push('## How current is the fleet?');
  lines.push('');
  if (!report.repos.length) {
    lines.push('No repos listed. Add clone slugs to `fleet.json` or pass `--discover`.');
    lines.push('');
  } else {
    lines.push(`Median kit: ${report.medianKit || '(unknown)'}`);
    lines.push(
      `Behind latest (${report.latestKit || 'unknown'}): ${report.behindCount} / ${report.repos.length}`
    );
    lines.push('');
    lines.push('| Repo | Kit | Lag | Audit | Restricted | Custom | Exceptions |');
    lines.push('| --- | --- | --- | --- | ---: | ---: | ---: |');
    for (const row of report.repos) {
      lines.push(
        `| ${row.repo} | ${row.kit || '—'} | ${row.lag} | ${row.audit} | ${row.restrictedImports} | ${row.customCount} | ${row.exceptions} |`
      );
    }
    lines.push('');
  }

  lines.push('## Which primitive throws the most exceptions?');
  lines.push('');
  if (!report.topRules.length) {
    lines.push('No violation rules recorded.');
    lines.push('');
  } else {
    lines.push('| Rule | Repos | Count |');
    lines.push('| --- | ---: | ---: |');
    for (const row of report.topRules.slice(0, 10)) {
      lines.push(`| ${row.rule} | ${row.repos} | ${row.count} |`);
    }
    lines.push('');
  }

  const ratio =
    report.exceptionRatio === null ? 'n/a (no custom files)' : report.exceptionRatio.toFixed(2);
  lines.push(
    `Declared exceptions / custom files: ${report.declaredExceptions} / ${report.customFiles} (ratio ${ratio}). Low ratio means undeclared local components.`
  );
  lines.push('');

  lines.push(`## Local-pattern clusters (gap candidate: n ≥ ${report.gapThreshold} repos)`);
  lines.push('');
  const gaps = report.clusters.filter((item) => item.gapCandidate);
  const rest = report.clusters.filter((item) => !item.gapCandidate);
  if (!report.clusters.length) {
    lines.push('No local-component or unsupported-pattern clusters.');
    lines.push('');
  } else {
    if (gaps.length) {
      lines.push('Gap candidates:');
      lines.push('');
      lines.push('| Pattern | Kind | Repos |');
      lines.push('| --- | --- | ---: |');
      for (const row of gaps) {
        lines.push(`| ${row.name} | ${row.kind} | ${row.repos} |`);
      }
      lines.push('');
    } else {
      lines.push('No clusters meet the gap threshold.');
      lines.push('');
    }
    if (rest.length) {
      lines.push('Below threshold:');
      lines.push('');
      lines.push('| Pattern | Kind | Repos |');
      lines.push('| --- | --- | ---: |');
      for (const row of rest) {
        lines.push(`| ${row.name} | ${row.kind} | ${row.repos} |`);
      }
      lines.push('');
    }
  }

  lines.push('Do not treat a cluster as an approved DS change. Add a DESIGN.md pending-work note after human review.');
  lines.push('');
  return lines.join('\n');
}

function loadAuditsDir(dir) {
  if (!fs.existsSync(dir)) return [];
  const rows = [];
  for (const name of fs.readdirSync(dir).sort()) {
    if (!name.endsWith('.json')) continue;
    const json = readJson(path.join(dir, name));
    if (!json) continue;
    const repo = parseRepo(json.repo) || name.replace(/\.json$/, '').replace(/__/g, '/');
    rows.push({ repo, audit: json.audit || json });
  }
  return rows;
}

function fetchAuditWithGh(repo) {
  try {
    const raw = execFileSync(
      'gh',
      ['api', `repos/${repo}/contents/prototype-audit.json`, '-H', 'Accept: application/vnd.github.raw'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
    );
    return { repo, audit: JSON.parse(raw) };
  } catch (error) {
    const detail = String((error && error.stderr) || error.message || '');
    const missing = /404|Not Found/i.test(detail);
    return { repo, audit: null, error: missing ? 'missing' : 'fetch-failed' };
  }
}

function discoverWithGh(template) {
  const owner = String(template || DEFAULT_TEMPLATE).split('/')[0];
  const query =
    'query ($login: String!, $cursor: String) { organization(login: $login) { repositories(first: 50, after: $cursor) { pageInfo { hasNextPage endCursor } nodes { nameWithOwner isArchived templateRepository { nameWithOwner } } } } }';
  const repos = [];
  let cursor = null;
  do {
    const args = ['api', 'graphql', '-f', `query=${query}`, '-f', `login=${owner}`];
    if (cursor) args.push('-f', `cursor=${cursor}`);
    const payload = JSON.parse(execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
    const connection =
      payload && payload.data && payload.data.organization && payload.data.organization.repositories;
    if (!connection) break;
    for (const node of connection.nodes || []) {
      if (!node || node.isArchived) continue;
      const from = node.templateRepository && node.templateRepository.nameWithOwner;
      if (from === template) repos.push(node.nameWithOwner);
    }
    cursor = connection.pageInfo && connection.pageInfo.hasNextPage ? connection.pageInfo.endCursor : null;
  } while (cursor);
  return repos;
}

function collectRows(repos, options = {}) {
  if (options.auditsDir) return loadAuditsDir(options.auditsDir);
  const fetchAudit = options.fetchAudit || fetchAuditWithGh;
  return repos.map((repo) => fetchAudit(repo));
}

function main(argv = process.argv, options = {}) {
  const args = parseArgs(argv);
  if (args.help) {
    console.log(
      'Usage: fleet-rollup [--fleet <file>] [--out <file>] [--discover] [--audits-dir <dir>] [--latest-kit <semver>]'
    );
    return { exitCode: 0 };
  }

  const root = options.root || ROOT;
  const fleetPath = typeof args.fleet === 'string' ? path.resolve(args.fleet) : path.join(root, 'fleet.json');
  const fleet = loadFleet(fleetPath);
  let repos = fleet.repos.slice();

  if (args.discover) {
    const discover = options.discover || discoverWithGh;
    try {
      repos = [...new Set([...repos, ...discover(fleet.template)])];
    } catch (error) {
      console.error(`Discover failed (${error.message || error}). Using fleet.json only.`);
    }
  }

  const latestKit =
    (typeof args.latestKit === 'string' && args.latestKit) || options.latestKit || latestKitFromRepo(root);
  const auditsDir = typeof args.auditsDir === 'string' ? path.resolve(args.auditsDir) : options.auditsDir;
  const rows = collectRows(repos, {
    auditsDir,
    fetchAudit: options.fetchAudit,
  });
  const listed = auditsDir
    ? rows
    : repos.map((repo) => rows.find((row) => row.repo === repo) || { repo, audit: null, error: 'missing' });

  const report = rollup(listed, {
    latestKit,
    generatedAt: options.generatedAt || new Date().toISOString(),
    gapThreshold: options.gapThreshold,
  });
  const markdown = formatMarkdown(report);

  if (typeof args.out === 'string') {
    const outPath = path.resolve(args.out);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, markdown.endsWith('\n') ? markdown : `${markdown}\n`, 'utf8');
    console.log(`wrote ${outPath}`);
  } else {
    process.stdout.write(markdown.endsWith('\n') ? markdown : `${markdown}\n`);
  }

  return { exitCode: 0, report, markdown, repos: listed };
}

if (require.main === module) {
  try {
    const result = main();
    process.exit(result.exitCode);
  } catch (error) {
    console.error(`Error: ${error.message || error}`);
    process.exit(1);
  }
}

module.exports = {
  parseArgs,
  parseRepo,
  parseSemver,
  cmpSemver,
  lagLabel,
  medianSemver,
  normalizeLocalName,
  loadFleet,
  collectRules,
  rollup,
  formatMarkdown,
  loadAuditsDir,
  main,
  GAP_THRESHOLD,
  DEFAULT_TEMPLATE,
};
