# __PROTOTYPE_NAME__

AppDirect prototype workspace. Shared UI comes from [`@appdirect/ds-prototype-kit`](https://github.com/ad-dc/appdirect-design-system/releases). This repo does not contain design-system source.

**Start your own copy:** [Use this template](https://github.com/ad-dc/appdirect-prototype-template/generate) or:

```bash
gh repo create my-prototype --template ad-dc/appdirect-prototype-template --private --clone
```

In Cursor, `/prototype-workspace` adds pages; `/audit-prototype` runs typecheck + `ds-audit`; `/start-prototype` creates another repo.

## Setup

The kit installs from a GitHub Release tarball on `ad-dc/appdirect-design-system`. Public npm covers Mantine, Next.js, and fonts. No Artifactory or VPN.

```bash
npm install
npm run dev
```

Open [http://localhost:3000/prototype](http://localhost:3000/prototype).

## Create a page

```bash
npm run create-page -- --name "Settings" --template app-shell --layout single-column
```

`create-page` updates pages and nav only. After a kit bump, run `npm run fill-manifest-versions` so `prototype-manifest.json` `versions` match the pin.

Import shared components from the kit:

```tsx
import { Card, Stack, Button, TextInput, Badge } from '@appdirect/ds-prototype-kit';
```

Product-specific components go in `components/local/`.

## Audit

```bash
npm run ds:audit
```

Writes `prototype-audit.json`. Restricted `@mantine/core` imports fail. Missing page headers and handmade record lists are findings, not failures. No network.

Pull requests run the same check in `.github/workflows/ds-check.yml` (typecheck + audit). Restricted imports fail the job; missing headers warn.

## Update the design system

When a new kit ships, bump the tarball URL in `package.json` to the [latest release](https://github.com/ad-dc/appdirect-design-system/releases), run `npm install`, then `npm run fill-manifest-versions`. Do not cherry-pick or fork `appdirect-design-system`.
