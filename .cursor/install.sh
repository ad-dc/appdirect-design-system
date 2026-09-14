#!/usr/bin/env bash
set -euo pipefail

# Cloud Agent install script for appdirect-design-system.
#
# The committed .npmrc maps the @appdirect scope to the internal Artifactory npm
# registry. That registry requires authentication, so the auth token is supplied
# out of source control via the ARTIFACTORY_NPM_TOKEN environment secret and
# wired into the user-level npm config here (never committed).

REGISTRY_HOST="artifactory.appdirect.tools/artifactory/api/npm/npm-repo"

if [ -n "${ARTIFACTORY_NPM_TOKEN:-}" ]; then
  npm config set "//${REGISTRY_HOST}/:_authToken" "${ARTIFACTORY_NPM_TOKEN}"
else
  echo "WARNING: ARTIFACTORY_NPM_TOKEN is not set." >&2
  echo "         Installing @appdirect/* packages from Artifactory will fail with HTTP 403." >&2
fi

# npm ci is deterministic (honors package-lock.json) and idempotent: it recreates
# node_modules from the lockfile on every run.
npm ci
