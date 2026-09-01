#!/usr/bin/env node

/**
 * Build script for @appdirect/ds-prototype-kit
 *
 * Copies DS component source files to dist/, excluding stories, tests,
 * figma-specific files, and components with unresolvable external dependencies.
 *
 * The package is distributed as TypeScript source that consumers compile
 * with their own build tooling (Next.js, Vite, Rspack).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PROJECT_ROOT = path.resolve(ROOT, '..');
const SOURCE_DIR = path.join(PROJECT_ROOT, 'components', 'DesignSystem');
const DIST_DIR = path.join(ROOT, 'dist');

const SKIP_PATTERNS = [
  /\.stories\.[tj]sx?$/,
  /\.test\.[tj]sx?$/,
  /\.spec\.[tj]sx?$/,
  /\.figma\.[tj]sx?$/,
  /FIGMA_PROPS_REGISTRY\.md$/,
  /LAYOUT_GUIDE\.md$/,
  /README\.md$/,
  /Welcome\.stories\.mdx$/,
];

// Files that import from outside the DS directory (hooks/, etc.)
// and can't be resolved in the package
const SKIP_FILES_WITH_EXTERNAL_REFS = [
  /ComplexComponents\/DataTable\//,
];

function shouldSkip(filename) {
  return SKIP_PATTERNS.some((pattern) => pattern.test(filename));
}

function shouldSkipPath(relativePath) {
  return SKIP_FILES_WITH_EXTERNAL_REFS.some((pattern) => pattern.test(relativePath));
}

/**
 * Compute the relative prefix to reach the dist root from a file's location.
 * e.g., "Combobox/Multiselect.tsx" -> "../"
 *       "ComplexComponents/Utilities/CopyButton.tsx" -> "../../"
 */
function getRelativeToRoot(relativeFilePath) {
  const depth = relativeFilePath.split(path.sep).length - 1;
  if (depth <= 0) return './';
  return '../'.repeat(depth);
}

/**
 * Strip lines that reference excluded modules (DataTable, etc.)
 * from the barrel index.ts so it doesn't try to import missing files.
 */
function stripExcludedExports(content) {
  return content
    .split('\n')
    .filter((line) => !line.includes('DataTable') || line.startsWith('//'))
    .join('\n');
}

function rewriteImports(content, relativeFilePath) {
  const toRoot = getRelativeToRoot(relativeFilePath);

  // Rewrite barrel import: @/components/DesignSystem (no trailing slash)
  // e.g., import { Inline } from '@/components/DesignSystem'
  content = content.replace(
    /from\s+['"]@\/components\/DesignSystem['"]/g,
    `from '${toRoot.slice(0, -1)}'`
  );

  // Rewrite subfolder imports: @/components/DesignSystem/Layout/Inline
  // e.g., import { Inline } from '@/components/DesignSystem/Layout/Inline'
  content = content.replace(
    /from\s+['"]@\/components\/DesignSystem\/([^'"]+)['"]/g,
    (match, subpath) => `from '${toRoot}${subpath}'`
  );

  return content;
}

function copyDirSync(src, dest, relativeBase = '') {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    const relativePath = path.join(relativeBase, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath, relativePath);
    } else if (!shouldSkip(entry.name) && !shouldSkipPath(relativePath)) {
      let content = fs.readFileSync(srcPath, 'utf-8');

      if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
        content = rewriteImports(content, relativePath);
        // Strip excluded module references from the barrel
        if (entry.name === 'index.ts' && relativeBase === '') {
          content = stripExcludedExports(content);
        }
      }

      fs.writeFileSync(destPath, content, 'utf-8');
    }
  }
}

const VENDOR_CSS_DIR = path.join(ROOT, 'vendor', 'css');

function copyTokenCss() {
  const dest = path.join(DIST_DIR, 'css');
  fs.mkdirSync(dest, { recursive: true });
  for (const file of ['foundations.css', 'mantine.css']) {
    const from = path.join(VENDOR_CSS_DIR, file);
    if (!fs.existsSync(from)) {
      throw new Error(`Missing vendored token CSS: ${from}`);
    }
    fs.copyFileSync(from, path.join(dest, file));
  }
}

function removeEmptyDirs(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      removeEmptyDirs(path.join(dir, entry.name));
    }
  }
  if (fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir);
  }
}

function main() {
  console.log('Building @appdirect/ds-prototype-kit...\n');

  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true });
  }

  copyDirSync(SOURCE_DIR, DIST_DIR);
  copyTokenCss();

  // Clean up empty directories left by skipped files
  removeEmptyDirs(DIST_DIR);

  let fileCount = 0;
  function countFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        countFiles(path.join(dir, entry.name));
      } else {
        fileCount++;
      }
    }
  }
  countFiles(DIST_DIR);

  console.log(`  Copied ${fileCount} files to dist/`);
  console.log('  Included: vendor/css/foundations.css, mantine.css');
  console.log('  Excluded: DataTable (external hook dependencies)');
  console.log('  Done.\n');
}

main();
