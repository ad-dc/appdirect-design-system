---
version: alpha
name: AppDirect Admin
description: Design tokens for AppDirect admin-facing web UIs built on Mantine 9. Sourced from @appdirect/design-tokens (^0.0.6) — CSS variables are the authoritative runtime values.
colors:
  # Brand + interaction
  primary: "#326FDE"            # blue.6 — A11y-compliant override of Open Color blue; --ad-color-brand-primary
  primary-hover: "#1c7ed6"      # blue.7; --ad-color-brand-primary-hover
  primary-active: "#1971c2"     # blue.8; --ad-action-primary-bg-active
  on-primary: "#f8f9fa"         # gray.0; --ad-color-brand-on-primary
  secondary: "#15aabf"          # cyan.6; --ad-action-secondary-bg (AppDirect secondary action color)
  secondary-hover: "#1098ad"    # cyan.7; --ad-action-secondary-bg-hover
  on-secondary: "#000000"       # black; --ad-action-secondary-fg (A11Y: black on cyan.6 = 7.53:1)
  # App chrome (pending tokenization)
  navy: "#011B58"               # AppDirect header/nav background — hardcoded in AppShellLayout.tsx; no --ad-* variable yet
  # Surfaces
  surface: "#ffffff"            # --ad-color-bg-default
  surface-subtle: "#f1f3f5"     # gray.1; --ad-color-bg-subtle
  surface-muted: "#e9ecef"      # gray.2; --ad-color-bg-muted
  surface-tinted: "#f1f3f5"     # gray.1; --ad-color-bg-tinted (recessed containers, e.g. SegmentedControl)
  surface-control: "#dee2e6"    # gray.3; --ad-color-bg-control (Switch unchecked track)
  # Text
  on-surface: "#000000"         # --ad-color-text-default
  on-surface-dimmed: "#868e96"  # gray.6; --ad-color-text-dimmed
  on-surface-placeholder: "#adb5bd" # gray.5; --ad-color-text-placeholder
  text-link: "#326FDE"          # blue.6; --ad-color-text-link
  text-inverse: "#f8f9fa"       # gray.0; --ad-color-text-inverse (text on dark surfaces)
  # Borders / dividers
  border: "#ced4da"             # gray.4; --ad-color-border-default
  border-subtle: "#e9ecef"      # gray.2; --ad-color-border-subtle
  border-strong: "#868e96"      # gray.6; --ad-color-border-strong
  border-primary: "#326FDE"     # blue.6; --ad-color-border-primary (focus rings, active inputs)
  # Status
  info: "#326FDE"               # blue.6; --ad-color-status-info
  on-info: "#ffffff"            # --ad-color-status-on-info
  success: "#40c057"            # green.6; --ad-color-status-success
  on-success: "#ffffff"         # --ad-color-status-on-success
  pending: "#fab005"            # yellow.6; --ad-color-status-warning (Badge/Chip/Indicator use "pending"; Alert uses "warning" — same color)
  warning: "#fab005"            # yellow.6; alert/notification-specific alias for pending
  on-warning: "#000000"         # --ad-color-status-on-warning (A11Y override: dark text on yellow bg)
  danger: "#fa5252"             # red.6; --ad-color-status-error
  on-danger: "#ffffff"          # --ad-color-status-on-error
  # State
  disabled: "#e9ecef"           # gray.2; --ad-color-state-disabled
  disabled-text: "#adb5bd"      # gray.5; --ad-color-state-disabled-text
  disabled-border: "#dee2e6"    # gray.3; --ad-color-state-disabled-border
  # Neutral scale endpoints
  neutral-0: "#f8f9fa"          # gray.0
  neutral-9: "#212529"          # gray.9
