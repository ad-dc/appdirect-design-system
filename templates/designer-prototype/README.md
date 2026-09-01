# __PROTOTYPE_NAME__

Designer prototype workspace. Shared UI comes from [`@appdirect/ds-prototype-kit`](https://github.com/ad-dc/appdirect-design-system/releases) (GitHub Release tarball). This repo does not contain design-system source.

## Setup

VPN is required for `@appdirect/design-tokens` (Artifactory). The kit itself installs from GitHub.

```bash
npm install
npm run dev
```

Open [http://localhost:3000/prototype](http://localhost:3000/prototype).

If `npm install` fails on `@appdirect/design-tokens`:

```bash
npm login --registry https://artifactory.appdirect.tools/artifactory/api/npm/npm-repo
```

## Create a page

```bash
npm run create-page -- --name "Settings" --template app-shell --layout single-column
```

Import shared components from the kit:

```tsx
import { Card, Stack, Button, TextInput, Badge } from '@appdirect/ds-prototype-kit';
```

Product-specific components go in `components/cbp/`.

## Update the design system

When a new kit ships, bump the tarball URL in `package.json` to the [latest release](https://github.com/ad-dc/appdirect-design-system/releases) and run `npm install`. Do not cherry-pick or fork `appdirect-design-system`.
