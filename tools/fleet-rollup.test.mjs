/**
 * Tests for tools/fleet-rollup.js
 *
 * Run with: node --test tools/fleet-rollup.test.mjs
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const {
  parseRepo,
  normalizeLocalName,
  lagLabel,
  parseSemver,
  rollup,
  formatMarkdown,
  main,
  loadFleet,
} = require('./fleet-rollup.js');

function audit({ repo, kit, health = 'pass', restricted = 0, custom = [], unsupported = [], exceptions = [], rules = [] }) {
  return {
    schemaVersion: 1,
    repo,
    versions: { kit, latestKitKnown: '0.2.6' },
    health: { typecheck: 'skipped', lint: 'skipped', build: 'skipped', audit: health },
    adoption: {
      systemComponents: { Button: 1 },
      customComponents: { count: custom.length, paths: custom },
    },
    compliance: {
      restrictedImports: restricted,
      deprecatedApi: rules.filter((rule) => rule.startsWith('api.')).length,
      tokenViolations: 0,
      contractViolations: rules
        .filter((rule) => rule.startsWith('api.') || rule.startsWith('contract.'))
        .map((rule) => ({ component: 'Button', rule })),
      a11y: { violations: 0, tool: 'not-run' },
    },
    patterns: {
      unsupported: unsupported.map((id) => ({ id, file: 'app/prototype/x/page.tsx', insteadOf: 'DataTable' })),
    },
    exceptions,
    findings: {
      restrictedImports: Array.from({ length: restricted }, (_, i) => ({
        file: `app/prototype/p${i}/page.tsx`,
        rule: 'restricted-import.mantine-core',
      })),
      deprecatedApi: rules
        .filter((rule) => rule.startsWith('api.'))
        .map((rule) => ({ file: 'app/prototype/x/page.tsx', rule })),
      tokenViolations: [],
    },
  };
}

test('parseRepo and normalizeLocalName', () => {
  assert.equal(parseRepo('ad-dc/proto-alex'), 'ad-dc/proto-alex');
  assert.equal(parseRepo('https://github.com/ad-dc/proto-alex.git'), 'ad-dc/proto-alex');
  assert.equal(normalizeLocalName('components/local/PricingMatrix.tsx'), 'pricingmatrix');
  assert.equal(normalizeLocalName('components/local/pricing-matrix/index.ts'), 'pricingmatrix');
});

test('empty fleet still answers the two maintainer questions', () => {
  const report = rollup([], { latestKit: '0.2.6', generatedAt: '2026-09-18T00:00:00Z' });
  const md = formatMarkdown(report);
  assert.match(md, /How current is the fleet\?/);
  assert.match(md, /Which primitive throws the most exceptions\?/);
  assert.match(md, /No repos listed/);
});

test('kit lag, top rule, and n≥3 local cluster is a gap candidate', () => {
  const rows = [
    {
      repo: 'ad-dc/proto-a',
      audit: audit({
        repo: 'ad-dc/proto-a',
        kit: '0.2.6',
        custom: ['components/local/PricingMatrix.tsx'],
        restricted: 0,
      }),
    },
    {
      repo: 'ad-dc/proto-b',
      audit: audit({
        repo: 'ad-dc/proto-b',
        kit: '0.2.0',
        health: 'fail',
        restricted: 2,
        custom: ['components/local/pricing-matrix.tsx'],
        unsupported: ['handmade-record-list'],
      }),
    },
    {
      repo: 'ad-dc/proto-c',
      audit: audit({
        repo: 'ad-dc/proto-c',
        kit: '0.2.0',
        restricted: 1,
        custom: ['components/local/pricing_matrix/index.tsx'],
      }),
    },
    { repo: 'ad-dc/proto-d', audit: null, error: 'missing' },
  ];

  const report = rollup(rows, { latestKit: '0.2.6', generatedAt: '2026-09-18T00:00:00Z' });
  assert.equal(report.medianKit, '0.2.0');
  assert.equal(report.behindCount, 2);
  assert.equal(report.missingCount, 1);
  assert.equal(report.topRules[0].rule, 'restricted-import.mantine-core');
  assert.equal(report.topRules[0].count, 3);
  const gap = report.clusters.find((item) => item.name === 'pricingmatrix');
  assert.equal(gap.kind, 'local-component');
  assert.equal(gap.repos, 3);
  assert.equal(gap.gapCandidate, true);
  const handmade = report.clusters.find((item) => item.name === 'handmade-record-list');
  assert.equal(handmade.gapCandidate, false);

  const md = formatMarkdown(report);
  assert.match(md, /Behind latest \(0\.2\.6\): 2 \/ 4/);
  assert.match(md, /restricted-import\.mantine-core/);
  assert.match(md, /Gap candidates/);
  assert.match(md, /pricingmatrix/);
});

test('two-repo cluster is below the gap threshold', () => {
  const rows = ['ad-dc/p1', 'ad-dc/p2'].map((repo) => ({
    repo,
    audit: audit({ repo, kit: '0.2.6', custom: ['components/local/UsageChart.tsx'] }),
  }));
  const report = rollup(rows, { latestKit: '0.2.6' });
  const cluster = report.clusters.find((item) => item.name === 'usagechart');
  assert.equal(cluster.repos, 2);
  assert.equal(cluster.gapCandidate, false);
  assert.doesNotMatch(formatMarkdown(report), /Gap candidates/);
});

test('main reads fleet.json and a local audits dir without network', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'fleet-rollup-'));
  try {
    writeFileSync(
      path.join(dir, 'fleet.json'),
      JSON.stringify({ template: 'ad-dc/appdirect-prototype-template', repos: ['ad-dc/proto-a'] }) + '\n'
    );
    mkdirSync(path.join(dir, 'audits'));
    writeFileSync(
      path.join(dir, 'audits', 'ad-dc__proto-a.json'),
      JSON.stringify(
        audit({
          repo: 'ad-dc/proto-a',
          kit: '0.2.6',
          custom: ['components/local/UsageChart.tsx'],
          exceptions: [{ id: 'local-usage-chart', kind: 'legitimate_local', path: 'components/local/UsageChart.tsx' }],
        })
      ) + '\n'
    );
    const out = path.join(dir, 'out.md');
    const result = main(
      ['node', 'fleet-rollup.js', '--fleet', path.join(dir, 'fleet.json'), '--audits-dir', path.join(dir, 'audits'), '--out', out, '--latest-kit', '0.2.6'],
      { root: ROOT, generatedAt: '2026-09-18T00:00:00Z' }
    );
    assert.equal(result.exitCode, 0);
    assert.equal(result.report.repos[0].exceptions, 1);
    const written = readFileSync(out, 'utf8');
    assert.match(written, /ad-dc\/proto-a/);
    assert.match(written, /How current is the fleet\?/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('loadFleet reads committed empty list', () => {
  const fleet = loadFleet(path.join(ROOT, 'fleet.json'));
  assert.equal(fleet.template, 'ad-dc/appdirect-prototype-template');
  assert.deepEqual(fleet.repos, []);
});

test('lagLabel current vs behind', () => {
  assert.equal(lagLabel(parseSemver('0.2.6'), parseSemver('0.2.6')), 'current');
  assert.equal(lagLabel(parseSemver('0.2.0'), parseSemver('0.2.6')), 'behind');
});
