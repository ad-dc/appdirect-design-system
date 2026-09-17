# CLAUDE.md — appdirect-design-system

Repo-specific guidance for Claude Code sessions working on this project.
Supplements `~/.claude/CLAUDE.md` (user global).

## Design specification

The canonical design system spec is at [`DESIGN.md`](./DESIGN.md). Read it before touching styling, tokens, or component variants. It is the source of truth for:

- Color tokens (primary, surfaces, text, borders, status)
- Typography scale (Inter UI + Roboto Mono for code)
- Spacing, radius, shadow scales
- Per-component design tokens (Button, Input, Badge, Tooltip; more to come)

When in doubt about a styling decision, DESIGN.md wins.

## DS wins over Mantine defaults

When a DS wrapper in `components/DesignSystem/` has an explicit prop (e.g. `radius="sm"` on Badge), that prop is authoritative — NOT Mantine's underlying default. A few consequences:

- When generating design documentation, auditing styling, or producing token specs, **read the DS wrapper source**, not just the Mantine theme config (`styles/theme.ts`, `design/tokens/*.json`). Wrappers frequently add hardcoded props or inline styles that override theme values.
- If DESIGN.md and a DS wrapper disagree, **the wrapper is correct** until the wrapper is explicitly updated. Fix DESIGN.md to match.
- This rule will eventually invert once `@appdirect/design-tokens` becomes the source of truth (see that repo's plan at `~/.claude/plans/1-agreed-2-split-peppy-ullman.md`). Until then, DS wrapper code is authoritative.

## Claude Code inline previews

Inline previews rendered by Claude Code in chat (artifact blocks, React previews, etc.) import directly from `@mantine/core` and NOT from `@/components/DesignSystem`. This is a hosting constraint — the preview sandbox can't fetch the private DS package.

**Implications:**

- Inline previews show Mantine's raw behavior, NOT the DS wrapper's overrides
- If you audit a component by staring at an inline preview, **cross-check with the DS wrapper source** — the DS may apply props the preview doesn't reflect (example: DS Badge forces `radius="sm"`; Mantine default is pill-shaped; the inline preview would show pill, but real app code renders square-ish)
- Real application code MUST import from `@/components/DesignSystem`, per the `.cursor/rules` DS consumption rules

## DS consumption rules (from `.cursor/rules`)

- **Always use DS components** from `@/components/DesignSystem` — never raw Mantine imports in app/prototype pages
- **No Tailwind, no CSS modules, no inline `style` props** — use Mantine system props (`bg`, `c`, `w`, `h`, `p`, `m`, `radius`, `shadow`)
- For any data table / grid / list use `DataTable` from DS (not raw `@mantine/core`); `Table` is simple static markup
- For page headers use `PageContentHeader` from DS (AppDirect complex component, not a Mantine wrapper)
- Wrapper authoring: `.cursor/rules/ds-wrapper-authoring.mdc` (excludes `ComplexComponents/`)
- Code Connect: `.cursor/rules/figma-code-connect.mdc` (`*.figma.tsx` only)

## Fonts

Inter and Roboto Mono are loaded as **variable web fonts** via [`@fontsource-variable/inter`](https://www.npmjs.com/package/@fontsource-variable/inter) and `@fontsource-variable/roboto-mono`. They are imported at the top of:

- [`app/layout.tsx`](./app/layout.tsx) — for the runtime app
- [`.storybook/preview.tsx`](./.storybook/preview.tsx) — so stories render with the same fonts

**Do not rely on system-installed Inter.** The CSS variable `--font-inter` (defined in [`app/globals.css`](./app/globals.css)) lists `"Inter Variable"` first (the family name registered by `@fontsource-variable/inter`), then `"Inter"` and platform fallbacks. If the variable font load is removed or fails, prototypes will silently fall back to system sans-serif on machines without Inter installed.

If you add a new HTML entrypoint (e.g. a separate Vite playground), import the same two `@fontsource-variable/*` packages and `app/globals.css` so font behavior stays consistent.

## Design tokens (current state)

This repo **does** depend on `@appdirect/design-tokens@^0.0.6` from Artifactory. `package.json` lists it; `app/layout.tsx` imports `@appdirect/design-tokens/css/foundations.css` and `.../mantine.css`. VPN is required for `npm install` **in this repo**.

Prototypes do **not** use Artifactory. Token CSS is vendored in the kit tarball (`ds-package/vendor/css/`).

App theming still runs from [`styles/theme.ts`](./styles/theme.ts) (open-color palette, a11y blue override, layout spacing scale). Storybook uses that same `theme`, so stories mirror the real app.

A later tokens release can replace inlined Button/theme snapshots. Until then, **DS wrapper source** is authoritative when it disagrees with `DESIGN.md` or unused token JSON.

## See also

- `README.md` — project overview + commands
- `DESIGN.md` — canonical design spec (POC — revision pending)
- `FIGMA_CODE_CONNECT.md` — Figma Code Connect mapping docs
- `~/.claude/CLAUDE.md` — user-global Claude Code instructions
- `~/.claude/plans/1-agreed-2-split-peppy-ullman.md` — tokens repo migration plan (this app will consume the resulting `@appdirect/design-tokens` package)
