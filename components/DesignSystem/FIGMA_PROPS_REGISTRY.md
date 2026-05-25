# Figma Code Connect - Props Registry

This document defines the Figma-facing prop surface for all Design System components.
It serves as the authoritative instruction set for Figma Code Connect integration.

---

## Global Conventions

### Size Tokens

All components that accept a `size` prop use the same set of values:

| Token | Description |
|-------|-------------|
| `xs`  | Extra small |
| `sm`  | Small |
| `md`  | Medium (default for most components) |
| `lg`  | Large |
| `xl`  | Extra large |

### Semantic Color Tokens

Components expose semantic color names that map internally to Mantine colors:

| Semantic Name | Mantine Color | Usage |
|--------------|---------------|-------|
| `neutral` | `gray` | Default/inactive states |
| `info` | `blue` | Informational content |
| `success` | `green` | Positive/success states |
| `warning` | `yellow` | Caution/warning states |
| `danger` | `red` | Error/destructive states |
| `highlight` | `violet` | Accent/emphasis |

#### Status Colors (for feedback components)

| Status Name | Mantine Color | Usage |
|-------------|---------------|-------|
| `default` | `gray` | Neutral default state |
| `info` | `blue` | Information |
| `success` | `green` | Success |
| `warning` | `yellow` | Warning |
| `danger` | `red` | Error/danger |
| `pending` | `yellow` | In-progress/pending |

### Canonical Variant Tokens

Style-based variants used across components:

| Variant | Description |
|---------|-------------|
| `filled` | Solid background color |
| `outline` | Border only, no background |
| `light` | Light tinted background |
| `subtle` | Very light/transparent styling |
| `transparent` | No visible background |

---

## Component Registry

---

### Button

**Component Name:** `Button`  
**Mantine Base:** `Button`  
**Purpose:** Primary interactive element for user actions. Supports multiple visual variants for different action priorities.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'default' \| 'outline' \| 'danger' \| 'link' \| 'secret'` | No | `'default'` | Visual style variant |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'sm'` | Button size |
| `fullWidth` | `boolean` | No | `false` | Whether button spans full width |
| `disabled` | `boolean` | No | `false` | Disabled state |
| `loading` | `boolean` | No | `false` | Loading state with spinner |
| `leftSection` | `ReactNode` | No | - | Icon on the left side |
| `rightSection` | `ReactNode` | No | - | Icon on the right side |
| `children` | `ReactNode` | Yes | - | Button label text |

#### Variant to Mantine Mapping

| DS Variant | Mantine Variant | Mantine Color |
|------------|-----------------|---------------|
| `primary` | `filled` | `blue` |
| `secondary` | `filled` | `cyan` |
| `default` | `default` | (theme default) |
| `outline` | `outline` | `blue` |
| `danger` | `filled` | `red` |
| `link` | `subtle` | `blue` |
| `secret` | `subtle` | `gray` |

#### Example Configurations

- **Primary action:** `variant="primary"`, `size="sm"`
- **Secondary action:** `variant="outline"`, `size="sm"`
- **Destructive action:** `variant="danger"`, `size="sm"`
- **Text link:** `variant="link"`, `size="sm"`

---

### ActionIcon

**Component Name:** `ActionIcon`  
**Mantine Base:** `ActionIcon`  
**Purpose:** Compact icon-only button for toolbar actions, close buttons, and icon triggers.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'md'` | Icon button size |
| `disabled` | `boolean` | No | `false` | Disabled state |
| `children` | `ReactNode` | Yes | - | Icon element |

#### Notes

- Supports `default` and `link` variant mappings
- Fixed border radius of `sm`

---

### CloseButton

**Component Name:** `CloseButton`  
**Mantine Base:** `CloseButton`  
**Purpose:** Standardized close/dismiss button with consistent styling.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'md'` | Button size |
| `color` | `'black' \| 'blue'` | No | `'black'` | Icon color |
| `disabled` | `boolean` | No | `false` | Disabled state |

---

### Badge

**Component Name:** `Badge`  
**Mantine Base:** `Badge`  
**Purpose:** Compact label for status indication, categorization, or counts.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | `'filled' \| 'outline'` | No | `'filled'` | Visual style |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'md'` | Badge size |
| `color` | `'info' \| 'success' \| 'danger' \| 'pending' \| 'default'` | No | `'default'` | Semantic color |
| `hasIcon` | `boolean` | No | `false` | Show circle icon on left |
| `children` | `ReactNode` | Yes | - | Badge text |

#### Color Mapping

| DS Color | Mantine Color |
|----------|---------------|
| `info` | `blue` |
| `success` | `green` |
| `danger` | `red` |
| `pending` | `yellow` |
| `default` | `gray` |

#### Example Configurations

- **Info badge:** `color="info"`, `variant="filled"`
- **Success outline:** `color="success"`, `variant="outline"`
- **Error indicator:** `color="danger"`, `variant="filled"`, `hasIcon=true`

---

### Chip

**Component Name:** `Chip`  
**Mantine Base:** `Chip`  
**Purpose:** Selectable tag/filter element with toggle behavior.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | `'info' \| 'success' \| 'danger' \| 'pending' \| 'default'` | No | `'default'` | Semantic color variant |
| `checked` | `boolean` | No | - | Selected state |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | - | Chip size |
| `children` | `ReactNode` | Yes | - | Chip label |

#### Notes

- Always uses `outline` Mantine variant with `sm` radius
- Color is determined by the `variant` prop (which is semantic)

---

### Pill

**Component Name:** `Pill`  
**Mantine Base:** Custom (Box-based)  
**Purpose:** Non-interactive tag for displaying values, selected items in multi-selects.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'md'` | Pill size |
| `withRemoveButton` | `boolean` | No | `false` | Show close button |
| `disabled` | `boolean` | No | `false` | Disabled state |
| `children` | `ReactNode` | Yes | - | Pill content |

