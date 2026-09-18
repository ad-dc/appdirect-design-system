/**
 * Tests for tier-0 DS component contracts.
 *
 * Wrapper enums from types.ts / SpacingScale must be a subset of the contract
 * enums. Complex contracts must match PageContentHeader / DataTable source and
 * must not claim a Mantine base type.
 *
 * Run with: node --test tools/ds-contracts.test.mjs
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DS = path.join(ROOT, 'components', 'DesignSystem');
const TYPES = readFileSync(path.join(DS, 'types.ts'), 'utf8');
const STACK = readFileSync(path.join(DS, 'Layout', 'Stack.tsx'), 'utf8');
const PCH = readFileSync(
  path.join(DS, 'ComplexComponents', 'PageContentHeader', 'PageContentHeader.tsx'),
  'utf8'
);
const TABLE = readFileSync(path.join(DS, 'ComplexComponents', 'DataTable', 'DataTable.tsx'), 'utf8');

function loadContract(relativeFromDs) {
  return JSON.parse(readFileSync(path.join(DS, relativeFromDs), 'utf8'));
}

function collectContractFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectContractFiles(full, out);
    else if (entry.name.endsWith('.contract.json')) out.push(full);
  }
  return out;
}

function parseConstStringArray(source, name) {
  const match = source.match(new RegExp(`export const ${name} = \\[([\\s\\S]*?)\\] as const`));
  assert.ok(match, `missing export const ${name}`);
  return [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]);
}

function parseStringUnion(source, typeName) {
  const match = source.match(new RegExp(`export type ${typeName} = ([^;]+);`));
  assert.ok(match, `missing export type ${typeName}`);
  return [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]);
}

function assertSubset(inner, outer, label) {
  const missing = inner.filter((value) => !outer.includes(value));
  assert.deepEqual(missing, [], `${label} missing from contract: ${missing.join(', ')}`);
}

test('every contract has id, kind, version, importFrom, enforcement', () => {
  const files = collectContractFiles(DS);
  assert.ok(files.length >= 10, `expected tier-0 contracts, found ${files.length}`);
  for (const file of files) {
    const json = JSON.parse(readFileSync(file, 'utf8'));
    assert.equal(typeof json.id, 'string', file);
    assert.ok(json.kind === 'wrapper' || json.kind === 'complex', `${file} kind`);
    assert.equal(typeof json.version, 'string', file);
    assert.ok(Array.isArray(json.importFrom), `${file} importFrom`);
    assert.ok(Array.isArray(json.enforcement?.deterministic), `${file} deterministic`);
    assert.ok(Array.isArray(json.enforcement?.semantic), `${file} semantic`);
  }
});

test('Button / Badge / Alert wrapper enums are subsets of the contracts', () => {
  const button = loadContract('Buttons/Button.contract.json');
  const badge = loadContract('DataDisplay/Badge.contract.json');
  const alert = loadContract('DataDisplay/Alert.contract.json');

  assertSubset(
    parseConstStringArray(TYPES, 'DS_BUTTON_VARIANTS'),
    button.api.props.variant.enum,
    'DS_BUTTON_VARIANTS'
  );
  assertSubset(parseConstStringArray(TYPES, 'DS_SIZES'), button.api.props.size.enum, 'DS_SIZES on Button');
  assert.equal(button.api.props.radius.fixed, 'sm');
  assert.equal(button.kind, 'wrapper');

  assertSubset(
    parseConstStringArray(TYPES, 'DS_BADGE_VARIANTS'),
    badge.api.props.variant.enum,
    'DS_BADGE_VARIANTS'
  );
  assertSubset(
    parseConstStringArray(TYPES, 'DS_BADGE_COLORS'),
    badge.api.props.color.enum,
    'DS_BADGE_COLORS'
  );

  assertSubset(
    parseConstStringArray(TYPES, 'DS_ALERT_COLORS'),
    alert.api.props.color.enum,
    'DS_ALERT_COLORS'
  );
  assert.equal(alert.api.props.color.enum.includes('warning'), false);
});

test('layout spacing scale is a subset of Stack / Inline / Group / Box contracts', () => {
  const scale = parseStringUnion(STACK, 'SpacingScale');
  assertSubset(scale, loadContract('Layout/Stack.contract.json').api.props.gap.enum, 'Stack gap');
  assertSubset(scale, loadContract('Layout/Inline.contract.json').api.props.gap.enum, 'Inline gap');
  assertSubset(scale, loadContract('Layout/Group.contract.json').api.props.gap.enum, 'Group gap');
  assertSubset(scale, loadContract('Layout/Box.contract.json').api.props.p.enum, 'Box p');
  assert.equal(loadContract('Layout/Group.contract.json').aliasOf, 'Inline');
});

test('PageContentHeader contentSection and required title match the TSX', () => {
  const contract = loadContract(
    'ComplexComponents/PageContentHeader/PageContentHeader.contract.json'
  );
  const fromSource = parseStringUnion(PCH, 'ContentSection');
  assert.deepEqual([...fromSource].sort(), [...contract.api.props.contentSection.enum].sort());
  assert.equal(contract.api.props.contentSection.required, true);
  assert.equal(contract.api.props.title.required, true);
  assert.match(PCH, /^\s+title: string;/m);
  assert.doesNotMatch(PCH, /^\s+title\?:/m);
  assert.match(PCH, /^\s+contentSection: ContentSection;/m);
  assert.equal(contract.kind, 'complex');
  assert.equal(contract.mantineCounterpart, null);
  assert.equal('mantineBase' in contract, false);
  assert.equal(JSON.stringify(contract).includes('extends Mantine'), false);
});

test('DataTable is a complex contract with required data and columns', () => {
  const contract = loadContract('ComplexComponents/DataTable/DataTable.contract.json');
  assert.equal(contract.kind, 'complex');
  assert.equal(contract.mantineCounterpart, null);
  assert.equal('mantineBase' in contract, false);
  assert.equal(JSON.stringify(contract).includes('extends Mantine'), false);
  assert.equal(contract.api.props.data.required, true);
  assert.equal(contract.api.props.columns.required, true);
  assert.match(TABLE, /^\s+data: T\[\];/m);
  assert.match(TABLE, /^\s+columns: ColumnDef<T>\[\];/m);
  assert.match(contract.composition.notes, /Static dummy lists may use Table/);
});

test('kit build copies contracts and ds-audit into dist', () => {
  execFileSync('node', [path.join(ROOT, 'ds-package/scripts/build.js')], { stdio: 'pipe' });
  const index = JSON.parse(
    readFileSync(path.join(ROOT, 'ds-package/dist/contracts/index.json'), 'utf8')
  );
  const kitPkg = JSON.parse(readFileSync(path.join(ROOT, 'ds-package/package.json'), 'utf8'));
  assert.equal(index.version, kitPkg.version);
  const ids = index.contracts.map((item) => item.id).sort();
  assert.deepEqual(ids, [
    'Alert',
    'Badge',
    'Box',
    'Button',
    'DataTable',
    'Grid',
    'Group',
    'Inline',
    'PageContentHeader',
    'Stack',
  ]);
  for (const id of ids) {
    assert.equal(existsSync(path.join(ROOT, `ds-package/dist/contracts/${id}.json`)), true);
  }
  const bin = path.join(ROOT, 'ds-package/dist/bin/ds-audit.js');
  assert.equal(existsSync(bin), true);
  assert.equal((statSync(bin).mode & 0o111) !== 0, true);
});
