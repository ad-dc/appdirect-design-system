#!/usr/bin/env node

/**
 * Fill prototype-manifest.json `versions` from package.json / kit pin.
 *
 * create-page must not hand-edit these fields. After a kit bump, run:
 *   npm run fill-manifest-versions
 *
 * Usage:
 *   node tools/fill-manifest-versions.js
 *   node tools/fill-manifest-versions.js --root /path/to/prototype
 */

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) continue;
    const key = argv[i].replace(/^--/, '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    args[key] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
  }
  return args;
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function firstNonEmpty(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && String(value).length > 0) return value;
  }
  return '';
}

/** Strip npm range markers; pull x.y.z from a tarball URL or specifier. */
function semverFromSpec(spec) {
  if (!spec || typeof spec !== 'string') return '';
  if (spec.includes('__KIT_TARBALL_URL__')) return '';
  const tarball = spec.match(/ds-prototype-kit-v?(\d+\.\d+\.\d+)\.tgz/);
  if (tarball) return tarball[1];
  const tagged = spec.match(/\/download\/v(\d+\.\d+\.\d+)\//);
  if (tagged) return tagged[1];
  if (/^https?:\/\//.test(spec)) return '';
  const matched = spec.match(/(\d+\.\d+\.\d+)/);
  return matched ? matched[1] : '';
}

function depSpec(pkg, name) {
  if (!pkg) return '';
  return (pkg.dependencies && pkg.dependencies[name]) || (pkg.devDependencies && pkg.devDependencies[name]) || '';
}

function resolveKitVersion(root, pkg) {
  const fromDep = semverFromSpec(depSpec(pkg, '@appdirect/ds-prototype-kit'));
  if (fromDep) return fromDep;
  const kitPkg = readJson(path.join(root, 'ds-package', 'package.json'));
  if (kitPkg && kitPkg.version) return kitPkg.version;
  const installed = readJson(
    path.join(root, 'node_modules', '@appdirect', 'ds-prototype-kit', 'package.json')
  );
  if (installed && installed.version) return installed.version;
  return '';
}

function resolveTokensSnapshot(root, pkg) {
  const fromDep = semverFromSpec(depSpec(pkg, '@appdirect/design-tokens'));
  if (fromDep) return fromDep;
  const kitPkg = readJson(path.join(root, 'ds-package', 'package.json'));
  if (kitPkg && kitPkg.tokensSnapshot) return kitPkg.tokensSnapshot;
  const installed = readJson(
    path.join(root, 'node_modules', '@appdirect', 'ds-prototype-kit', 'package.json')
  );
  if (installed && installed.tokensSnapshot) return installed.tokensSnapshot;
  const localMeta = readJson(path.join(root, 'template.meta.json'));
  if (localMeta && localMeta.tokensSnapshot) return localMeta.tokensSnapshot;
  return '';
}

function lockfileResolvedVersion(root, name) {
  const lock = readJson(path.join(root, 'package-lock.json'));
  if (!lock) return '';
  if (lock.packages) {
    const entry = lock.packages[`node_modules/${name}`];
    if (entry && entry.version) return entry.version;
  }
  if (lock.dependencies && lock.dependencies[name] && lock.dependencies[name].version) {
    return semverFromSpec(lock.dependencies[name].version);
  }
  return '';
}

function installedPackageVersion(root, name) {
  const parts = name.startsWith('@') ? name.split('/') : [name];
  const pkg = readJson(path.join(root, 'node_modules', ...parts, 'package.json'));
  return (pkg && pkg.version) || '';
}

function resolveMantine(root, pkg) {
  return firstNonEmpty(
    installedPackageVersion(root, '@mantine/core'),
    lockfileResolvedVersion(root, '@mantine/core'),
    semverFromSpec(depSpec(pkg, '@mantine/core'))
  );
}

function resolveTemplate(root) {
  const localMeta = readJson(path.join(root, 'template.meta.json'));
  if (!localMeta || !localMeta.templateVersion) return null;
  return {
    id: localMeta.templateId || 'ad-dc/appdirect-prototype-template',
    version: localMeta.templateVersion,
  };
}

function orderManifest(manifest) {
  const ordered = {};
  const preferred = ['prototypeName', 'template', 'versions', 'pages', 'navGroups', 'exceptions'];
  for (const key of preferred) {
    if (manifest[key] !== undefined) ordered[key] = manifest[key];
  }
  for (const key of Object.keys(manifest)) {
    if (!(key in ordered)) ordered[key] = manifest[key];
  }
  return ordered;
}

/**
 * Rewrite `versions` (and optional `template`) from package.json / kit pin.
 * Leaves pages, navGroups, exceptions, and other unknown keys alone.
 */
function fillManifestVersions(root, options = {}) {
  const pkg = readJson(path.join(root, 'package.json')) || {};
  const manifestPath = path.join(root, 'prototype-manifest.json');
  const manifest = readJson(manifestPath) || {
    prototypeName: 'AppDirect Prototype',
    pages: [],
    navGroups: {},
  };
  const previous = manifest.versions && typeof manifest.versions === 'object' ? manifest.versions : {};

  const kit = firstNonEmpty(options.kit, resolveKitVersion(root, pkg), previous.kit);
  const tokensSnapshot = firstNonEmpty(
    options.tokensSnapshot,
    resolveTokensSnapshot(root, pkg),
    previous.tokensSnapshot
  );
  const mantine = firstNonEmpty(options.mantine, resolveMantine(root, pkg), previous.mantine);
  // V1: factory ships with the kit. Keep the field so a later split does not change the schema.
  const factory = firstNonEmpty(options.factory, kit, previous.factory);

  manifest.versions = { kit, tokensSnapshot, factory, mantine };

  if (options.template) {
    manifest.template = options.template;
  } else {
    const fromMeta = resolveTemplate(root);
    if (fromMeta) manifest.template = fromMeta;
  }

  const ordered = orderManifest(manifest);
  writeJson(manifestPath, ordered);
  return ordered;
}

function main(argv = process.argv) {
  const args = parseArgs(argv);
  const root = typeof args.root === 'string' ? path.resolve(args.root) : path.resolve(__dirname, '..');
  const manifest = fillManifestVersions(root);
  console.log(`Updated ${path.join(root, 'prototype-manifest.json')}`);
  console.log(`  kit:             ${manifest.versions.kit || '(empty)'}`);
  console.log(`  tokensSnapshot:  ${manifest.versions.tokensSnapshot || '(empty)'}`);
  console.log(`  factory:         ${manifest.versions.factory || '(empty)'}`);
  console.log(`  mantine:         ${manifest.versions.mantine || '(empty)'}`);
  return manifest;
}

if (require.main === module) {
  main();
}

module.exports = {
  parseArgs,
  semverFromSpec,
  fillManifestVersions,
  main,
};
