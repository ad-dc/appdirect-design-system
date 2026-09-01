#!/usr/bin/env node

/**
 * Create a per-designer prototype repo from templates/designer-prototype.
 *
 * Pins @appdirect/ds-prototype-kit to a GitHub Release tarball (default: latest).
 *
 * Usage:
 *   npm run create-prototype -- --name proto-alex
 *   npm run create-prototype -- --name proto-alex --title "Alex prototypes" --github --collaborator alex
 *
 * Options:
 *   --name           Repo / folder name (required). Lowercase, digits, hyphens.
 *   --title          Display name in the prototype index (default: derived from --name)
 *   --out            Destination directory (default: ../<name> next to this repo)
 *   --org            GitHub org for --github (default: ad-dc)
 *   --kit-url        Full tarball URL (skips GitHub release lookup)
 *   --kit-tag        Release tag to pin (e.g. v0.2.0)
 *   --github         Create a private GitHub repo, commit, and push
 *   --public         With --github, create a public repo instead of private
 *   --collaborator   GitHub username to grant write on the new repo (repeatable)
 *   --no-git         Skip git init / initial commit (useful for tests)
 *   --dry-run        Print the plan without writing files
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATE_DIR = path.join(ROOT, 'templates', 'designer-prototype');
const KIT_REPO = 'ad-dc/appdirect-design-system';
const SKIP_NAMES = new Set(['template.meta.json', 'node_modules', '.next']);
const PLACEHOLDER_RE = /__PACKAGE_NAME__|__PROTOTYPE_NAME__|__KIT_TARBALL_URL__/g;
const TEXT_EXT = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.json',
  '.md',
  '.css',
  '.mdc',
  '.template',
  '.gitignore',
  '.npmrc',
  '.example',
]);

function parseArgs(argv) {
  const args = { collaborator: [] };
  for (let i = 2; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) continue;
    const key = argv[i].replace(/^--/, '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    if (key === 'collaborator') {
      const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : '';
      if (value) args.collaborator.push(value);
      continue;
    }
    if (key === 'github' || key === 'public' || key === 'dryRun' || key === 'noGit') {
      args[key] = true;
      continue;
    }
    args[key] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
  }
  return args;
}

function slugifyName(str) {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function titleFromName(name) {
  return name
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function isTextFile(filePath) {
  const ext = path.extname(filePath);
  const base = path.basename(filePath);
  if (base.startsWith('.') && TEXT_EXT.has(ext || base)) return true;
  if (base === '.gitignore' || base === '.npmrc' || base === '.env.example') return true;
  return TEXT_EXT.has(ext);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (SKIP_NAMES.has(entry.name)) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

function applyPlaceholders(dir, replacements) {
  const leftover = [];
  function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!isTextFile(full)) continue;
      const original = fs.readFileSync(full, 'utf8');
      const next = original
        .replace(/__PACKAGE_NAME__/g, replacements.packageName)
        .replace(/__PROTOTYPE_NAME__/g, replacements.prototypeName)
        .replace(/__KIT_TARBALL_URL__/g, replacements.kitTarballUrl);
      if (next !== original) fs.writeFileSync(full, next, 'utf8');
      const still = next.match(PLACEHOLDER_RE);
      if (still) leftover.push({ file: full, tokens: still });
    }
  }
  walk(dir);
  return leftover;
}

function resolveKitTarballUrl({ kitUrl, kitTag }) {
  if (kitUrl) return kitUrl;
  const tagFlag = kitTag ? [kitTag] : [];
  let raw;
  try {
    raw = execFileSync(
      'gh',
      ['release', 'view', ...tagFlag, '--repo', KIT_REPO, '--json', 'tagName,assets'],
      { encoding: 'utf8' }
    );
  } catch (error) {
    throw new Error(
      'Could not look up the kit release with gh. Pass --kit-url or --kit-tag.\n' +
        (error.stderr || error.message)
    );
  }
  const release = JSON.parse(raw);
  const asset = (release.assets || []).find((item) => item.name && item.name.endsWith('.tgz'));
  if (!asset) {
    throw new Error(`No .tgz asset on release ${release.tagName} of ${KIT_REPO}`);
  }
  return `https://github.com/${KIT_REPO}/releases/download/${release.tagName}/${asset.name}`;
}

function gitInitAndCommit(dest, message) {
  execFileSync('git', ['init', '-b', 'main'], { cwd: dest, stdio: 'pipe' });
  execFileSync('git', ['add', '.'], { cwd: dest, stdio: 'pipe' });
  execFileSync('git', ['commit', '-m', message], { cwd: dest, stdio: 'pipe' });
}

function createGithubRepo({ dest, org, name, isPrivate, collaborators }) {
  const repo = `${org}/${name}`;
  const visibility = isPrivate ? '--private' : '--public';
  execFileSync(
    'gh',
    ['repo', 'create', repo, visibility, '--source', dest, '--remote', 'origin', '--push'],
    { cwd: dest, stdio: 'inherit' }
  );
  for (const user of collaborators) {
    execFileSync(
      'gh',
      ['api', `repos/${repo}/collaborators/${user}`, '-X', 'PUT', '-f', 'permission=push'],
      { cwd: dest, stdio: 'inherit' }
    );
  }
  return `https://github.com/${repo}`;
}

function main(argv = process.argv) {
  const args = parseArgs(argv);

  if (!args.name || args.name === true) {
    console.error('Error: --name is required.\n');
    console.error('Usage: npm run create-prototype -- --name proto-alex [--github] [--collaborator user]');
    process.exit(1);
  }

  const name = slugifyName(args.name);
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) {
    console.error(`Error: --name must be a slug (lowercase letters, digits, hyphens). Got: ${args.name}`);
    process.exit(1);
  }

  if (!fs.existsSync(TEMPLATE_DIR)) {
    console.error(`Error: template missing at ${TEMPLATE_DIR}`);
    process.exit(1);
  }

  const prototypeName = typeof args.title === 'string' && args.title ? args.title : titleFromName(name);
  const dest = path.resolve(typeof args.out === 'string' ? args.out : path.join(ROOT, '..', name));
  const org = typeof args.org === 'string' ? args.org : 'ad-dc';
  const collaborators = args.collaborator || [];

  let kitTarballUrl;
  try {
    kitTarballUrl = resolveKitTarballUrl({
      kitUrl: typeof args.kitUrl === 'string' ? args.kitUrl : undefined,
      kitTag: typeof args.kitTag === 'string' ? args.kitTag : undefined,
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }

  console.log('Designer prototype');
  console.log(`  Name:     ${name}`);
  console.log(`  Title:    ${prototypeName}`);
  console.log(`  Out:      ${dest}`);
  console.log(`  Kit:      ${kitTarballUrl}`);
  if (args.github) {
    console.log(`  GitHub:   ${org}/${name} (${args.public ? 'public' : 'private'})`);
    if (collaborators.length) console.log(`  Write:    ${collaborators.join(', ')}`);
  }

  if (args.dryRun) {
    console.log('\nDry run — no files written.');
    return { dest, kitTarballUrl, name, prototypeName };
  }

  if (fs.existsSync(dest)) {
    console.error(`Error: destination already exists: ${dest}`);
    process.exit(1);
  }

  copyDir(TEMPLATE_DIR, dest);
  const leftover = applyPlaceholders(dest, {
    packageName: name,
    prototypeName,
    kitTarballUrl,
  });
  if (leftover.length) {
    console.error('Error: unsubstituted placeholders remain:');
    leftover.forEach((item) => console.error(`  ${item.file}: ${item.tokens.join(', ')}`));
    process.exit(1);
  }

  if (args.github && args.noGit) {
    console.error('Error: --github requires git. Do not pass --no-git.');
    process.exit(1);
  }

  if (!args.noGit) {
    gitInitAndCommit(dest, `chore: scaffold ${name} from appdirect-design-system prototype template`);
  }

  let githubUrl;
  if (args.github) {
    githubUrl = createGithubRepo({
      dest,
      org,
      name,
      isPrivate: !args.public,
      collaborators,
    });
  }

  console.log('\nNext:');
  console.log(`  cd ${dest}`);
  console.log('  npm install');
  console.log('  npm run dev');
  if (githubUrl) console.log(`  ${githubUrl}`);
  console.log('');

  return { dest, kitTarballUrl, name, prototypeName, githubUrl };
}

if (require.main === module) {
  main();
}

module.exports = {
  parseArgs,
  slugifyName,
  titleFromName,
  resolveKitTarballUrl,
  applyPlaceholders,
  copyDir,
  main,
};