---

### Avatar

**Component Name:** `Avatar`  
**Mantine Base:** `Avatar`  
**Purpose:** Display user profile pictures, initials, or placeholder icons.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | `'icon' \| 'image' \| 'initials'` | Yes | - | Avatar content type |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'md'` | Avatar size |

#### Notes

- Figma exposes only the visual DS contract: `variant` and `size`
- `src`, `alt`, and `initials` remain code-owned or representational details, not Figma props

---

### Alert

**Component Name:** `Alert`  
**Mantine Base:** `Alert`  
**Purpose:** Contextual feedback messages with semantic styling.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `color` | `'info' \| 'success' \| 'danger' \| 'pending' \| 'default'` | No | `'default'` | Semantic alert color |
| `title` | `string` | No | - | Alert heading |
| `withCloseButton` | `boolean` | No | `false` | Show dismiss button |
| `children` | `ReactNode` | No | - | Alert body content |

#### Color Mapping

| DS Color | Mantine Color | Default Icon |
|----------|---------------|--------------|
| `info` | `blue` | RiInformationLine |
| `success` | `green` | RiCheckboxCircleLine |
| `danger` | `red` | RiErrorWarningLine |
| `pending` | `yellow` | RiTimeLine |
| `default` | `gray` | RiInformationLine |

---

### Card

**Component Name:** `Card`  
**Mantine Base:** `Card`  
**Purpose:** Container for related content with consistent styling.

#### Figma vs DS alignment

The Figma **Card** component does not expose surface tokens as properties; the DS component **fixes** them in code. Do not map `padding`, `radius`, `shadow`, or `withBorder` from Figma — they are not part of the DS `Card` public contract.

| Layer | What’s modeled |
|-------|----------------|
| **Figma** | Layout / content only (maps to `children` in code). |
| **DS `Card`** | Fixed: `padding="md"`, `radius="sm"`, `shadow="xs"`, `withBorder={true}`. |
| **Code-only (not in Figma)** | `interactive`, `onClick` — add in application code when needed. |

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | Yes | - | Card body content (Figma content slot → `children`) |

#### Notes

- Code Connect reads the native Figma **children** slot with `figma.slot('children')` in `Card.figma.tsx` (same pattern as Paper, Modal, Drawer, Popover).
- `Card.Section` is available in code for full-bleed sections; not a separate Figma prop in the current contract.
- **Mantine `Card` props omitted by DS:** `size`, `variant`, `padding`, `shadow`, `withBorder`, `radius` (all enforced inside `Card.tsx`).

---

### Indicator

**Component Name:** `Indicator`  
**Mantine Base:** `Indicator`  
**Purpose:** Notification dot or badge attached to another element.

#### Figma-Exposed Props

| Figma Prop | DS Prop | Mantine Prop | Type | Default | Description |
|------------|---------|--------------|------|---------|-------------|
| `variant` | `type` | `color` | `'success' \| 'danger' \| 'pending' \| 'info' \| 'default'` | `'default'` | Semantic status type. Figma `error` maps to DS `danger` |
| `size` | `size` | `size` | enum → px: xs=8, sm=12, md=16, lg=20, xl=24 | `12` (sm) | Indicator size in pixels |
| `withBorder` | `withBorder` | `withBorder` | `boolean` | `false` | Add white border outline |
| `hasLabel` | — | — | `boolean` | `false` | Figma convenience toggle for label visibility |
| `label` | `label` | `label` | `string` | — | Label text (only rendered when `hasLabel` is true) |
| — | `inline` | `inline` | `boolean` | — | Auto-set to `true` when `hasLabel` is true |

#### Notes

- `hasLabel` is a Figma-only convenience boolean; in Mantine/DS, presence of `label` controls visibility
- When `hasLabel` is true, `inline` is also set to `true` so the indicator renders as an inline element
- `position`, `disabled`, `processing`, `count`, `withOutline`, `children` remain code-owned (not exposed in current Figma component)

---

### Progress

**Component Name:** `Progress`  
**Mantine Base:** `Progress`  
**Purpose:** Visual progress bar for completion states.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `0 \| 25 \| 50 \| 75 \| 100` | Yes | - | Published progress percentage variants |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'md'` | Bar thickness |

#### Notes

- Fixed color: `blue`, fixed radius: `xl`
- Current Figma set exposes fixed value steps rather than arbitrary numeric input

---

### ThemeIcon

**Component Name:** `ThemeIcon`  
**Mantine Base:** `ThemeIcon`  
**Purpose:** Icon wrapper with background styling.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` | No | `'xs'` | Published Figma size variants for the icon container |

#### Notes

- Figma exposes only `size` for this component
- Size mapping: `xs -> xs`, `sm -> sm`, `md -> md`, `lg -> lg`, `xl -> xl`, `xxl -> xxl`
- `color`, `variant`, `radius`, and `children` remain code-owned in the current Figma contract

---

### TextInput

**Component Name:** `TextInput`  
**Mantine Base:** `TextInput`  
**Purpose:** Single-line text input field.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'md'` | Input size |
| `label` | `ReactNode` | No | - | Input label |
| `description` | `string` | No | - | Help text below input |
| `placeholder` | `string` | No | - | Placeholder text |
| `required` | `boolean` | No | `false` | Show required asterisk |
| `showOptional` | `boolean` | No | `false` | Show "(Optional)" text |
| `error` | `ReactNode` | No | - | Error message |
| `disabled` | `boolean` | No | `false` | Disabled state |
| `leftSection` | `ReactNode` | No | - | Left section icon |
| `rightSection` | `ReactNode` | No | - | Right section icon |

---

### TextArea

