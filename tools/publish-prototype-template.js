#!/usr/bin/env node

/**
 * Publish templates/designer-prototype to ad-dc/appdirect-prototype-template
 * as a GitHub template repo, with the latest kit tarball URL baked in.
 *
 * Consumers then self-serve with:
 *   gh repo create my-proto --template ad-dc/appdirect-prototype-template --private --clone
 *
 * Usage:
 *   npm run publish-prototype-template
 *   npm run publish-prototype-template -- --dry-run
 *   npm run publish-prototype-template -- --kit-tag v0.2.0
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const {
  copyDir,
  applyPlaceholders,
  resolveKitTarballUrl,
} = require('./create-prototype-repo.js');

const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(ROOT, 'templates', 'designer-prototype');
const TEMPLATE_REPO = 'ad-dc/appdirect-prototype-template';
const PACKAGE_NAME = 'appdirect-prototype';
const PROTOTYPE_NAME = 'AppDirect Prototype';

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) continue;
    const key = argv[i].replace(/^--/, '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    if (key === 'dryRun' || key === 'public' || key === 'private') {
      args[key] = true;
      continue;
    }
    args[key] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
  }
  return args;
}

function repoExists(repo) {
  const result = execFileSync('gh', ['repo', 'view', repo, '--json', 'name'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return Boolean(JSON.parse(result).name);
}

function safeRepoExists(repo) {
  try {
    return repoExists(repo);
  } catch {
    return false;
  }
}

function wipeWorkingTree(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    fs.rmSync(path.join(dir, entry.name), { recursive: true, force: true });
  }
}

function materialize(dest, kitTarballUrl) {
  copyDir(SOURCE, dest);
  const leftover = applyPlaceholders(dest, {
    packageName: PACKAGE_NAME,
    prototypeName: PROTOTYPE_NAME,
    kitTarballUrl,
  });
  if (leftover.length) {
    const detail = leftover.map((item) => `${item.file}: ${item.tokens.join(', ')}`).join('\n');
    throw new Error(`Unsubstituted placeholders:\n${detail}`);
  }
}

function gitCommitPush(dir, message) {
  execFileSync('git', ['add', '-A'], { cwd: dir, stdio: 'pipe' });
  const status = execFileSync('git', ['status', '--porcelain'], { cwd: dir, encoding: 'utf8' });
  if (!status.trim()) {
    console.log('Template repo already matches this publish. Nothing to commit.');
    return false;
  }
  execFileSync('git', ['commit', '-m', message], { cwd: dir, stdio: 'pipe' });
  execFileSync('git', ['push', 'origin', 'HEAD'], { cwd: dir, stdio: 'inherit' });
  return true;
}

function markAsTemplate(repo) {
  execFileSync('gh', ['api', '-X', 'PATCH', `repos/${repo}`, '-F', 'is_template=true'], {
    stdio: 'pipe',
  });
}

function main(argv = process.argv) {
  const args = parseArgs(argv);
  const kitTarballUrl = resolveKitTarballUrl({
    kitUrl: typeof args.kitUrl === 'string' ? args.kitUrl : undefined,
    kitTag: typeof args.kitTag === 'string' ? args.kitTag : undefined,
  });
  const exists = safeRepoExists(TEMPLATE_REPO);
  const visibility = args.private ? 'private' : 'public';

  console.log('Publish GitHub template');
  console.log(`  Source:   ${SOURCE}`);
  console.log(`  Target:   https://github.com/${TEMPLATE_REPO}`);
  console.log(`  Exists:   ${exists}`);
  console.log(`  Kit:      ${kitTarballUrl}`);
  if (!exists) console.log(`  Create:   ${visibility}`);

  if (args.dryRun) {
    console.log('\nDry run — no GitHub writes.');
    return { kitTarballUrl, exists, dryRun: true };
  }

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ad-prototype-template-'));
  try {
    if (exists) {
      execFileSync('gh', ['repo', 'clone', TEMPLATE_REPO, tmp, '--', '--depth', '1'], {
        stdio: 'inherit',
      });
      wipeWorkingTree(tmp);
      materialize(tmp, kitTarballUrl);
      gitCommitPush(tmp, 'chore: sync designer prototype template from appdirect-design-system');
    } else {
      materialize(tmp, kitTarballUrl);
      execFileSync('git', ['init', '-b', 'main'], { cwd: tmp, stdio: 'pipe' });
      execFileSync('git', ['add', '.'], { cwd: tmp, stdio: 'pipe' });
      execFileSync('git', ['commit', '-m', 'chore: initial AppDirect prototype template'], {
        cwd: tmp,
        stdio: 'pipe',
      });
      const visFlag = args.private ? '--private' : '--public';
      execFileSync(
        'gh',
        [
          'repo',
          'create',
          TEMPLATE_REPO,
          visFlag,
          '--description',
          'Self-serve AppDirect prototype starter. Uses @appdirect/ds-prototype-kit from GitHub Releases. Not the design-system source.',
          '--source',
          tmp,
          '--remote',
          'origin',
          '--push',
        ],
        { cwd: tmp, stdio: 'inherit' }
      );
    }
    markAsTemplate(TEMPLATE_REPO);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }

  console.log(`\nTemplate: https://github.com/${TEMPLATE_REPO}`);
  console.log('Self-serve:');
  console.log(
    `  gh repo create my-prototype --template ${TEMPLATE_REPO} --private --clone`
  );
  console.log('');
  return { kitTarballUrl, exists };
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`Error: ${error.message || error}`);
    process.exit(1);
  }
}

module.exports = { main, parseArgs, TEMPLATE_REPO, materialize };