typography:
  h1:
    fontFamily: Inter
    fontSize: 34px              # --ad-headings-sizes-h1-font-size
    fontWeight: 700             # --ad-headings-font-weight
    lineHeight: 1.3             # --ad-headings-sizes-h1-line-height
  h2:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: 700
    lineHeight: 1.35
  h3:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.4
  h4:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.45
  h5:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.5
  h6:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.5
  body-lg:
    fontFamily: Inter
    fontSize: 18px              # --ad-font-sizes-lg
    fontWeight: 400             # --ad-font-weights-regular
    lineHeight: 1.6             # --ad-line-heights-lg
  body-md:
    fontFamily: Inter
    fontSize: 16px              # --ad-font-sizes-md
    fontWeight: 400
    lineHeight: 1.55            # --ad-line-heights-md
  body-sm:
    fontFamily: Inter
    fontSize: 14px              # --ad-font-sizes-sm
    fontWeight: 400
    lineHeight: 1.45            # --ad-line-heights-sm
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 600             # --ad-font-weights-medium
    lineHeight: 1
  label-sm:
    fontFamily: Inter
    fontSize: 12px              # --ad-font-sizes-xs
    fontWeight: 600
    lineHeight: 1
  code:
    fontFamily: Roboto Mono     # --ad-font-family-monospace
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
icon-sizes:
  xs: 12px                      # --ad-icon-size-xs
  sm: 14px                      # --ad-icon-size-sm
  md: 16px                      # --ad-icon-size-md (default for most inline icons)
  lg: 18px                      # --ad-icon-size-lg
  xl: 20px                      # --ad-icon-size-xl
rounded:
  none: 0px
  xs: 2px                       # --ad-radius-xs
  sm: 4px                       # --ad-radius-sm — theme defaultRadius
  md: 8px                       # --ad-radius-md
  lg: 16px                      # --ad-radius-lg
  xl: 32px                      # --ad-radius-xl
  full: 9999px
spacing:
  xxs: 4px                      # --ad-spacing-xxs (sub-scale; use for tight internal component gaps)
  xs: 10px                      # --ad-spacing-xs
  sm: 12px                      # --ad-spacing-sm
  md: 16px                      # --ad-spacing-md
  lg: 20px                      # --ad-spacing-lg
  xl: 32px                      # --ad-spacing-xl
sizing:                         # Component minimum heights (buttons, inputs, controls)
  xs: 24px                      # --ad-sizing-xs
  sm: 30px                      # --ad-sizing-sm
  md: 36px                      # --ad-sizing-md
  lg: 42px                      # --ad-sizing-lg
  xl: 50px                      # --ad-sizing-xl
shadows:
  xs: "0px 1px 3px 0px rgba(0,0,0,0.05), 0px 1px 2px 0px rgba(0,0,0,0.1)"               # --ad-shadows-xs
  sm: "0px 1px 3px 0px rgba(0,0,0,0.05), 0px 10px 15px -5px rgba(0,0,0,0.05), 0px 7px 7px -5px rgba(0,0,0,0.04)"   # --ad-shadows-sm
  md: "0px 1px 3px 0px rgba(0,0,0,0.05), 0px 20px 25px -5px rgba(0,0,0,0.05), 0px 10px 10px -5px rgba(0,0,0,0.04)" # --ad-shadows-md
  lg: "0px 1px 3px 0px rgba(0,0,0,0.05), 0px 28px 23px -7px rgba(0,0,0,0.05), 0px 12px 12px -7px rgba(0,0,0,0.04)" # --ad-shadows-lg
  xl: "0px 1px 3px 0px rgba(0,0,0,0.05), 0px 36px 28px -7px rgba(0,0,0,0.05), 0px 17px 17px -7px rgba(0,0,0,0.04)" # --ad-shadows-xl
z-index:
  app: 100                      # --ad-z-index-app (header, sidebar)
  modal: 200                    # --ad-z-index-modal
  popover: 300                  # --ad-z-index-popover
  overlay: 400                  # --ad-z-index-overlay
  max: 9999                     # --ad-z-index-max
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    typography: "{typography.label-md}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
  button-secondary:
    backgroundColor: "{colors.secondary}"   # cyan.6 — #15aabf
    textColor: "{colors.on-secondary}"      # black (A11Y: 7.53:1 contrast)
    rounded: "{rounded.sm}"
    typography: "{typography.label-md}"
  button-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    border: "{colors.border}"
    rounded: "{rounded.sm}"
    typography: "{typography.label-md}"
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    border: "{colors.primary}"
    rounded: "{rounded.sm}"
    typography: "{typography.label-md}"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-danger}"
    rounded: "{rounded.sm}"
    typography: "{typography.label-md}"
  button-link:
    backgroundColor: transparent
    textColor: "{colors.text-link}"
    rounded: "{rounded.sm}"
    typography: "{typography.label-md}"
  button-secret:
    backgroundColor: transparent
    textColor: "{colors.on-surface}"
    rounded: "{rounded.sm}"
    typography: "{typography.label-md}"
  input-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    border: "{colors.border}"
    rounded: "{rounded.sm}"
    typography: "{typography.body-sm}"
  input-focus:
    border: "{colors.border-primary}"       # primary blue on focus
  badge-info:
    backgroundColor: "{colors.info}"
    textColor: "{colors.on-info}"
    rounded: "{rounded.sm}"
    typography: "{typography.label-sm}"
  badge-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.on-success}"
    rounded: "{rounded.sm}"
    typography: "{typography.label-sm}"
  badge-pending:
    backgroundColor: "{colors.pending}"
    textColor: "{colors.on-warning}"        # black — A11Y override; same on-color as warning
    rounded: "{rounded.sm}"
    typography: "{typography.label-sm}"
  badge-warning:
    backgroundColor: "{colors.warning}"     # same value as pending (#fab005); alert context
    textColor: "{colors.on-warning}"        # black — A11Y override
    rounded: "{rounded.sm}"
    typography: "{typography.label-sm}"
  badge-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-danger}"
    rounded: "{rounded.sm}"
    typography: "{typography.label-sm}"
  tooltip:
    backgroundColor: "{colors.neutral-9}"
    textColor: "{colors.text-inverse}"
    rounded: "{rounded.sm}"
    typography: "{typography.body-sm}"
    # padding intentionally omitted — DS wrapper uses off-scale custom padding (5px 8px) to match Figma
