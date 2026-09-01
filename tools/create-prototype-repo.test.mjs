/**
 * Tests for tools/create-prototype-repo.js
 *
 * Run with: node --test tools/create-prototype-repo.test.mjs
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  parseArgs,
  slugifyName,
  titleFromName,
  main,
} = require('./create-prototype-repo.js');

const KIT_URL =
  'https://github.com/ad-dc/appdirect-design-system/releases/download/v0.2.0/appdirect-ds-prototype-kit-0.2.0.tgz';

test('slugifyName and titleFromName', () => {
  assert.equal(slugifyName('Proto Alex'), 'proto-alex');
  assert.equal(titleFromName('proto-alex'), 'Proto Alex');
});

test('parseArgs collects collaborators and flags', () => {
  const args = parseArgs([
    'node',
    'create-prototype-repo.js',
    '--name',
    'proto-alex',
    '--github',
    '--collaborator',
    'alex',
    '--collaborator',
    'sam',
    '--dry-run',
  ]);
  assert.equal(args.name, 'proto-alex');
  assert.equal(args.github, true);
  assert.equal(args.dryRun, true);
  assert.deepEqual(args.collaborator, ['alex', 'sam']);
});

test('main --dry-run does not write files', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'create-proto-dry-'));
  const out = path.join(dir, 'would-write');
  try {
    const result = main([
      'node',
      'create-prototype-repo.js',
      '--name',
      'proto-dry',
      '--out',
      out,
      '--kit-url',
      KIT_URL,
      '--dry-run',
    ]);
    assert.equal(result.name, 'proto-dry');
    assert.equal(result.kitTarballUrl, KIT_URL);
    assert.equal(existsSync(out), false);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('main copies template, pins kit, and strips placeholders', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'create-proto-'));
  const out = path.join(dir, 'proto-alex');
  try {
    main([
      'node',
      'create-prototype-repo.js',
      '--name',
      'proto-alex',
      '--title',
      'Alex Prototypes',
      '--out',
      out,
      '--kit-url',
      KIT_URL,
      '--no-git',
    ]);

    const pkg = JSON.parse(readFileSync(path.join(out, 'package.json'), 'utf8'));
    assert.equal(pkg.name, 'proto-alex');
    assert.equal(pkg.dependencies['@appdirect/ds-prototype-kit'], KIT_URL);
    assert.equal(pkg.dependencies['@appdirect/design-tokens'], '^0.0.6');

    const manifest = JSON.parse(readFileSync(path.join(out, 'prototype-manifest.json'), 'utf8'));
    assert.equal(manifest.prototypeName, 'Alex Prototypes');
    assert.deepEqual(manifest.pages, []);

    const nextConfig = readFileSync(path.join(out, 'next.config.ts'), 'utf8');
    assert.match(nextConfig, /transpilePackages: \['@appdirect\/ds-prototype-kit'\]/);

    const indexPage = readFileSync(path.join(out, 'app/prototype/page.tsx'), 'utf8');
    assert.match(indexPage, /from '@appdirect\/ds-prototype-kit'/);
    assert.doesNotMatch(indexPage, /@\/components\/DesignSystem/);

    const pageTemplate = readFileSync(
      path.join(out, 'tools/page-templates/app-shell-single-column.tsx.template'),
      'utf8'
    );
    assert.match(pageTemplate, /from '@appdirect\/ds-prototype-kit'/);

    const readme = readFileSync(path.join(out, 'README.md'), 'utf8');
    assert.match(readme, /Alex Prototypes/);
    assert.doesNotMatch(readme, /__PROTOTYPE_NAME__/);

    assert.equal(existsSync(path.join(out, 'template.meta.json')), false);
    assert.equal(existsSync(path.join(out, 'components/DesignSystem')), false);
    assert.equal(existsSync(path.join(out, 'components/cbp/index.ts')), true);
    assert.equal(existsSync(path.join(out, 'public/assets/AppDirect-Mark_White.svg')), true);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
