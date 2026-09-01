# AppDirect Prototype Kit

Next.js 16 runtime shell with an AppDirect design system (**Mantine v9**, React 19.2+), Storybook, and Figma Code Connect.

This repository is the **design-system source of truth**. You do not need write access here to prototype.

## Start a prototype (self-serve)

Designers, engineers, and PMs create **their own** GitHub repo from a thin template. The template is `ad-dc/appdirect-prototype-template`. It pins [`@appdirect/ds-prototype-kit`](https://github.com/ad-dc/appdirect-design-system/releases) (GitHub Release tarball) and does **not** contain DS source.

### GitHub UI

1. Open [ad-dc/appdirect-prototype-template](https://github.com/ad-dc/appdirect-prototype-template)
2. Click **Use this template** → **Create a new repository**
3. Create it under **your GitHub account** (or `ad-dc` if you can create org repos)
4. Clone, then:

```bash
npm install
npm run dev
```

### Terminal or Cursor agent (`/start-prototype`)

```bash
gh repo create my-prototype --template ad-dc/appdirect-prototype-template --private --clone
cd my-prototype
npm install
npm run dev
```

The kit tarball and token CSS come from GitHub Releases on this repo. Public npm covers Mantine, Next.js, and fonts. Prototype `npm install` does **not** use Artifactory or VPN.

Open [http://localhost:3000/prototype](http://localhost:3000/prototype).

Do **not** fork or “Use this template” on **this** repo (`appdirect-design-system`). That copies DS source and forces cherry-picks.

### In the prototype repo

- Pages: `npm run create-page -- --name "Settings" --template app-shell --layout single-column`
- Shared UI: `import { Button, Stack, Card } from '@appdirect/ds-prototype-kit'`
- Product widgets: `components/cbp/`
- Cursor: `/prototype-workspace` (ships in the template)
- Kit update: bump the tarball URL in `package.json` to the [latest release](https://github.com/ad-dc/appdirect-design-system/releases)

You do not need a maintainer to open a repo for you.

## Maintainer: keep the template current

When `templates/designer-prototype/` changes or a new kit tarball is released:

```bash
npm run publish-prototype-template -- --dry-run
npm run publish-prototype-template
```

That updates `ad-dc/appdirect-prototype-template` (GitHub template). Cursor: `/publish-prototype-template`.

Optional local copy from this checkout (same files, no GitHub template): `npm run create-prototype -- --name my-prototype`.

## Quick Start: Prototyping (this repo)

### 1. Set up

> **Prerequisites:** You must be connected to the AppDirect VPN. The `@appdirect/design-tokens` package is hosted on the internal Artifactory registry — `npm install` will fail without VPN access.

```bash
git clone <repo-url>
cd appdirect-design-system
npm install
npm run dev
```

The `.npmrc` in this repo scopes `@appdirect` packages to the Artifactory registry automatically. No manual registry configuration is needed beyond VPN access.

If you see a 404 or auth error on `@appdirect/design-tokens` during install, verify:
1. You are connected to the VPN
2. You are logged in to the Artifactory npm registry:
   ```bash
   npm login --registry https://artifactory.appdirect.tools/artifactory/api/npm/npm-repo
   ```

Visit `http://localhost:3000/prototype` to see the prototype index page.

### 2. Create a new page

```bash
npm run create-page -- --name "Settings" --template app-shell --layout single-column
```

Options:
- `--name` (required): Page title
- `--template`: `app-shell` (header + left nav) or `content-only` (header only). Default: `app-shell`
- `--layout`: `single-column` or `tertiary` (main + aside). Default: `single-column`
- `--icon`: Remix Icon class (e.g. `ri-settings-3-line`). Default: `ri-file-line`
- `--description`: Short description for the manifest

The CLI creates a page at `app/prototype/<slug>/page.tsx` and updates `prototype-manifest.json`.

### 3. Build your page

Edit the generated page file. All DS components are available from a single import:

```tsx
import { Card, Stack, Button, TextInput, Badge } from '@/components/DesignSystem';
```

### 4. Export for production

Export prototype pages for use in `micro-ui-ts` or other React projects:

```bash
npm run export-pages -- --out ./export
npm run export-pages -- --out ./export --pages customers,settings
```

This extracts page content, rewrites imports, and generates a `CONNECTIONS.md` describing page relationships.

---

## Page Templates

| Template | Description |
|----------|-------------|
| `app-shell` | AppDirect-branded header + left navigation sidebar + content area |
| `content-only` | AppDirect-branded header + full-width content (no sidebar) |

### Content Layouts

| Layout | Description |
|--------|-------------|
| `single-column` | Full-width content area |
| `tertiary` | Primary content + narrower right sidebar (8/4 grid split) |

---

## Core Workflows

```bash
npm run dev            # Start Next.js dev server (Turbopack)
npm run storybook      # Storybook on port 6006
npm run build          # Production build
npm run lint           # ESLint
npm run typecheck      # TypeScript check
```

### Prototyping

```bash
npm run create-page         # Scaffold a new prototype page in this repo
npm run create-prototype    # Create a per-designer prototype repo from the thin template
npm run export-pages        # Export pages for production use
```

### Figma Code Connect

```bash
npm run figma:parse
npm run figma:publish
npm run figma:unpublish
```

### DS Package

```bash
cd ds-package
npm run tarball        # appdirect-ds-prototype-kit-<version>.tgz
gh release create vX.Y.Z appdirect-ds-prototype-kit-X.Y.Z.tgz --title "vX.Y.Z"
cd ..
npm run publish-prototype-template   # pin that tarball on the self-serve GitHub template
```

---

## Maintaining `DESIGN.md`

[`DESIGN.md`](./DESIGN.md) has a generated YAML front matter block followed by a hand-authored markdown body.

- **Front matter** is sourced from `@appdirect/design-tokens/dist/design-spec.yaml` and is regenerated by the sync script. Do not edit it by hand — your changes will be overwritten on the next sync.
- **Body** (everything after the closing `---`) is the source of truth for human semantics: rationale, A11Y notes, usage guidance, do's and don'ts. Edit freely.
- For per-token annotations that don't fit the prose flow (e.g. an off-scale padding exception), use the **Token notes** appendix in the body.

```bash
npm run sync-design-docs   # Replace front matter from the installed adapter
npm run test:scripts       # Run sync script tests (node:test)
```

Run `sync-design-docs` after bumping `@appdirect/design-tokens`. The script is idempotent — running it twice on a synced file is a no-op. If the adapter file is missing (e.g. you're on an older version of the package), the script logs a warning and exits 0 without modifying `DESIGN.md`.

---

## Repo Structure

```
app/
  layout.tsx                  # Root layout with Mantine providers
  page.tsx                    # Home page demo
  prototype/
    layout.tsx                # Shared prototype layout
    page.tsx                  # Prototype index (lists all pages)
    customers/page.tsx        # Example: single-column page
    customer-detail/page.tsx  # Example: tertiary layout page

components/
  DesignSystem/
    index.ts                  # Main barrel export (~70+ components)
    config.ts                 # Design tokens
    types.ts                  # Shared types
    Buttons/                  # Button, ActionIcon, CloseButton
    Inputs/                   # TextInput, NumberInput, Switch, etc.
    Combobox/                 # Select, Multiselect, Autocomplete, etc.
    Navigation/               # Breadcrumb, NavLink, Stepper, Tabs
    Overlays/                 # Modal, Drawer, Menu, Popover, Tooltip
    DataDisplay/              # Alert, Badge, Card, Table, etc.
    Typography/               # Text, Title, Code, Kbd
    Layout/                   # Stack, Grid, Inline, Flex, etc.
    Shell/                    # AppShellLayout, HeaderBar, SidebarNav,
                              # SingleColumnLayout, TertiaryColumnLayout
    ComplexComponents/        # PageContentHeader, DataTable, NameValue, etc.
    Misc/                     # Divider, Paper
    FIGMA_PROPS_REGISTRY.md   # Component prop reference

.cursor/
  skills/start-prototype/     # Self-serve: gh repo create --template
  skills/publish-prototype-template/
  commands/start-prototype.md

tools/
  create-page.js
  create-prototype-repo.js    # Optional local scaffold
  publish-prototype-template.js  # Push thin starter to ad-dc/appdirect-prototype-template
  export-page.js
  page-templates/

templates/
  designer-prototype/         # Thin Next.js starter (source of the GitHub template)

ds-package/                   # Publishable npm package (@appdirect/ds-prototype-kit)
prototype-manifest.json       # Registry of all prototype pages
```

---

## Portability

Prototype pages are designed to be portable to `micro-ui-ts` and other React applications:

- **Page content** (components inside the template) is framework-agnostic React
- **Shell components** (AppShellLayout, HeaderBar, SidebarNav) are prototype-only and discarded during export
- **Routing** is not ported; the export generates a `CONNECTIONS.md` describing page relationships for developers to wire up in the target framework
- **DS components** in designer repos come from the `@appdirect/ds-prototype-kit` GitHub Release tarball

## Environment

Local Figma and MCP workflows read `FIGMA_ACCESS_TOKEN` from `.env.local`. Keep that file local-only. Use `.env.example` as the shared template.
