/**
 * Tests for tools/publish-prototype-template.js
 *
 * Run with: node --test tools/publish-prototype-template.test.mjs
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { main, materialize, TEMPLATE_REPO } = require('./publish-prototype-template.js');

const KIT_URL =
  'https://github.com/ad-dc/appdirect-design-system/releases/download/v0.2.0/appdirect-ds-prototype-kit-0.2.0.tgz';

test('TEMPLATE_REPO is the shared GitHub template', () => {
  assert.equal(TEMPLATE_REPO, 'ad-dc/appdirect-prototype-template');
});

test('materialize bakes kit URL and strips placeholders', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'publish-proto-'));
  try {
    materialize(dir, KIT_URL);
    const pkg = JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf8'));
    assert.equal(pkg.name, 'appdirect-prototype');
    assert.equal(pkg.dependencies['@appdirect/ds-prototype-kit'], KIT_URL);
    assert.equal(pkg.dependencies['@appdirect/design-tokens'], undefined);
    assert.equal(existsSync(path.join(dir, '.npmrc')), false);
    const readme = readFileSync(path.join(dir, 'README.md'), 'utf8');
    assert.match(readme, /AppDirect Prototype/);
    assert.doesNotMatch(readme, /__PROTOTYPE_NAME__/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('main --dry-run does not require writing a GitHub repo', () => {
  const result = main([
    'node',
    'publish-prototype-template.js',
    '--dry-run',
    '--kit-url',
    KIT_URL,
  ]);
  assert.equal(result.dryRun, true);
  assert.equal(result.kitTarballUrl, KIT_URL);
});