**Component Name:** `TextArea`  
**Mantine Base:** `Textarea`  
**Purpose:** Multi-line text input field.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | - | Input size |
| `label` | `ReactNode` | No | - | Input label |
| `description` | `string` | No | - | Help text |
| `placeholder` | `string` | No | - | Placeholder text |
| `required` | `boolean` | No | `false` | Show required asterisk |
| `showOptional` | `boolean` | No | `false` | Show "(Optional)" text |
| `error` | `ReactNode` | No | - | Error message |
| `rows` | `number` | No | - | Number of visible rows |
| `autosize` | `boolean` | No | - | Auto-grow height |
| `minRows` | `number` | No | - | Minimum rows for autosize |
| `maxRows` | `number` | No | - | Maximum rows for autosize |

---

### NumberInput

**Component Name:** `NumberInput`  
**Mantine Base:** `NumberInput`  
**Purpose:** Numeric input with increment/decrement controls.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | - | Input size |
| `label` | `ReactNode` | No | - | Input label |
| `description` | `string` | No | - | Help text |
| `placeholder` | `string` | No | - | Placeholder text |
| `required` | `boolean` | No | `false` | Show required asterisk |
| `showOptional` | `boolean` | No | `false` | Show "(Optional)" text |
| `error` | `ReactNode` | No | - | Error message |
| `min` | `number` | No | - | Minimum value |
| `max` | `number` | No | - | Maximum value |
| `step` | `number` | No | - | Increment step |

---

### Checkbox

**Component Name:** `Checkbox`  
**Mantine Base:** `Checkbox`  
**Purpose:** Binary selection control.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'md'` | Checkbox size |
| `label` | `ReactNode` | No | - | Checkbox label |
| `checked` | `boolean` | No | - | Checked state |
| `indeterminate` | `boolean` | No | `false` | Indeterminate state |
| `disabled` | `boolean` | No | `false` | Disabled state |
| `required` | `boolean` | No | `false` | Show required asterisk |

---

### Radio

**Component Name:** `Radio`  
**Mantine Base:** `Radio`  
**Purpose:** Single selection from a group of options.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'md'` | Radio size |
| `label` | `ReactNode` | No | - | Radio label |
| `value` | `string` | Yes | - | Radio value |
| `disabled` | `boolean` | No | `false` | Disabled state |
| `required` | `boolean` | No | `false` | Show required asterisk |

---

### Switch

**Component Name:** `Switch`  
**Mantine Base:** `Switch`  
**Purpose:** Toggle control for on/off states.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | - | Switch size |
| `label` | `ReactNode` | No | - | Switch label |
| `checked` | `boolean` | No | - | On/off state |
| `disabled` | `boolean` | No | `false` | Disabled state |
| `showOptional` | `boolean` | No | `false` | Show "(Optional)" text |
| `onLabel` | `string` | No | - | Text shown when on |
| `offLabel` | `string` | No | - | Text shown when off |

#### Notes

- Fixed color: `green`, fixed radius: `xl`

---

### Slider

**Component Name:** `Slider`
**Mantine Base:** `Slider`
**Purpose:** Range input for selecting a numeric value by dragging a thumb along a track.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| (none) | - | - | - | No Figma property bindings; static example only |

#### Notes

- Fixed `thumbSize={16}` and `defaultValue={40}` in Code Connect example
- Component supports full Mantine Slider API at runtime

---

### SegmentedControl

**Component Name:** `SegmentedControl`
**Mantine Base:** `SegmentedControl`
**Purpose:** Inline toggle between a fixed set of options, visually similar to a button group.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'sm'` | Control size |
| `segment3` | `boolean` | No | `false` | Show third segment |
| `segment4` | `boolean` | No | `false` | Show fourth segment |
| `segment5` | `boolean` | No | `false` | Show fifth segment |

#### Notes

- Segments 1 and 2 are always visible; segments 3-5 are toggled via boolean Figma properties
- `data` array is built dynamically based on visibility flags

---

### ColorInput

**Component Name:** `ColorInput`
**Mantine Base:** `ColorInput`
**Purpose:** Color picker input with swatch preview and hex/rgb format support.

#### Figma Structure

The Figma ColorInput component wraps a nested `Input/Text Input` instance. All props are read via `figma.nestedProps('Input/Text Input', { ... })`.

#### Figma-Exposed Props (via nestedProps from Input/Text Input)

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'sm'` | Input size |
| `state` | `'default' \| 'filled' \| 'disabled' \| 'error'` | No | `'default'` | Input state |
| `label` | `string` | No | - | Input label |
| `description` | `string` | No | - | Help text (visible when `hasDescription` is true) |
| `required` | `boolean` | No | `false` | Show required asterisk |
| `showOptional` | `boolean` | No | `false` | Show "(Optional)" text |
| `hasHelpIcon` | `boolean` | No | `false` | Show help icon |
| `placeholder` | `string` | No | - | Placeholder text (state=default) |
| `value` | `string` | No | - | Input value (state=filled/disabled/error) |
| `error` | `string` | No | - | Error caption text |

#### Notes

- Fixed `format="hex"` in Code Connect example
- Left section shows color swatch preview

---

### Select

**Component Name:** `Select`  
**Mantine Base:** `Select`  
**Purpose:** Single selection dropdown. Thin DS wrapper over Mantine's opinionated Select (which itself wraps Combobox). For advanced use cases, use `SearchableSelect` or build on Combobox directly.

#### Figma Structure

The Figma Select component is a single component wrapping a nested `Input/Text Input` instance. All props are read via `figma.nestedProps('Input/Text Input', { ... })`. The right section is fixed to `IconSelector` (⬍).

