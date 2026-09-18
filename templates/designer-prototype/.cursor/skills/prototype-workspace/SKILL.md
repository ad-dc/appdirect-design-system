---
name: prototype-workspace
description: >-
  Works in an AppDirect designer prototype repo (proto-*). Creates pages with
  create-page, imports UI from @appdirect/ds-prototype-kit, puts product widgets
  in components/local, bumps the kit tarball URL for design-system updates, and
  runs ds-audit. Use when adding prototype screens, scaffolding pages, updating
  the DS kit, or checking DS compliance.
---

# Designer prototype workspace

This repo is a **thin Next.js shell**. It does not contain design-system source.

## Imports

```tsx
import { Button, Card, Stack, TextInput } from '@appdirect/ds-prototype-kit';
```

Never import from `@mantine/core` in pages. Never add or edit `components/DesignSystem/`. Domain-specific widgets belong in `components/local/`. Use `DataTable` for sortable/filterable/paginated data; `Table` is only simple markup.

## New page

```bash
npm run create-page -- --name "Page Title" --template app-shell --layout single-column
```

- `--template`: `app-shell` | `content-only`
- `--layout`: `single-column` | `tertiary`

Then edit `app/prototype/<slug>/page.tsx`. Index: http://localhost:3000/prototype

## Kit update

When a new kit ships, set `@appdirect/ds-prototype-kit` in `package.json` to the new GitHub Release `.tgz` URL, run `npm install`, then `npm run fill-manifest-versions`. Do not hand-edit `prototype-manifest.json` `versions`.

Releases: https://github.com/ad-dc/appdirect-design-system/releases

Do not cherry-pick or merge `appdirect-design-system`.

## Audit

After implementing or changing a page, run:

```bash
npm run ds:audit
```

Writes `prototype-audit.json`. Restricted `@mantine/core` imports fail. Missing `PageContentHeader` and handmade record lists are findings, not failures. No network.

## Setup

`npm install` then `npm run dev`. Token CSS ships inside the kit tarball. No Artifactory.