---

# AppDirect Admin — DESIGN.md

> **Proof-of-concept.** Tokens above are mechanically derived from `design/tokens/mantine-tokens-subset.json`, `design/tokens/open-color.overrides.json`, and `styles/theme.ts`. Prose below is a starter skeleton — brand and DS leads should revise for voice, rationale, and enforcement guidance. This file is a candidate for eventual generation from `@appdirect/design-tokens`.

## Overview

AppDirect admin UIs are built for **operators doing real work on dense data**. The visual language prioritizes clarity, scannability, and low visual noise over brand flourish. Screens often carry many controls, tables, and status indicators at once, so every visual element must earn its weight. The tone is **professional, utilitarian, and quietly confident** — we use color and elevation sparingly and let typography and spacing carry most of the structure.

We extend Mantine 9's component library with a thin AppDirect Design System (DS) layer (`components/DesignSystem/`), adding accessibility-safe color choices, opinionated variants, and layout primitives (`PageContentHeader`, `DataTable`, `Shell`) tuned to admin workflows.

## Colors

The palette has four groups: brand, neutrals, status, and app chrome.

- **Primary (#326FDE)** — A11y-compliant override of Open Color's blue.6. The **one interaction color**: links, primary buttons, focus rings, active tabs. Reserve it for the single most important action on a surface. `--ad-color-brand-primary`
- **Secondary (#15aabf)** — AppDirect cyan.6. Used for secondary action buttons. Not a generic "alternate" color — use it specifically for the `secondary` Button variant. `--ad-action-secondary-bg`
- **Neutrals (gray.0–gray.9)** — Carry all page chrome: backgrounds, borders, dividers, secondary text, disabled states. Neutrals do most of the visual work.
- **Status colors (info / success / pending / danger)** — Used only on badges, alerts, and status indicators. Never as decoration. Danger is reserved for destructive outcomes and error states. `pending` is the canonical yellow status name (Badge, Chip, Indicator); `warning` is used specifically for alerts and notifications — same color (#fab005), different semantic context.
- **AppDirect Navy (#011B58)** — The app header/sidebar background color. Not yet in the `--ad-*` token system; currently hardcoded in `AppShellLayout.tsx`. Do not use this color for anything other than app chrome until it is tokenized.
- **Surface / on-surface** — Pure white surface (`--ad-color-bg-default`) with black text (`--ad-color-text-default`). Tinted surfaces (`--ad-color-bg-subtle`, `--ad-color-bg-muted`) are used for secondary areas only.

**A11Y notes:**
- `on-warning` is **black** (`#000000`), not white — yellow backgrounds fail WCAG AA with white text
- `on-secondary` is **black** (`#000000`) — cyan.6 provides 7.53:1 contrast ratio against black (AAA)
- Primary (#326FDE) on white = 4.56:1 — meets WCAG AA for normal text

### Dark mode

Dark mode tokens are fully defined in `@appdirect/design-tokens` and activate automatically when `data-theme="dark"` is set on the root `<html>` element. No in-app toggle has been implemented yet — the app currently renders light mode only. When the toggle is added, no component code changes are required; all `--ad-*` semantic variables will remap automatically.

## Typography

Two families carry the whole system:

- **Inter** — All UI text: headings, body, labels, buttons, inputs. Chosen for its legibility at small sizes and broad weight coverage.
- **Roboto Mono** — All technical data: IDs, timestamps, code, JSON payloads, CLI examples.

Scale: 6 heading levels (h1–h6), 3 body sizes (lg/md/sm), 2 label sizes (md/sm), and a monospace `code` style. Headings are Inter Bold (700); body and input text are Inter Regular (400); labels are Inter Semi-Bold (600).

**Rules of thumb:**
- Page titles: `h1` or `h2`
- Section titles: `h3`
- Card / widget titles: `h4` or `h5`
- Body content: `body-md` (16px) is the default
- Form labels, buttons, tab labels: `label-md`
- Metadata, captions, timestamps: `body-sm` or `code`

## Layout & Spacing

The spacing scale is 5 levels (xs–xl, 10–32px) built on a ~4px-aligned grid. Use spacing tokens — never raw pixel values — for padding, gap, and margin. Common patterns:

- Card interior padding: `md` (16px)
- Section gaps: `lg` (20px)
- Top-level page margins: `xl` (32px)
- Inline label-to-input gap: `xs` (10px)

Breakpoints (Mantine defaults): `xs 36em / sm 48em / md 62em / lg 75em / xl 88em`. Admin layouts assume `md+` as the primary target; below `sm` we degrade to stacked layouts but do not optimize heavily for phone viewports.

## Elevation & Depth

Depth is conveyed through a **restrained 5-level shadow scale** (xs–xl) layered over pure-white surfaces. Shadows are soft, single-color, and never used for decoration — only to establish interactive layers:

- `xs` — input focus rings, chip borders
- `sm` — hover states on cards and list items
- `md` — floating menus, popovers, dropdowns
- `lg` — modals, drawers
- `xl` — rare; reserved for critical alert overlays

For flat hierarchy (tabs, navigation, dividers) we prefer **borders and color contrast over shadows**. Tonal separation uses `surface-subtle` (#f1f3f5) and `surface-muted` (#e9ecef) against pure white.

## Shapes

A 5-step radius scale (xs 2px, sm 4px, md 8px, lg 16px, xl 32px) plus `none` and `full`. The system-wide default is `sm` (4px) — applied to all components: buttons, inputs, cards, badges, modals, drawers, menus. Do not use larger radii unless there is an explicit design reason to deviate.

**Rule:** Reserve `full` (9999px) for genuinely circular elements (avatars). Do not use it for buttons, badges, or chips — those are `sm`.

## Components

The AppDirect DS layer wraps Mantine 9 components under `components/DesignSystem/`, organized into 11 categories. All components are exported from the single barrel `@/components/DesignSystem`. **Never import raw Mantine components in app code.**

### Buttons

| Component | Key props | Notes |
|---|---|---|
| `Button` | `variant`, `size`, `loading`, `disabled`, `leftSection`, `rightSection` | Default `variant="default"`, default `size="sm"`, always `radius="sm"` |
| `ActionIcon` | `size`, `variant` | Icon-only button |
| `CloseButton` | `size` | Preconfigured dismiss button |

**Button variants:** `primary` · `secondary` · `default` · `outline` · `danger` · `link` · `secret` · `disabled`

- `primary` — blue filled (`#326FDE`); use for the single most important action per view
- `secondary` — **cyan filled (`#15aabf`)** with black text; AppDirect's secondary action color — not a neutral fallback
- `default` — white fill with gray border; general / tertiary actions
- `outline` — white fill with primary-colored border and text; alternative to default when primary context is needed without fill
- `danger` — red filled (`#fa5252`); destructive or irreversible actions
- `link` — no background, primary-colored text; inline or low-prominence actions
- `secret` — no background, no border; contextual actions that should recede visually
- `disabled` — maps to Mantine `default` variant + sets `disabled=true`; prefer passing `disabled` prop directly

**Button sizes:** `xs` · `sm` (default) · `md` · `lg` · `xl`

---

### Inputs

`TextInput` · `TextArea` · `NumberInput` · `ColorInput` · `Slider` · `Switch` · `SegmentedControl` · `Checkbox` · `Radio` · `RadioGroup` · `DropZone` · `FileInput`

All inputs default to `radius="sm"` and `size="sm"` matching the button default. Focus ring shifts border to `primary` (#326FDE).

---

### Combobox

`Select` · `SearchableSelect` · `AutocompleteClearable` · `Multiselect` · `Combobox`

`SearchableSelect` and `AutocompleteClearable` are opinionated wrappers with built-in clear affordance. Use `Multiselect` for tag-style multi-value selection.

---

### Navigation

`Tabs` · `Breadcrumb` · `BackBreadcrumb` · `NavLink` · `Stepper`

`BackBreadcrumb` is a single-step back link with a left-arrow affordance, used at the top of detail pages. `Stepper` is used for multi-step flows (onboarding, wizards).

---

### Overlays

`Modal` · `ConfirmationModal` · `Drawer` · `Menu` · `Popover` · `ConfirmationPopover` · `Tooltip`

- `ConfirmationModal` — preconfigured two-button (confirm/cancel) modal for destructive actions
- `ConfirmationPopover` — inline confirm/cancel popover; preferred over modal for lower-stakes confirmations that don't require full-screen focus
- `Menu` accepts typed `MenuItem` and `MenuSection` arrays for structured dropdowns

---

### DataDisplay

`Alert` · `Avatar` · `Badge` · `Card` · `CardSection` · `Chip` · `Pill` · `Indicator` · `Progress` · `ThemeIcon` · `List` · `Table`

**Badge:**
- Variants: `filled` (default) · `outline` · `info` · `success` · `pending` · `warning` · `danger` · `default`
- Colors: `info` · `success` · `pending` · `warning` · `danger` · `default` · `blue` · `green` · `yellow` · `red` · `gray`
- Use `pending` for in-progress/queued states; use `warning` for alert-context notifications
- Always `radius="sm"` (4px) — never pill-shaped, despite Mantine's default
- Semantic shorthand: `<Badge variant="success">` resolves color automatically; `color` prop is only needed when overriding

**Avatar:**
- Variants: `icon` (default icon) · `image` (photo with fallback) · `initials` (two-character text)
- Sizes: `xs` (16px) · `sm` (26px) · `md` (38px) · `lg` (56px) · `xl` (84px)
- Always **circular** (`radius=1000`) — this is a hardcoded DS override of Mantine's default square avatar
- Image variant supports `fallback="icon"` or `fallback="initials"` with `fallbackInitials` prop
- Default icon is `RiUser3Fill` (Remix Icons)

**ThemeIcon:** `size`, `variant`, `color`, `radius` — used to frame icons in containers (e.g. `PageContentHeader` icon slot uses `variant="outline"`, `radius="md"`, `size="xxl"`)

---

### Typography

`Title` · `Text` · `Code` · `Kbd`

`Title` maps `order` 1–6 to the heading scale above. `Code` uses Roboto Mono. `Kbd` renders keyboard shortcut chips.

---

### Misc

`Divider` · `Paper`

---

### Icons

Three icon sets are in use. Each has a distinct purpose — do not substitute one for another.

| Set | Package | Purpose |
|---|---|---|
| **Tabler** | `@tabler/icons-react` | Mantine component UI only — pre-baked affordances (Select chevron, Accordion toggle, etc.) |
| **Remix** | `@remixicon/react` | Primary set for all product UI design decisions |
| **ad-svg-icons** | `git@github.com:AppDirect/ad-svg-icons.git` | Legacy proprietary icons for specific AppDirect concepts |

**Tabler** — use exclusively for icons that are built into Mantine component internals (e.g. the double-triangle on a Select, a chevron in an Accordion or Button). These have no design selection requirement — Mantine uses them automatically. Do not use Tabler for any icon that a designer has chosen.

**Remix** (`@remixicon/react`) — the primary and growing set. When a new icon is needed for any designed UI element, look here first. The collection is actively expanded based on use-case. Browse at [remixicon.com](https://remixicon.com).

**ad-svg-icons** — legacy proprietary collection containing icons built for specific AppDirect software concepts (Quotes, Opportunities, Leads) or cases where the Remix equivalent was aesthetically inappropriate (e.g. credit card, bell). Use only when a required icon exists here and has no suitable Remix equivalent.

**Icon sizing** — always use the `--ad-icon-size-*` scale, not arbitrary pixel values:

| Token | Size | Use |
|---|---|---|
| `--ad-icon-size-xs` | 12px | Tight inline contexts (badge, chip) |
| `--ad-icon-size-sm` | 14px | Small buttons, dense list rows |
| `--ad-icon-size-md` | 16px | Default for most inline icons |
| `--ad-icon-size-lg` | 18px | Medium buttons, section headers |
| `--ad-icon-size-xl` | 20px | Large standalone icons |

Pass `size` as a number prop: `<RiArrowDownSLine size={16} />`. Do not use CSS to resize icons.

---

### Layout

`Stack` · `Inline` · `Group` · `Box` · `SimpleGrid` · `Grid` · `Flex` · `Container` · `Center`

`Inline` is the DS name for a horizontal flex row (Mantine `Group`). `Stack` is vertical. Use layout primitives exclusively — no raw `div` with inline flex/grid styles.

Figma auto-layout mapping: `flex-direction: column` → `Stack`; `flex-direction: row` → `Inline`; `grid` → `Grid`; padding-only container → `Box`.

---

### Shell

`AppShellLayout` · `HeaderBar` · `SidebarNav` · `SidebarNavLink` · `SingleColumnLayout` · `TertiaryColumnLayout`

**AppShellLayout specs:**
- Header height: **68px**
- Header background: **AppDirect Navy (`#011B58`)** — hardcoded, not a token
- Sidebar width: **300px**, breakpoint `sm`, no mobile collapse
- Main content padding: `lg` (20px)
- Nav is optional: pass `hideNav` or omit `navItems` for header-only layout

**SingleColumnLayout** — full-width content area inside `AppShellLayout`

**TertiaryColumnLayout** — 8/4 grid split: primary content + narrower right aside

---

### ComplexComponents

`PageContentHeader` · `DataTable` · `DashboardWidget` · `KeyInsight` · `NameValue` / `NameValueItem` · `CopyButton` · `DescriptionBlock`

**PageContentHeader** — the standard page/detail header. Renders as a `Card` with:
- Header: optional icon (`ThemeIcon`, 58px container), `subhead`, `title` (h3), optional `badge`, optional edit affordance
- Actions: array of `{ label, onClick, variant }` — renders as `Button` row
- Content section (one of, mutually exclusive):
  - `insights` — `KeyInsight` grid (horizontal KPI strip)
  - `description` — optional title + body text (supports `allowLinks` for HTML)
  - `descriptionBlock` — `DescriptionBlock` component (bleeds to card edges)
  - `nameValuePairs` — `NameValue` grid with configurable column count
  - `drawer` — collapsible section with Show More / Show Less toggle button

**DataTable** — built on `mantine-react-table-open`. Features:
- Cursor-based and offset pagination
- Column sorting (`enableSorting`) and filtering (`enableColumnFilter`)
- Row selection (`RowSelectionState`)
- Density control (`DensityState`)
- Custom top toolbar with filter chips, search, and date range
- Custom bottom toolbar
- Server-side data via `onPaginationChange` / `onSortingChange` callbacks
- `totalCount` for pagination display; `pageInfo` for cursor navigation

**KeyInsight** — single KPI tile: `value`, `title`, `subtitle`, optional right border divider

**NameValue / NameValueItem** — name-value pair grid; `columns` prop controls grid width

**DashboardWidget** — card with title, optional icon, optional link list, and arbitrary `children`

---

### Consumption rules

- **Always use DS components** from `@/components/DesignSystem` — never raw `@mantine/core` imports
- When a Mantine component lacks a DS wrapper, create one: `forwardRef`, typed as `DS[Name]Props extends Mantine[Name]Props`, exported through category index and main barrel
- **No Tailwind, no CSS modules, no inline `style` props** — use Mantine system props (`bg`, `c`, `w`, `h`, `p`, `m`, `radius`, `shadow`)
- For any list / grid / table use `Table` or `DataTable` from DS (not raw `@mantine/core`)
- For page headers use `PageContentHeader` from DS

### Component tokens

The `components` section in the front matter defines per-variant tokens for the most commonly overridden components (buttons, inputs, badges, tooltip). Other components inherit from Mantine defaults + the theme color/radius/spacing tokens; authoring tokens for the full component surface is an ongoing effort tracked in the `@appdirect/design-tokens` package.

## Do's and Don'ts

- **Do** use `primary` (#326FDE) for the **single most important action** per surface; default buttons everywhere else
- **Don't** use more than one primary button on a single view
- **Do** use status colors (info / success / pending / danger) for badges, chips, and indicators; use `warning` specifically for alerts and notifications
- **Don't** use status colors for decoration or emphasis in body text
- **Do** use `label-md` (Inter Semi-Bold 14px) for button labels, tab labels, and form field labels
- **Don't** use more than two type families on a screen (Inter for UI, Roboto Mono for data — that's it)
- **Do** use `rounded.sm` (4px) for all components — buttons, inputs, cards, badges, modals, drawers; `rounded.full` only for avatars
- **Don't** use `rounded.md` or larger unless explicitly required by design; don't use `rounded.full` for buttons or badges
- **Do** rely on spacing tokens (xs–xl) for all padding, gap, margin
- **Don't** use raw pixel values or ad-hoc spacing
- **Do** maintain WCAG AA contrast ratios (4.5:1 normal text, 3:1 large text) — the A11y blue (#326FDE) was chosen precisely to meet this on white
- **Don't** rely on color alone to convey meaning; always pair status colors with icons or text labels
- **Do** use shadows (xs–xl) sparingly, only to mark interactive layers
- **Don't** use shadow for decoration or to fake depth on static content

---

## `--ad-*` CSS variable reference

These variables are injected by `@appdirect/design-tokens/css/foundations.css` and are available globally. Use them in any component that needs to reference design tokens outside of Mantine system props.

### Semantic colors (light mode → dark mode)

| Variable | Light | Dark | Use |
|---|---|---|---|
| `--ad-color-bg-default` | `#ffffff` | `#2e2e2e` | Page / card background |
| `--ad-color-bg-subtle` | `#f1f3f5` | `#2e2e2e` | Secondary surface, sidebars |
| `--ad-color-bg-muted` | `#e9ecef` | `#3b3b3b` | Recessed areas |
| `--ad-color-bg-tinted` | `#f1f3f5` | `#1f1f1f` | SegmentedControl root |
| `--ad-color-text-default` | `#000000` | `#C9C9C9` | Body text |
| `--ad-color-text-dimmed` | `#868e96` | `#828282` | Secondary / muted text |
| `--ad-color-text-placeholder` | `#adb5bd` | `#696969` | Input placeholder |
| `--ad-color-text-link` | `#326FDE` | `#4dabf7` | Link text |
| `--ad-color-text-inverse` | `#f8f9fa` | `#212529` | Text on dark surfaces |
| `--ad-color-border-default` | `#ced4da` | `#424242` | Default border |
| `--ad-color-border-subtle` | `#e9ecef` | `#424242` | Subtle dividers |
| `--ad-color-border-strong` | `#868e96` | `#696969` | Emphasized borders |
| `--ad-color-border-primary` | `#326FDE` | `#1971c2` | Focus ring, active input |
| `--ad-color-brand-primary` | `#326FDE` | `#1971c2` | Brand blue |
| `--ad-color-brand-light` | blue @ 10% | blue @ 15% | Tinted brand surface |
| `--ad-color-brand-light-hover` | blue @ 33% | blue @ 20% | Hovered tinted surface |
| `--ad-color-state-disabled` | `#e9ecef` | `#2e2e2e` | Disabled background |
| `--ad-color-state-disabled-text` | `#adb5bd` | `#696969` | Disabled text |
| `--ad-color-status-info` | `#326FDE` | `#4dabf7` | Info badge/alert |
| `--ad-color-status-success` | `#40c057` | `#2f9e44` | Success badge/alert |
| `--ad-color-status-warning` | `#fab005` | `#f08c00` | Warning alert/notification (`pending` for badges/chips) |
| `--ad-color-status-error` | `#fa5252` | `#e03131` | Error/danger badge/alert |
| `--ad-action-primary-bg` | `#326FDE` | `#1971c2` | Primary button fill |
| `--ad-action-secondary-bg` | `#15aabf` | `#0c8599` | Secondary button fill |
| `--ad-action-default-bg` | `#ffffff` | `#2e2e2e` | Default button fill |
| `--ad-action-default-border` | `#ced4da` | `#424242` | Default button border |

### Scales

| Variable pattern | Values | Use |
|---|---|---|
| `--ad-spacing-{xxs\|xs\|sm\|md\|lg\|xl}` | 4 / 10 / 12 / 16 / 20 / 32px | Padding, gap, margin |
| `--ad-radius-{xs\|sm\|md\|lg\|xl}` | 2 / 4 / 8 / 16 / 32px | Border radius |
| `--ad-icon-size-{xs\|sm\|md\|lg\|xl}` | 12 / 14 / 16 / 18 / 20px | SVG icon dimensions |
| `--ad-sizing-{xs\|sm\|md\|lg\|xl}` | 24 / 30 / 36 / 42 / 50px | Component min-heights |
| `--ad-shadows-{xs\|sm\|md\|lg\|xl}` | see YAML above | Box shadows |
| `--ad-z-index-{app\|modal\|popover\|overlay\|max}` | 100 / 200 / 300 / 400 / 9999 | Stacking order |

### CSS load order

```css
@mantine/core/styles.css               /* Mantine base */
@appdirect/design-tokens/css/foundations.css  /* --ad-* variables */
@appdirect/design-tokens/css/mantine.css      /* Mantine component overrides */
```

This order is already configured in `app/layout.tsx` and `.storybook/preview.tsx`. Do not reorder.

---

## Dependencies & setup

| Package | Version | Role |
|---|---|---|
| `@mantine/core` | `^9.0.1` | Base component library |
| `@mantine/hooks` | `^9.0.1` | Utility hooks (useDisclosure, etc.) |
| `@mantine/dates` | `^9.0.1` | Date/time inputs |
| `@mantine/notifications` | `^9.0.1` | Toast notifications |
| `@mantine/dropzone` | `^9.0.1` | File drag-and-drop |
| `@appdirect/design-tokens` | `^0.0.6` | AppDirect token CSS variables (`--ad-*`) |
| `@tabler/icons-react` | `^3.33.0` | Icon library (supplementary) |
| `@remixicon/react` | `^4.6.0` | Primary icon library; default avatar icon |
| `mantine-react-table-open` | `^9.0.3` | DataTable foundation |
| `open-color` | `^1.9.1` | Base color palette (extended by `styles/theme.ts`) |
| `@fontsource-variable/inter` | `^5.2.8` | Variable Inter font |
| `@fontsource-variable/roboto-mono` | `^5.2.8` | Variable Roboto Mono font |

**Registry:** `@appdirect` scoped packages are hosted on the internal Artifactory npm registry. The `.npmrc` in this repo scopes `@appdirect` to `https://artifactory.appdirect.tools/artifactory/api/npm/npm-repo`. VPN access is required for `npm install`.

**Token CSS variables:** `@appdirect/design-tokens` injects `--ad-*` CSS custom properties used by some DS components (e.g. `var(--ad-color-text-default)`, `var(--ad-color-border-strong)`, `var(--ad-color-bg-subtle)`, `var(--ad-color-brand-light)`). These are loaded via the package's CSS imports in `app/layout.tsx` and `.storybook/preview.tsx`.

---

## Token notes

Per-token annotations that don't fit naturally into the prose sections above. The YAML front matter is generated and carries no comments — anything that needs to be remembered about a specific token belongs here.

- **`components.tooltip` padding** — intentionally omitted from the YAML. The DS Tooltip wrapper uses off-scale custom padding (5px 8px) to match Figma; this is a deliberate exception to the spacing scale.

---

## Pending work

1. **AppDirect Navy tokenization** — `#011B58` is hardcoded in `AppShellLayout.tsx`; will become `--ad-color-brand-navy` (or similar) once the brand color group is added to `@appdirect/design-tokens`
2. **Dark mode toggle** — `[data-theme="dark"]` tokens are fully defined; the app needs a toggle that sets this attribute on `<html>` and persists the preference
3. **Form composition patterns** — document label placement, required field indicators, error/validation states, help text, and field grouping conventions
4. **Page-level composition patterns** — document standard list page (PageContentHeader + DataTable) and detail page (PageContentHeader + Cards) structures with code examples
5. **Loading / empty / error states** — document how to handle async loading (Button `loading`, Progress, Skeleton), empty DataTable, and form validation errors
6. **Component token expansion** — remaining components in `@appdirect/design-tokens/tokens/components/*.json` (30+ files) not yet reflected in the `components:` YAML block
7. **Prose pass** — brand/DS leads should revise Overview + Do's-and-Don'ts sections for voice and rationale
8. **Harvest Figma component docs** — each Figma component has a `utilities/doc-section` with usage guidance; extract and merge into Components subsections
9. **Wire into tokens pipeline** — `@appdirect/design-tokens` will emit a `dist/design-spec.yaml` adapter; a `sync-design-docs` script in this repo will replace the YAML front matter automatically on `npm install`. Backlog item added to `appdirect-design-tokens/CLAUDE.md`.
