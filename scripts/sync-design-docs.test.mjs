/**
 * Tests for sync-design-docs.mjs.
 *
 * Uses Node's built-in test runner (node:test) — the existing Vitest setup
 * is Storybook browser-only, which is the wrong environment for a file
 * processing script. Run with: `node --test scripts/sync-design-docs.test.mjs`.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { syncDesignDocs, splitFrontMatter } from './sync-design-docs.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_PATH = path.join(here, '__fixtures__', 'design-spec.example.yaml');

const SAMPLE_BODY = `# AppDirect Admin — DESIGN.md

> Body prose carries semantics. The sync script never touches this content.

## Overview

Some descriptive prose.
`;

function makeTempDoc(initialFrontMatter) {
  const dir = mkdtempSync(path.join(tmpdir(), 'sync-design-docs-'));
  const docPath = path.join(dir, 'DESIGN.md');
  writeFileSync(docPath, `---\n${initialFrontMatter}\n---\n${SAMPLE_BODY}`, 'utf8');
  return { dir, docPath };
}

test('replaces front matter from adapter and preserves body byte-for-byte', async () => {
  const { dir, docPath } = makeTempDoc('version: stale\nfoo: bar');
  try {
    const result = await syncDesignDocs({
      adapterPath: FIXTURE_PATH,
      docPath,
      log: () => {},
      warn: () => {},
    });
    assert.equal(result.status, 'updated');

    const updated = readFileSync(docPath, 'utf8');
    const parts = splitFrontMatter(updated);
    assert.ok(parts, 'updated file should still have front matter');

    const fixture = readFileSync(FIXTURE_PATH, 'utf8').replace(/\r?\n+$/, '');
    assert.equal(parts.frontMatter, fixture);
    assert.equal(parts.body, SAMPLE_BODY);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('second run is a no-op (idempotent)', async () => {
  const { dir, docPath } = makeTempDoc('version: stale');
  try {
    await syncDesignDocs({ adapterPath: FIXTURE_PATH, docPath, log: () => {}, warn: () => {} });
    const result = await syncDesignDocs({
      adapterPath: FIXTURE_PATH,
      docPath,
      log: () => {},
      warn: () => {},
    });
    assert.equal(result.status, 'unchanged');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('skips gracefully when adapter file is missing', async () => {
  const { dir, docPath } = makeTempDoc('version: alpha');
  const docBefore = readFileSync(docPath, 'utf8');
  try {
    const result = await syncDesignDocs({
      adapterPath: path.join(dir, 'does-not-exist.yaml'),
      docPath,
      log: () => {},
      warn: () => {},
    });
    assert.equal(result.status, 'skipped');
    assert.equal(result.reason, 'adapter-missing');

    const docAfter = readFileSync(docPath, 'utf8');
    assert.equal(docAfter, docBefore, 'doc should be untouched when adapter missing');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('throws when DESIGN.md has no front matter', async () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'sync-design-docs-'));
  const docPath = path.join(dir, 'DESIGN.md');
  writeFileSync(docPath, '# Just a heading\n\nNo front matter here.\n', 'utf8');
  try {
    await assert.rejects(
      () =>
        syncDesignDocs({
          adapterPath: FIXTURE_PATH,
          docPath,
          log: () => {},
          warn: () => {},
        }),
      /No YAML front matter/,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('splitFrontMatter parses standard front matter', () => {
  const content = '---\nfoo: bar\nbaz: qux\n---\nbody content\n';
  const result = splitFrontMatter(content);
  assert.deepEqual(result, {
    frontMatter: 'foo: bar\nbaz: qux',
    body: 'body content\n',
  });
});

test('splitFrontMatter returns null when there is no front matter', () => {
  assert.equal(splitFrontMatter('# heading only'), null);
  assert.equal(splitFrontMatter('---\nfoo: bar\n'), null);
});
