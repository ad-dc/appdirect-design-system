#!/usr/bin/env node

/**
 * Scaffold a new prototype page.
 *
 * Usage:
 *   npm run create-page -- --name "Settings" --template app-shell --layout single-column
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT, 'prototype-manifest.json');
const TEMPLATES_DIR = path.join(__dirname, 'page-templates');
const PAGES_DIR = path.join(ROOT, 'app', 'prototype');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].replace(/^--/, '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      args[key] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
    }
  }
  return args;
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function toPascalCase(str) {
  return str
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

function main() {
  const args = parseArgs(process.argv);

  if (!args.name) {
    console.error('Error: --name is required.\n');
    console.error('Usage: npm run create-page -- --name "Page Title" [--template app-shell] [--layout single-column]');
    process.exit(1);
  }

  const name = args.name;
  const template = args.template || 'app-shell';
  const layout = args.layout || 'single-column';
  const icon = args.icon || 'ri-file-line';
  const description = args.description || '';
  const navGroup = args.navGroup || 'main';

  const validTemplates = ['app-shell', 'content-only'];
  const validLayouts = ['single-column', 'tertiary'];

  if (!validTemplates.includes(template)) {
    console.error(`Error: --template must be one of: ${validTemplates.join(', ')}`);
    process.exit(1);
  }
  if (!validLayouts.includes(layout)) {
    console.error(`Error: --layout must be one of: ${validLayouts.join(', ')}`);
    process.exit(1);
  }

  const slug = slugify(name);
  const componentName = toPascalCase(name) + 'Page';
  const pageDir = path.join(PAGES_DIR, slug);

  if (fs.existsSync(pageDir)) {
    console.error(`Error: Page directory already exists: ${pageDir}`);
    process.exit(1);
  }

  const templateFile = path.join(TEMPLATES_DIR, `${template}-${layout}.tsx.template`);
  if (!fs.existsSync(templateFile)) {
    console.error(`Error: Template not found: ${templateFile}`);
    process.exit(1);
  }

  let manifest = { prototypeName: 'AppDirect Prototype', pages: [], navGroups: {} };
  if (fs.existsSync(MANIFEST_PATH)) {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  }

  let content = fs.readFileSync(templateFile, 'utf-8');
  content = content
    .replace(/\{\{PAGE_TITLE\}\}/g, name)
    .replace(/\{\{PAGE_SLUG\}\}/g, slug)
    .replace(/\{\{PAGE_COMPONENT\}\}/g, componentName)
    .replace(/\{\{PAGE_ICON\}\}/g, icon)
    .replace(/\{\{PAGE_DESCRIPTION\}\}/g, description)
    .replace(/\{\{PROTOTYPE_TITLE\}\}/g, manifest.prototypeName);

  fs.mkdirSync(pageDir, { recursive: true });
  const pagePath = path.join(pageDir, 'page.tsx');
  fs.writeFileSync(pagePath, content, 'utf-8');

  manifest.pages.push({
    slug,
    title: name,
    template,
    contentLayout: layout,
    navGroup,
    description,
  });

  if (!manifest.navGroups[navGroup]) {
    manifest.navGroups[navGroup] = { title: navGroup, items: [] };
  }
  manifest.navGroups[navGroup].items.push({ slug, icon });

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');

  console.log(`\nCreated prototype page:`);
  console.log(`  File:     ${path.relative(ROOT, pagePath)}`);
  console.log(`  Route:    /prototype/${slug}`);
  console.log(`  Template: ${template}`);
  console.log(`  Layout:   ${layout}`);
  console.log(`  Manifest: updated\n`);
}

main();
