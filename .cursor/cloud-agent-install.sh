#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
ROOT="$PWD"

STUB_DIR="$ROOT/.cursor/design-tokens-stub"
VENDOR_CSS="$ROOT/ds-package/vendor/css"

prepare_design_tokens_stub() {
  mkdir -p "$STUB_DIR/dist/css"
  cp -f "$VENDOR_CSS/foundations.css" "$VENDOR_CSS/mantine.css" "$STUB_DIR/dist/css/"
}

patch_lockfile_for_stub() {
  node <<'NODE'
const fs = require('fs');
const path = require('path');
const lockPath = path.join(process.cwd(), 'package-lock.json');
const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
const stub = path.resolve('.cursor/design-tokens-stub');
const pkgKey = 'node_modules/@appdirect/design-tokens';
if (!lock.packages?.[pkgKey]) {
  console.error('package-lock.json missing', pkgKey);
  process.exit(1);
}
lock.packages[pkgKey].version = '0.0.6';
lock.packages[pkgKey].resolved = stub;
delete lock.packages[pkgKey].integrity;
fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n');
NODE
}

registry="//artifactory.appdirect.tools/artifactory/api/npm/npm-repo/"

if [[ -n "${ARTIFACTORY_NPM_TOKEN:-}" ]]; then
  echo "${registry}:_authToken=${ARTIFACTORY_NPM_TOKEN}" >> "${HOME}/.npmrc"
  npm ci
elif [[ -n "${NPM_TOKEN:-}" ]]; then
  echo "${registry}:_authToken=${NPM_TOKEN}" >> "${HOME}/.npmrc"
  npm ci
else
  echo "No Artifactory npm token — installing @appdirect/design-tokens from vendored CSS stub."
  echo "Set ARTIFACTORY_NPM_TOKEN (or NPM_TOKEN) for the published package from Artifactory."
  prepare_design_tokens_stub
  patch_lockfile_for_stub
  npm ci
fi
