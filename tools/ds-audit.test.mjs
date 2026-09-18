/**
 * Tests for ds-package/bin/ds-audit.js
 *
 * Run with: node --test tools/ds-audit.test.mjs
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { runAudit, main } = require('../ds-package/bin/ds-audit.js');

function makeProto(files) {
  const dir = mkdtempSync(path.join(tmpdir(), 'ds-audit-'));
  for (const [relative, contents] of Object.entries(files)) {
    const full = path.join(dir, relative);
    mkdirSync(path.dirname(full), { recursive: true });
    writeFileSync(full, typeof contents === 'string' ? contents : JSON.stringify(contents, null, 2) + '\n');
  }
  return dir;
}

test('restricted @mantine/core import fails the audit and is counted', () => {
  const dir = makeProto({
    'package.json': {
      name: 'proto-fail',
      dependencies: {
        '@appdirect/ds-prototype-kit':
          'https://github.com/ad-dc/appdirect-design-system/releases/download/v0.2.6/appdirect-ds-prototype-kit-0.2.6.tgz',
        '@mantine/core': '^9.6.0',
      },
    },
    'prototype-manifest.json': {
      prototypeName: 'Fail',
      versions: { kit: '0.2.6', tokensSnapshot: '0.0.6', factory: '0.2.6', mantine: '9.6.0' },
      pages: [{ slug: 'home', title: 'Home' }],
      navGroups: {},
    },
    'app/prototype/home/page.tsx': `
import { Button } from '@mantine/core';
export default function Home() {
  return <Button color="blue">Go</Button>;
}
`,
  });

  try {
    const result = runAudit(dir, { now: '2026-09-18T00:00:00Z' });
    assert.equal(result.exitCode, 1);
    assert.equal(result.report.health.audit, 'fail');
    assert.equal(result.report.compliance.restrictedImports, 1);
    assert.equal(result.report.findings.restrictedImports[0].file, 'app/prototype/home/page.tsx');
    assert.ok(result.report.compliance.deprecatedApi >= 1);
    assert.equal(existsSync(path.join(dir, 'prototype-audit.json')), true);
    const written = JSON.parse(readFileSync(path.join(dir, 'prototype-audit.json'), 'utf8'));
    assert.equal(written.schemaVersion, 1);
    assert.equal(written.versions.kit, '0.2.6');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('clean prototype page passes', () => {
  const dir = makeProto({
    'package.json': { name: 'proto-clean', dependencies: { '@mantine/core': '^9.6.0' } },
    'prototype-manifest.json': {
      prototypeName: 'Clean',
      versions: { kit: '', tokensSnapshot: '0.0.6', factory: '', mantine: '9.6.0' },
      pages: [],
      navGroups: {},
    },
    'app/prototype/home/page.tsx': `
import { Button, PageContentHeader, Stack } from '@appdirect/ds-prototype-kit';
export default function Home() {
  return (
    <Stack>
      <PageContentHeader title="Home" contentSection="description" description="Hi" />
      <Button variant="primary">Save</Button>
    </Stack>
  );
}
`,
    'components/local/PricingMatrix.tsx': `export function PricingMatrix() { return null; }`,
  });

  try {
    const result = runAudit(dir, { now: '2026-09-18T00:00:00Z' });
    assert.equal(result.exitCode, 0);
    assert.equal(result.report.health.audit, 'pass');
    assert.equal(result.report.compliance.restrictedImports, 0);
    assert.equal(result.report.adoption.systemComponents.Button, 1);
    assert.equal(result.report.adoption.systemComponents.PageContentHeader, 1);
    assert.equal(result.report.adoption.customComponents.count, 1);
    assert.deepEqual(result.report.adoption.customComponents.paths, ['components/local/PricingMatrix.tsx']);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('flags style={{ hex/px, missing header, and handmade record list', () => {
  const dir = makeProto({
    'package.json': { name: 'proto-warn' },
    'prototype-manifest.json': { prototypeName: 'Warn', pages: [], navGroups: {} },
    'app/prototype/customers/page.tsx': `
import { Card, Inline, Stack } from '@appdirect/ds-prototype-kit';
const rows = [{ id: 1, name: 'A' }];
export default function Customers() {
  return (
    <Stack>
      <Card style={{ color: '#ff0000', padding: '8px' }}>
        {rows.map((row) => (
          <Inline key={row.id}>{row.name}</Inline>
        ))}
      </Card>
    </Stack>
  );
}
`,
  });

  try {
    const result = runAudit(dir);
    assert.equal(result.exitCode, 0);
    assert.ok(result.report.compliance.tokenViolations >= 1);
    const ids = result.report.patterns.unsupported.map((item) => item.id).sort();
    assert.ok(ids.includes('missing-page-content-header'));
    assert.ok(ids.includes('handmade-record-list'));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('in-tree Revenue Ops customers page is a handmade-record-list finding, not a restricted import', () => {
  const result = runAudit(ROOT, { out: false });
  assert.equal(result.report.findings.restrictedImports.some((item) => item.file.startsWith('app/prototype/')), false);
  assert.ok(
    result.report.patterns.unsupported.some(
      (item) => item.id === 'handmade-record-list' && item.file === 'app/prototype/customers/page.tsx'
    )
  );
});

test('kit package.json exposes ds-audit and the CLI source exists', () => {
  const pkg = JSON.parse(readFileSync(path.join(ROOT, 'ds-package/package.json'), 'utf8'));
  assert.equal(pkg.bin['ds-audit'], './dist/bin/ds-audit.js');
  assert.equal(existsSync(path.join(ROOT, 'ds-package/bin/ds-audit.js')), true);
  const build = readFileSync(path.join(ROOT, 'ds-package/scripts/build.js'), 'utf8');
  assert.match(build, /function copyBin\(/);
  assert.match(build, /copyBin\(\)/);
});

test('CLI --help does not write a report', () => {
  const dir = makeProto({ 'package.json': { name: 'help' } });
  try {
    const result = main(['node', 'ds-audit.js', '--help']);
    assert.equal(result.exitCode, 0);
    assert.equal(existsSync(path.join(dir, 'prototype-audit.json')), false);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