#### Figma-Exposed Props (via nestedProps from Input/Text Input)

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'sm'` | Input size |
| `state` | `'default' \| 'filled' \| 'disabled' \| 'error'` | No | `'default'` | Input state (maps to disabled/error/placeholder/value) |
| `label` | `string` | No | - | Input label |
| `placeholder` | `string` | No | - | Placeholder text (state=default) |
| `value` | `string` | No | - | Input value (state=filled/disabled/error) |
| `hasDescription` | `boolean` | No | `false` | Toggle description visibility |
| `description` | `string` | No | - | Help text below label |
| `required` | `boolean` | No | `false` | Show required asterisk |
| `showOptional` | `boolean` | No | `false` | Show "(Optional)" text |
| `hasHelpIcon` | `boolean` | No | `false` | Show ⓘ icon in right section |
| `error` | `string` | No | - | Error caption text |

#### DS-Only Props (not in Figma)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Array` | - | Options array (runtime) |
| `borderless` | `boolean` | `false` | Maps to `variant="unstyled"` |
| `searchable` | `boolean` | `false` | Enable search filtering |
| `clearable` | `boolean` | `false` | Allow clearing selection |
| `errorCaption` | `string` | - | Error message for `error={true}` |
| `helpIconLabel` | `string` | - | Tooltip text for help icon |

---

### Combobox

**Component Name:** `Combobox`  
**Mantine Base:** `Select` (via DS Select)  
**Purpose:** Single selection dropdown — identical to Select. Exists as a separate Figma Code Connect identity for the `Ⓜ️ ComboBox` Figma component.

#### Figma Structure

Same as Select. The Figma Combobox component wraps a nested `🧰 Input/Text Input` instance. All props are read via `figma.nestedProps('🧰 Input/Text Input', { ... })`. Right section is fixed to `IconSelector` (⬍).

#### Figma-Exposed Props

Same prop surface as Select — see Select entry above.

---

### Multiselect

**Component Name:** `Multiselect`  
**Mantine Base:** `Combobox` (custom)  
**Purpose:** Multiple selection with pills display.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'md'` | Input size |
| `label` | `string` | No | - | Input label |
| `placeholder` | `string` | No | - | Placeholder text |
| `description` | `string` | No | - | Help text |
| `error` | `string` | No | - | Error message |
| `required` | `boolean` | No | `false` | Required state |
| `showOptional` | `boolean` | No | `false` | Show "(Optional)" |
| `disabled` | `boolean` | No | `false` | Disabled state |
| `maxDisplayedValues` | `number` | No | `2` | Max pills before "+X more" |
| `data` | `Array` | Yes | - | Options array |

---

### Modal

**Component Name:** `Modal`  
**Mantine Base:** `Modal`  
**Purpose:** Dialog overlay for focused interactions.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | No | - | Modal title |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'md'` | Modal width |
| `withCloseButton` | `boolean` | No | `true` | Show close button |
| `children` | `ReactNode` | Yes | - | Native Figma slot for modal body content |

---

### Drawer

**Component Name:** `Drawer`  
**Mantine Base:** `Drawer`  
**Purpose:** Sliding panel overlay from screen edge.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `ReactNode` | No | - | Drawer title |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'md'` | Drawer width token |
| `opened` | `boolean` | Yes | - | Open/closed state |
| `withCloseButton` | `boolean` | No | `true` | Show close button |
| `children` | `ReactNode` | Yes | - | Native Figma slot for drawer content |

#### Size Mapping

| DS Size | Width (px) |
|---------|------------|
| `xs` | 320 |
| `sm` | 400 |
| `md` | 500 |
| `lg` | 600 |
| `xl` | 720 |

#### Notes

- Current DS and Figma support only `position="right"` for Drawer

---

### Tooltip

**Component Name:** `Tooltip`  
**Mantine Base:** `Tooltip`  
**Purpose:** Contextual information on hover.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `ReactNode` | Yes | - | Tooltip content |
| `position` | Position type | No | `'top'` | Tooltip placement |
| `disabled` | `boolean` | No | `false` | Disable tooltip |
| `withArrow` | `boolean` | No | `true` | Show arrow pointer |
| `openDelay` | `number` | No | `0` | Delay before showing (ms) |
| `closeDelay` | `number` | No | `0` | Delay before hiding (ms) |
| `width` | `number \| 'auto'` | No | `'auto'` | Fixed width |
| `children` | `ReactNode` | Yes | - | Trigger element |

#### Notes

- Fixed dark theme: `#212529` background, white text

---

### Popover

**Component Name:** `Popover`  
**Mantine Base:** `Popover`  
**Purpose:** Floating panel anchored to trigger element.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `position` | `'top' \| 'left' \| 'right' \| 'bottom' \| 'none'` | No | `'bottom'` | Popover placement in Figma; `none` maps to `position=\"bottom\"` with no arrow |
| `children` | `ReactNode` | Yes | - | Native Figma slot for popover body content |

#### Figma Structure

The Popover component exposes `children` as a native Figma slot and Code Connect reads it with `figma.slot('children')`.

#### Notes

- `withArrow` is derived from the `position` variant: `top`, `bottom`, `left`, and `right` map to `withArrow={true}`, while `none` maps to `withArrow={false}`
- The trigger is a fixed example in Code Connect: `<Button variant="outline">Open popover</Button>`
- Native slots are referenced by name in Dev Mode; Code Connect does not traverse slot contents to generate inline child code

---

### Menu

**Component Name:** `Menu`  
**Mantine Base:** `Menu`  
**Purpose:** Dropdown menu for actions and navigation.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `content` | `ReactNode` | Yes | - | Opened dropdown content rendered inside `Menu.Dropdown` |

#### Composition Notes

- Preferred mapping is Mantine-aligned composition: `Menu`, `Menu.Dropdown`, `Menu.Item`, `Menu.Label`
- Figma only models the static opened menu surface; trigger and interaction remain code-owned
- `Menu.Item` exposes `text`, `leftSection`, `rightSection`, and `state` (`default` / `active`)
- `Menu.Label` exposes `text`
- `Menu.Divider` is intentionally excluded from the current Figma contract

---

### Tabs

