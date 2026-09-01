# @appdirect/ds-prototype-kit

AppDirect Design System components for prototyping. Thin wrappers around Mantine v9 with standardized props, semantic color tokens, and consistent API.

## Installation

Install from the GitHub Release tarball on `ad-dc/appdirect-design-system` (not Artifactory):

```bash
npm install https://github.com/ad-dc/appdirect-design-system/releases/download/v0.2.2/appdirect-ds-prototype-kit-0.2.2.tgz
```

### Peer Dependencies

Align with **Mantine 9**:

- `@mantine/core` ^9.0.1
- `@mantine/hooks` ^9.0.1
- `react` ^19.2.0
- `react-dom` ^19.2.0

### Upgrading from 0.1.x

**0.2.0+** targets **Mantine 9** and **React 19.2+**—upgrade your app’s Mantine and React peers before bumping the kit. **0.1.x** is the previous release line for apps not yet on Mantine 9; new work should use **0.2.0+**.

## CSS tokens

The kit includes `--ad-*` variables. Prototype apps should **not** install `@appdirect/design-tokens` from Artifactory.

```tsx
import '@appdirect/ds-prototype-kit/css/foundations.css';
import '@appdirect/ds-prototype-kit/css/mantine.css';
```

## Usage

```tsx
import { Button, TextInput, Card, Stack, Badge } from '@appdirect/ds-prototype-kit';

function MyPage() {
  return (
    <Stack gap="lg">
      <Card>
        <TextInput label="Name" placeholder="Enter name" />
        <Button variant="primary">Submit</Button>
        <Badge color="success">Active</Badge>
      </Card>
    </Stack>
  );
}
```

## Component Categories

- **Buttons:** Button, ActionIcon, CloseButton
- **Inputs:** TextInput, TextArea, NumberInput, ColorInput, Slider, Switch, SegmentedControl, Checkbox, Radio, RadioGroup, DropZone, FileInput
- **Combobox:** SearchableSelect, AutocompleteClearable, Multiselect, Select, Combobox
- **Navigation:** Breadcrumb, BackBreadcrumb, NavLink, Stepper, Tabs
- **Overlays:** Drawer, Menu, Modal, ConfirmationModal, Popover, ConfirmationPopover, Tooltip
- **Data Display:** Alert, Avatar, Badge, Card, Chip, Pill, Indicator, Progress, ThemeIcon, List, Table
- **Typography:** Kbd, Code, Text, Title
- **Layout:** Stack, Group, Inline, Box, SimpleGrid, Grid, Flex, Container, Center
- **Shell (prototype-only):** AppShellLayout, HeaderBar, SidebarNav, SingleColumnLayout, TertiaryColumnLayout
- **Complex:** KeyInsight, NameValue, CopyButton, PageContentHeader, DataTable, DashboardWidget
- **Misc:** Divider, Paper

## Publishing

`prepublishOnly` runs `build` for you.

```bash
cd ds-package
npm publish
```

Use a local `.npmrc` (not committed) for registry auth and `@appdirect` scope.

### Without registry access (local `.tgz`)

To produce an installable tarball **without** Artifactory/npm (e.g. hand off to another machine or `npm install ./path`):

```bash
cd ds-package
npm run tarball
```

This runs `build`, then writes **`appdirect-ds-prototype-kit-<version>.tgz`** in `ds-package/` (same contents as publish). Install elsewhere with:

```bash
npm install /path/to/appdirect-ds-prototype-kit-0.2.2.tgz
```

Tarballs are listed in `.gitignore`; keep them out of Git.
