# AppDirect Prototype Kit

Next.js 16 runtime shell with an AppDirect design system (**Mantine v9**, React 19.2+), page templates for rapid prototyping, Storybook workspace, and Figma Code Connect integration.

## Quick Start: Prototyping

### 1. Set up

```bash
git clone <repo-url>
cd appdirect-design-system
npm install
npm run dev
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
npm run create-page    # Scaffold a new prototype page
npm run export-pages   # Export pages for production use
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
npm run build          # Build @appdirect/ds-prototype-kit
npm run tarball        # Create appdirect-ds-prototype-kit-<version>.tgz (offline install)
npm publish            # Publish to configured npm registry (e.g. org registry)
```

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

tools/
  create-page.js              # Page scaffold CLI
  export-page.js              # Page export CLI
  page-templates/             # Template files for scaffolding

ds-package/                   # Publishable npm package (@appdirect/ds-prototype-kit)
prototype-manifest.json       # Registry of all prototype pages
```

---

## Portability

Prototype pages are designed to be portable to `micro-ui-ts` and other React applications:

- **Page content** (components inside the template) is framework-agnostic React
- **Shell components** (AppShellLayout, HeaderBar, SidebarNav) are prototype-only and discarded during export
- **Routing** is not ported; the export generates a `CONNECTIONS.md` describing page relationships for developers to wire up in the target framework
- **DS components** can be used via the `@appdirect/ds-prototype-kit` npm package or copied directly

## Using as a Template

This repo can be used as a [GitHub template repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository). Click "Use this template" to create a new prototype project with all tooling pre-configured.

## Environment

Local Figma and MCP workflows read `FIGMA_ACCESS_TOKEN` from `.env.local`. Keep that file local-only. Use `.env.example` as the shared template.