**Component Name:** `Tabs`  
**Mantine Base:** `Tabs`  
**Purpose:** Tabbed interface for switching between views.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `tabs` | `TabData[]` | Yes | - | Tab definitions |
| `value` | `string` | No | - | Active tab ID |
| `orientation` | `'horizontal' \| 'vertical'` | No | `'horizontal'` | Tab layout |
| `variant` | `'default' \| 'outline' \| 'pills'` | No | `'default'` | Tab style |

---

### Stepper

**Component Name:** `Stepper`  
**Mantine Base:** `Stepper`  
**Purpose:** Multi-step progress indicator and navigation. Thin wrapper matching core Mantine children-based API.

#### Figma-Exposed Props (Stepper container — core `StepperProps`)

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `active` | `number` | Yes | - | Active step index (0-based) |
| `orientation` | `'horizontal' \| 'vertical'` | No | `'horizontal'` | Stepper layout |
| `hasContent` | `boolean` | No | `true` | Toggles current step content area |
| `content` | `string` | No | - | Current step content text (shown when `hasContent` is true) |

#### Figma-Exposed Props (Stepper.Step — core `StepperStepProps`)

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `ReactNode` | No | - | Step label |
| `description` | `ReactNode` | No | - | Step description |

#### Figma Step Visibility (Code Connect only)

| Figma Property | Type | Description |
|---------------|------|-------------|
| `step3` | `boolean` | Toggles step 3 visibility |
| `step4` | `boolean` | Toggles step 4 visibility |
| `step5` | `boolean` | Toggles step 5 visibility |
| `step6` | `boolean` | Toggles step 6 visibility |
| `step7` | `boolean` | Toggles step 7 visibility |
| `step8` | `boolean` | Toggles step 8 visibility |
| `step9` | `boolean` | Toggles step 9 visibility |
| `step10` | `boolean` | Toggles step 10 visibility |

Steps 1 and 2 are always visible. Steps 3-10 are toggled via boolean properties. Each step layer (`Step 1` through `Step 10`) exposes `label` and `description` text properties via `figma.nestedProps`.

---

### Breadcrumb

**Component Name:** `Breadcrumb`  
**Mantine Base:** `Breadcrumbs`  
**Purpose:** Hierarchical navigation path display.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `BreadcrumbItem[]` | Yes | - | Breadcrumb items |
| `separator` | `ReactNode` | No | `'/'` | Item separator |

---

### NavLink

**Component Name:** `NavLink`  
**Mantine Base:** `NavLink`  
**Purpose:** Navigation item for sidebars and menus.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `string` | Yes | - | Link label |
| `description` | `string` | No | - | Secondary text |
| `icon` | `ReactNode` | No | - | Left icon |
| `hasChildren` | `boolean` | No | `false` | Show chevron |
| `active` | `boolean` | No | `false` | Active state |
| `href` | `string` | No | - | Navigation URL |

---

### Text

**Component Name:** `Text`  
**Mantine Base:** `Text`  
**Purpose:** Body text with consistent styling.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'sm'` | Font size |
| `c` | `string` | No | - | Text color |
| `fw` | `number \| string` | No | - | Font weight |
| `ta` | `'left' \| 'center' \| 'right'` | No | - | Text alignment |
| `children` | `ReactNode` | Yes | - | Text content |

---

### Title

**Component Name:** `Title`  
**Mantine Base:** `Title`  
**Purpose:** Heading text with semantic HTML levels.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `order` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | No | `2` | Heading level (h1-h6) |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | - | Override font size |
| `children` | `ReactNode` | Yes | - | Heading content |

---

### Code

**Component Name:** `Code`  
**Mantine Base:** `Code`  
**Purpose:** Inline code text styling.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'sm'` | Font size |
| `children` | `ReactNode` | Yes | - | Code content |

---

### Kbd

**Component Name:** `Kbd`  
**Mantine Base:** `Kbd`  
**Purpose:** Keyboard shortcut display.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'sm'` | Key size |
| `content` | `string` | Yes | - | Keyboard shortcut text rendered as React children |

#### Notes

- Figma exposes `content` for handoff convenience, and Code Connect renders it into React children

---

### Divider

**Component Name:** `Divider`  
**Mantine Base:** `Divider`  
**Purpose:** Visual separator between content sections.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | No | `'horizontal'` | Divider direction |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'sm'` | Line thickness |

#### Notes

- Fixed color: `gray.4`
- The root published Figma set covers both horizontal and vertical variants

---

### Paper

**Component Name:** `Paper`  
**Mantine Base:** `Paper`  
**Purpose:** Surface container with optional elevation.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `shadow` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'none'` | Elevation level |
| `border` | `boolean` | No | `false` | Toggle surface border |
| `children` | `ReactNode` | Yes | - | Native Figma slot mapped to React `children` |

#### Notes

- Padding follows Mantine Core — pass any Mantine system prop (`p`, `px`, `py`, etc.) to control it; not exposed via Figma
- The DS wrapper accepts Mantine-style `shadow` / `withBorder`; legacy `variant` remains as a compatibility alias in code only

---

### Stack

**Component Name:** `Stack`  
**Mantine Base:** `Stack`  
**Purpose:** Vertical layout primitive with consistent spacing.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `gap` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` | No | `'md'` | Vertical spacing |
| `align` | Alignment type | No | `'stretch'` | Cross-axis alignment |
| `justify` | Justification type | No | `'flex-start'` | Main-axis distribution |
| `children` | `ReactNode` | Yes | - | Stack items |

---

### Inline

