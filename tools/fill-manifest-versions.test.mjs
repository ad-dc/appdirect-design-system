/**
 * Tests for tools/fill-manifest-versions.js
 *
 * Run with: node --test tools/fill-manifest-versions.test.mjs
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { semverFromSpec, fillManifestVersions } = require('./fill-manifest-versions.js');

function makeRoot(files) {
  const dir = mkdtempSync(path.join(tmpdir(), 'fill-manifest-'));
  for (const [relative, contents] of Object.entries(files)) {
    const full = path.join(dir, relative);
    mkdirSync(path.dirname(full), { recursive: true });
    writeFileSync(full, typeof contents === 'string' ? contents : JSON.stringify(contents, null, 2) + '\n');
  }
  return dir;
}

test('semverFromSpec reads tarball URLs, tags, and caret ranges', () => {
  assert.equal(
    semverFromSpec(
      'https://github.com/ad-dc/appdirect-design-system/releases/download/v0.2.6/appdirect-ds-prototype-kit-0.2.6.tgz'
    ),
    '0.2.6'
  );
  assert.equal(semverFromSpec('^0.0.6'), '0.0.6');
  assert.equal(semverFromSpec('^9.0.1'), '9.0.1');
  assert.equal(semverFromSpec('__KIT_TARBALL_URL__'), '');
  assert.equal(semverFromSpec('https://example.com/kit.tgz'), '');
});

test('fills versions from kit tarball pin and Mantine range; factory equals kit', () => {
  const dir = makeRoot({
    'package.json': {
      dependencies: {
        '@appdirect/ds-prototype-kit':
          'https://github.com/ad-dc/appdirect-design-system/releases/download/v0.2.6/appdirect-ds-prototype-kit-0.2.6.tgz',
        '@mantine/core': '^9.0.1',
      },
    },
    'prototype-manifest.json': {
      prototypeName: 'Fleet Demo',
      pages: [{ slug: 'home', title: 'Home' }],
      navGroups: { main: { title: 'main', items: [] } },
      exceptions: [{ id: 'local-chart', path: 'components/local/Chart.tsx' }],
    },
  });

  try {
    const result = fillManifestVersions(dir, { tokensSnapshot: '0.0.6' });
    assert.deepEqual(result.versions, {
      kit: '0.2.6',
      tokensSnapshot: '0.0.6',
      factory: '0.2.6',
      mantine: '9.0.1',
    });
    assert.equal(result.prototypeName, 'Fleet Demo');
    assert.deepEqual(result.pages, [{ slug: 'home', title: 'Home' }]);
    assert.equal(result.exceptions[0].id, 'local-chart');

    const written = JSON.parse(readFileSync(path.join(dir, 'prototype-manifest.json'), 'utf8'));
    assert.deepEqual(written.versions, result.versions);
    assert.deepEqual(written.pages, result.pages);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('main-repo layout: kit from ds-package, tokens from design-tokens dep', () => {
  const dir = makeRoot({
    'package.json': {
      dependencies: {
        '@appdirect/design-tokens': '^0.0.6',
        '@mantine/core': '^9.0.1',
      },
    },
    'ds-package/package.json': {
      name: '@appdirect/ds-prototype-kit',
      version: '0.2.6',
      tokensSnapshot: '0.0.6',
    },
    'prototype-manifest.json': {
      prototypeName: 'AppDirect Prototype',
      pages: [],
      navGroups: {},
    },
  });

  try {
    const result = fillManifestVersions(dir);
    assert.deepEqual(result.versions, {
      kit: '0.2.6',
      tokensSnapshot: '0.0.6',
      factory: '0.2.6',
      mantine: '9.0.1',
    });
    assert.equal(result.template, undefined);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('keeps previous pins when package.json has no resolvable kit', () => {
  const dir = makeRoot({
    'package.json': {
      dependencies: {
        '@appdirect/ds-prototype-kit': '__KIT_TARBALL_URL__',
        '@mantine/core': '^9.0.1',
      },
    },
    'template.meta.json': {
      templateVersion: '2026.09.17',
      tokensSnapshot: '0.0.6',
    },
    'prototype-manifest.json': {
      prototypeName: '__PROTOTYPE_NAME__',
      versions: { kit: '', tokensSnapshot: '0.0.5', factory: '', mantine: '' },
      pages: [],
      navGroups: {},
    },
  });

  try {
    const result = fillManifestVersions(dir);
    assert.equal(result.versions.kit, '');
    assert.equal(result.versions.factory, '');
    assert.equal(result.versions.tokensSnapshot, '0.0.6');
    assert.equal(result.versions.mantine, '9.0.1');
    assert.deepEqual(result.template, {
      id: 'ad-dc/appdirect-prototype-template',
      version: '2026.09.17',
    });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('reads tokensSnapshot from an installed kit package.json', () => {
  const dir = makeRoot({
    'package.json': {
      dependencies: {
        '@appdirect/ds-prototype-kit':
          'https://github.com/ad-dc/appdirect-design-system/releases/download/v0.2.7/appdirect-ds-prototype-kit-0.2.7.tgz',
        '@mantine/core': '^9.0.1',
      },
    },
    'node_modules/@appdirect/ds-prototype-kit/package.json': {
      name: '@appdirect/ds-prototype-kit',
      version: '0.2.7',
      tokensSnapshot: '0.0.7',
    },
    'prototype-manifest.json': { prototypeName: 'Clone', pages: [], navGroups: {} },
  });

  try {
    const result = fillManifestVersions(dir);
    assert.equal(result.versions.kit, '0.2.7');
    assert.equal(result.versions.tokensSnapshot, '0.0.7');
    assert.equal(result.versions.factory, '0.2.7');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
