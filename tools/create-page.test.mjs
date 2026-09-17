/**
 * Tests for tools/create-page.js
 *
 * Run with: node --test tools/create-page.test.mjs
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { registerPage, main } = require('./create-page.js');

const VERSIONS = {
  kit: '0.2.6',
  tokensSnapshot: '0.0.6',
  factory: '0.2.6',
  mantine: '9.0.1',
};

const TEMPLATE_BLOCK = {
  id: 'ad-dc/appdirect-prototype-template',
  version: '2026.09.17',
};

test('registerPage appends pages/nav and leaves versions and template untouched', () => {
  const manifest = {
    prototypeName: 'Keep Pins',
    template: { ...TEMPLATE_BLOCK },
    versions: { ...VERSIONS },
    pages: [],
    navGroups: {},
    exceptions: [{ id: 'local-matrix' }],
  };

  registerPage(manifest, {
    slug: 'billing',
    title: 'Billing',
    template: 'app-shell',
    layout: 'single-column',
    navGroup: 'main',
    description: '',
    icon: 'ri-file-line',
  });

  assert.deepEqual(manifest.versions, VERSIONS);
  assert.deepEqual(manifest.template, TEMPLATE_BLOCK);
  assert.deepEqual(manifest.exceptions, [{ id: 'local-matrix' }]);
  assert.equal(manifest.pages[0].slug, 'billing');
  assert.equal(manifest.navGroups.main.items[0].slug, 'billing');
});

test('create-page writes the page file and does not rewrite versions', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'create-page-'));
  const manifestPath = path.join(dir, 'prototype-manifest.json');
  writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        prototypeName: 'Keep Pins',
        template: TEMPLATE_BLOCK,
        versions: VERSIONS,
        pages: [],
        navGroups: {},
      },
      null,
      2
    ) + '\n'
  );

  try {
    const result = main(['node', 'create-page.js', '--name', 'Version Pin Check'], { root: dir });
    assert.equal(result.slug, 'version-pin-check');
    assert.equal(existsSync(path.join(dir, 'app/prototype/version-pin-check/page.tsx')), true);

    const written = JSON.parse(readFileSync(manifestPath, 'utf8'));
    assert.deepEqual(written.versions, VERSIONS);
    assert.deepEqual(written.template, TEMPLATE_BLOCK);
    assert.equal(written.pages[0].slug, 'version-pin-check');
    assert.equal(written.pages[0].title, 'Version Pin Check');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