**Component Name:** `Inline`  
**Mantine Base:** `Group`  
**Purpose:** Horizontal layout primitive with consistent spacing.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `gap` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` | No | `'md'` | Horizontal spacing |
| `align` | Alignment type | No | `'center'` | Cross-axis alignment |
| `justify` | Justification type | No | `'flex-start'` | Main-axis distribution |
| `wrap` | `'nowrap' \| 'wrap' \| 'wrap-reverse'` | No | `'wrap'` | Wrap behavior |
| `children` | `ReactNode` | Yes | - | Inline items |

---

### List

**Component Name:** `List`  
**Mantine Base:** `List`  
**Purpose:** Semantic list with consistent styling.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'md'` | Text size |
| `spacing` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'sm'` | Item spacing |
| `type` | `'ordered' \| 'unordered'` | No | `'unordered'` | List type |
| `icon` | `ReactNode` | No | - | Custom bullet icon |

---

### Table

**Component Name:** `Table`  
**Mantine Base:** `Table`  
**Purpose:** Simple data table with compound components.

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `striped` | `boolean` | No | - | Alternating row colors |
| `highlightOnHover` | `boolean` | No | - | Row hover effect |
| `withBorder` | `boolean` | No | - | Outer border |
| `withColumnBorders` | `boolean` | No | - | Column borders |

#### Notes

- Fixed spacing: `horizontalSpacing="sm"`, `verticalSpacing="xs"`
- Compound components: `Table.Thead`, `Table.Tbody`, `Table.Tr`, `Table.Th`, `Table.Td`

---

### DataTable

**Component Name:** `DataTable`  
**Mantine Base:** `mantine-react-table-open` (`useMantineReactTable` + `MantineReactTable`)  
**Purpose:** Full-featured data table with pagination, sorting, filtering, row selection, density controls, and error/empty states. Wraps Mantine React Table with custom toolbars and DS styling.

#### Figma vs DS alignment

The Figma **Datatable** component is a visual spec with a `children` slot containing a table example. It does not expose configurable properties — the DataTable is entirely **configuration-driven in code**. Sub-components within the table (Badge, Checkbox, Button, TextInput, Select, Chip, etc.) are already code-connected individually.

| Layer | What's modeled |
|-------|----------------|
| **Figma** | Visual reference only. `children` slot contains an example table layout for designers to copy and customize. |
| **DS `DataTable`** | Full MRT configuration: columns, pagination, sorting, filtering, selection, density, toolbars, error/empty states. |
| **Code-only** | `columns`, `data`, `pageInfo`, all callbacks (`onPaginationChange`, `onSortChange`, `onFiltersChange`, `onRowSelectionChange`), `isLoading`, `isError`, `onRetry`. |

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | Yes | - | Native Figma slot containing the table example layout |

#### Code Connect

- **Static boilerplate** — no `figma.enum` / `figma.boolean` bindings
- `children` → `figma.slot('children')` for the visual content slot
- File: `ComplexComponents/DataTable/DataTable.figma.tsx`

#### DS API Surface (all code-owned)

| Category | Prop | Type | Default | Description |
|----------|------|------|---------|-------------|
| Data | `data` | `T[]` | - | Row data array |
| Data | `columns` | `MRT_ColumnDef<T>[]` | - | Column definitions |
| Data | `totalCount` | `number` | `0` | Total rows across all pages |
| Loading | `isLoading` | `boolean` | `false` | Loading state |
| Loading | `isError` | `boolean` | `false` | Error state |
| Loading | `error` | `string` | - | Error message |
| Loading | `onRetry` | `() => void` | - | Retry callback |
| Pagination | `pageInfo` | `PageInfo` | - | Cursor-based pagination info |
| Pagination | `onPaginationChange` | `(state) => void` | - | Page change callback |
| Pagination | `defaultPageSize` | `number` | `10` | Rows per page |
| Selection | `onRowSelectionChange` | `(state) => void` | - | Selection callback |
| Sorting | `onSortChange` | `(field, dir) => void` | - | Sort change callback |
| Filters | `filtersState` | `Filters` | `{}` | Current filter state |
| Filters | `onFiltersChange` | `(filters) => void` | - | Filter change callback |
| Filters | `locale` | `string` | `'en'` | i18n locale |
| Toggles | `showFilters` | `boolean` | `true` | Show filter panel |
| Toggles | `showSearch` | `boolean` | `true` | Show search input |
| Toggles | `showDensityToggle` | `boolean` | `true` | Show density control |
| Toggles | `showFullScreenToggle` | `boolean` | `true` | Show fullscreen control |
| UI | `defaultDensity` | `DensityState` | `'xs'` | Default row density |
| Style | `mantineTableContainerProps` | `Record` | `{}` | Container overrides |
| Style | `mantinePaperProps` | `Record` | `{}` | Paper wrapper overrides |

#### Notes

- Import `DataTable` from `@/components/DesignSystem` — do NOT use `mantine-react-table-open` directly for UI (use `DataTable`; use the package only for column types if needed)
- The DS component handles custom top/bottom toolbars, sortable headers, error overlay, and alert banners internally
- Column definitions use `MRT_ColumnDef<T>` from `mantine-react-table-open` (import from that package or define columns inline)
- Pagination is cursor-based (`pageInfo` with `startCursor`/`endCursor`), matching the AppDirect GraphQL API pattern
- Reference implementation: `micro-ui-ts/src/components/Table/`

---

### DropZone

**Component Name:** `DropZone`  
**Mantine Base:** `Dropzone` (`@mantine/dropzone`)  
**Purpose:** File upload area with drag-and-drop support.

#### Figma vs DS alignment

Code Connect maps the **DS** `DropZone` in `Inputs/DropZone.tsx` (not raw Mantine `Dropzone`). Icons, `Inline` layout, and idle/accept/reject states are fixed in code.

| Layer | What’s modeled |
|-------|----------------|
| **Figma** | Copy: `title`, `description` (via `figma.string`). |
| **DS `DropZone`** | Wraps Mantine `Dropzone` with default `maxSize`, `accept`, and built-in UI. |
| **Code-only / defaults** | `maxSize`, `accept`, `onDrop`, `onReject` — set in app code; defaults match `DropZone.tsx`. |

#### Figma-Exposed Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | No | `"This is the title"` | Main heading text |
| `description` | `string` | No | (see DS default) | Secondary text |

#### Code Connect

- `title` → `figma.string('title')`
- `description` → `figma.string('description')`
- File: `Inputs/DropZone.figma.tsx`

#### Notes (DS API; not driven by Figma in current mapping)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxSize` | `number` | `5 * 1024 ** 2` | Max file size in bytes |
| `accept` | `string[] \| Record<...>` | `IMAGE_MIME_TYPE` | Accepted MIME types |

