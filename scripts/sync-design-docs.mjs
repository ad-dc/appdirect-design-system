#!/usr/bin/env node
/**
 * sync-design-docs.mjs
 *
 * Replaces the YAML front matter in DESIGN.md with the contents of
 * @appdirect/design-tokens/dist/design-spec.yaml. The markdown body is
 * preserved byte-for-byte.
 *
 * The body of DESIGN.md is the source of truth for human semantics — all
 * rationale, A11Y notes, and usage guidance live in the prose, never in
 * the YAML. Re-run this script after bumping @appdirect/design-tokens.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_ADAPTER_PATH = path.join(
  REPO_ROOT,
  'node_modules',
  '@appdirect',
  'design-tokens',
  'dist',
  'design-spec.yaml',
);
const DEFAULT_DOC_PATH = path.join(REPO_ROOT, 'DESIGN.md');

const FRONT_MATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;

/**
 * Split a markdown file with YAML front matter into its parts.
 * Returns null if the file does not start with a `---` delimiter pair.
 */
export function splitFrontMatter(content) {
  const match = FRONT_MATTER_RE.exec(content);
  if (!match) return null;
  return { frontMatter: match[1], body: match[2] };
}

/**
 * Replace the front matter of `DESIGN.md` with the adapter YAML.
 * Idempotent: a second run on a synced file is a no-op.
 */
export async function syncDesignDocs({
  adapterPath = DEFAULT_ADAPTER_PATH,
  docPath = DEFAULT_DOC_PATH,
  writeFn = writeFile,
  readFn = readFile,
  log = console.log,
  warn = console.warn,
} = {}) {
  let adapterYaml;
  try {
    adapterYaml = await readFn(adapterPath, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      warn(`[sync-design-docs] Adapter not found at ${adapterPath}`);
      warn('[sync-design-docs] Skipping. Install or republish @appdirect/design-tokens to enable sync.');
      return { status: 'skipped', reason: 'adapter-missing' };
    }
    throw err;
  }

  const doc = await readFn(docPath, 'utf8');
  const parts = splitFrontMatter(doc);
  if (!parts) {
    throw new Error(`No YAML front matter found in ${docPath} (expected file to start with '---').`);
  }

  const adapterContent = adapterYaml.replace(/\r?\n+$/, '');
  const next = `---\n${adapterContent}\n---\n${parts.body}`;

  if (next === doc) {
    log('[sync-design-docs] Already in sync.');
    return { status: 'unchanged' };
  }

  await writeFn(docPath, next, 'utf8');
  log(`[sync-design-docs] Updated ${path.relative(REPO_ROOT, docPath)}.`);
  return { status: 'updated' };
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  syncDesignDocs().catch((err) => {
    console.error('[sync-design-docs]', err.message);
    process.exit(1);
  });
}