---

## Global Registry Summary

| Component | Category | Key Props | Default Size | Default Variant |
|-----------|----------|-----------|--------------|-----------------|
| Button | Buttons | variant, size, loading, disabled | sm | default |
| ActionIcon | Buttons | size, disabled | md | - |
| CloseButton | Buttons | size, color, disabled | md | - |
| Badge | DataDisplay | color, variant, size | md | filled |
| Chip | DataDisplay | variant, checked, size | - | default |
| Pill | DataDisplay | size, withRemoveButton | md | - |
| Avatar | DataDisplay | variant, size, src/initials | md | - |
| Alert | DataDisplay | type, title, withCloseButton | - | default |
| Card | DataDisplay | children (slot); fixed surface in code | - | - |
| Indicator | DataDisplay | variant→type, size, withBorder, hasLabel/label, inline | sm | default |
| Progress | DataDisplay | value, size, animated | md | - |
| ThemeIcon | DataDisplay | size, color | md | default |
| TextInput | Inputs | size, label, required, error | md | - |
| TextArea | Inputs | size, label, required, error | - | - |
| NumberInput | Inputs | size, label, min/max | - | - |
| Checkbox | Inputs | size, label, checked, disabled | md | - |
| Radio | Inputs | size, label, value | md | - |
| Switch | Inputs | size, label, checked | - | - |
| Slider | Inputs | (static example) | - | - |
| SegmentedControl | Inputs | size, segment3-5 | sm | - |
| ColorInput | Inputs | size, state, label, required, showOptional | sm | - |
| Select | Combobox | size, state, label, required, showOptional | sm | - |
| Combobox | Combobox | size, state, label, required, showOptional | sm | - |
| Multiselect | Combobox | size, label, data | md | - |
| Modal | Overlays | title, size, actions | md | - |
| Drawer | Overlays | title, size, position | md | - |
| Tooltip | Overlays | label, position | - | - |
| Popover | Overlays | position, content | - | - |
| Menu | Overlays | sections, trigger | - | - |
| Tabs | Navigation | tabs, variant, orientation | - | default |
| Stepper | Navigation | orientation, hasContent, content, step3-10 | md | horizontal |
| Breadcrumb | Navigation | items | - | - |
| NavLink | Navigation | label, icon, active | - | - |
| Text | Typography | size, children | sm | - |
| Title | Typography | order, size, children | - | - |
| Code | Typography | size, children | sm | - |
| Kbd | Typography | size, children | sm | - |
| Divider | Misc | orientation, size | sm | - |
| Paper | Misc | variant | - | default |
| Stack | Layout | gap, align, justify | md | - |
| Inline | Layout | gap, align, justify, wrap | md | - |
| List | Layout | size, spacing, type | md | - |
| Table | Layout | striped, highlightOnHover | - | - |
| DataTable | ComplexComponents | static boilerplate; columns/data/pagination/filters all code-owned | - | - |
| DropZone | Inputs | title, description; maxSize/accept default in code | - | - |

---

## Implementation Notes for Figma Code Connect

### Using figma.string() for Text Props

Per project memory [[memory:3372238]], use `figma.string('propertyName')` instead of `figma.textContent()` for mapping text content from Figma components to React props.

### Icon Placeholders

Per project memory [[memory:3246643]], use a single Remix icon (e.g., `RiCircleLine`) as a placeholder for icons instead of falling back to Tailwind classes when generating code.

### Mapping Examples

// Example Button figma.tsx
figma.connect(Button, 'figma-node-id', {
  props: {
    variant: figma.enum('Variant', {
      'Primary': 'primary',
      'Secondary': 'secondary',
      'Outline': 'outline',
      'Danger': 'danger',
    }),
    size: figma.enum('Size', {
      'Small': 'sm',
      'Medium': 'md',
      'Large': 'lg',
    }),
    disabled: figma.boolean('Disabled'),
    loading: figma.boolean('Loading'),
    children: figma.string('Label'),
  },
  example: (props) => <Button {...props} />,
});

// Example Badge figma.tsx
figma.connect(Badge, 'figma-node-id', {
  props: {
    color: figma.enum('Color', {
      'Default': 'default',
      'Info': 'info',
      'Success': 'success',
      'Danger': 'danger',
      'Pending': 'pending',
    }),
    variant: figma.enum('Variant', {
      'Filled': 'filled',
      'Outline': 'outline',
    }),
    children: figma.string('Label'),
  },
  example: (props) => <Badge {...props} />,
});---

---

## Shell & Page Template Components

These components provide the prototype application chrome and content layout structure. They are **not** ported to production -- they exist for prototyping context only.

---

### AppShellLayout

**Component Name:** `AppShellLayout`  
**Purpose:** Top-level prototype shell with AppDirect-branded header and optional left navigation sidebar. Wraps Mantine `AppShell`.

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | Yes | - | Page content |
| `title` | `string` | No | `'Prototype'` | Application name shown in header |
| `navItems` | `NavItem[]` | No | `[]` | Navigation items for the left sidebar |
| `hideNav` | `boolean` | No | `false` | Hide the sidebar for header-only layout |

#### NavItem Shape

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | `string` | Yes | Display text |
| `icon` | `string` | Yes | Remix Icon class (e.g. `ri-home-4-line`) |
| `href` | `string` | No | Route path for navigation |
| `active` | `boolean` | No | Highlight as current page |
| `color` | `string` | No | Icon color (default: `dark`) |

#### Templates

- **Full app shell:** `<AppShellLayout navItems={[...]} title="App Name">{content}</AppShellLayout>`
- **Header only:** `<AppShellLayout title="App Name" hideNav>{content}</AppShellLayout>`

---

### HeaderBar

**Component Name:** `HeaderBar`  
**Purpose:** AppDirect-branded header bar with logo and title. Used internally by `AppShellLayout`.

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | No | `'Prototype'` | Title displayed in the header |

---

### SidebarNav

**Component Name:** `SidebarNav`  
**Purpose:** Left navigation sidebar with icon links. Used internally by `AppShellLayout`.

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `navItems` | `NavItem[]` | Yes | - | Navigation items to render |
| `title` | `string` | Yes | - | Section title above the nav links |

---

### SingleColumnLayout

**Component Name:** `SingleColumnLayout`  
**Purpose:** Full-width single-column content area. Use inside `AppShellLayout` for standard pages.

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | Yes | - | Page content |
| `gap` | `string` | No | `'lg'` | Vertical gap between sections |

---

### TertiaryColumnLayout

**Component Name:** `TertiaryColumnLayout`  
**Purpose:** Two-column content layout with primary area and narrower aside panel.

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `main` | `ReactNode` | Yes | - | Primary content (left, wider) |
| `aside` | `ReactNode` | Yes | - | Side panel content (right, narrower) |
| `mainSpan` | `number` | No | `8` | Column span for main area (out of 12) |

---

## Page Composition Patterns

This section provides patterns for assembling DS components into prototype pages. These serve as guidance for both human developers and AI-driven code generation.

### Pattern 1: Single Column with Data List

A standard page with a header, key metrics, and a list of items.

```tsx
import {
  AppShellLayout, SingleColumnLayout, PageContentHeader,
  Card, Badge, Inline, Stack, Text, Title, Breadcrumb,
  type NavItem,
} from '@/components/DesignSystem';

const navItems: NavItem[] = [
  { label: 'Page Name', icon: 'ri-file-line', href: '/prototype/page-name', active: true },
];

export default function ExamplePage() {
  return (
    <AppShellLayout navItems={navItems} title="App Name">
      <SingleColumnLayout>
        <Breadcrumb items={[{ label: 'Prototypes', href: '/prototype' }, { label: 'Page Name' }]} />
        <PageContentHeader
          title="Page Title"
          subhead="Description"
          badge="Prototype"
          contentSection="insights"
          insights={[
            { value: 42, title: 'Metric A' },
            { value: '$1,200', title: 'Metric B' },
          ]}
        />
        <Card>
          <Stack gap="xs">
            {/* Repeat rows */}
            <Inline justify="space-between" align="center">
              <Stack gap={0}>
                <Title order={5}>Item Name</Title>
                <Text size="sm" c="dimmed">Subtitle</Text>
              </Stack>
              <Badge color="success">Status</Badge>
            </Inline>
          </Stack>
        </Card>
      </SingleColumnLayout>
    </AppShellLayout>
  );
}
```

### Pattern 2: Detail Page with Side Panel

A detail/profile page using `TertiaryColumnLayout` with key-value pairs and action buttons.

```tsx
import {
  AppShellLayout, TertiaryColumnLayout, PageContentHeader,
  Card, NameValue, Button, Breadcrumb, Stack, Title, Divider,
  type NavItem,
} from '@/components/DesignSystem';

const navItems: NavItem[] = [
  { label: 'Items', icon: 'ri-list-check', href: '/prototype/items' },
  { label: 'Item Detail', icon: 'ri-file-line', href: '/prototype/item-detail', active: true },
];

export default function DetailPage() {
  return (
    <AppShellLayout navItems={navItems} title="App Name">
      <Breadcrumb items={[
        { label: 'Prototypes', href: '/prototype' },
        { label: 'Items', href: '/prototype/items' },
        { label: 'Item Name' },
      ]} />
      <PageContentHeader title="Item Name" subhead="Category" />
      <TertiaryColumnLayout
        main={
          <Card>
            <Stack gap="sm">
              <Title order={4}>Details</Title>
              <NameValue columns={2} pairs={[
                { name: 'Field A', value: 'Value A' },
                { name: 'Field B', value: 'Value B' },
              ]} />
            </Stack>
          </Card>
        }
        aside={
          <Card>
            <Stack gap="sm">
              <Title order={5}>Actions</Title>
              <Button variant="primary" fullWidth>Primary Action</Button>
              <Button variant="outline" fullWidth>Secondary Action</Button>
              <Divider />
              <NameValue pairs={[{ name: 'Status', value: 'Active' }]} />
            </Stack>
          </Card>
        }
      />
    </AppShellLayout>
  );
}
```

### Pattern 3: Header-Only Page (No Nav)

A standalone page without left navigation, useful for landing or summary views.

```tsx
import {
  AppShellLayout, SingleColumnLayout, PageContentHeader,
  Card, Stack, Text, Breadcrumb,
} from '@/components/DesignSystem';

export default function StandalonePage() {
  return (
    <AppShellLayout title="App Name" hideNav>
      <SingleColumnLayout>
        <Breadcrumb items={[{ label: 'Prototypes', href: '/prototype' }, { label: 'Page' }]} />
        <PageContentHeader title="Standalone Page" subhead="No sidebar" badge="Prototype" />
        <Card>
          <Stack gap="sm">
            <Text>Full-width content without navigation sidebar.</Text>
          </Stack>
        </Card>
      </SingleColumnLayout>
    </AppShellLayout>
  );
}
```

---

*This document is the authoritative reference for Figma Code Connect integration with the AppDirect Design System.*
