import { figma } from '@figma/code-connect';
import { Breadcrumb, BackBreadcrumb } from './Breadcrumb';

// Component set node: 6202-59 ("Breadcrumbs")
// Variants live inside the set — use variant: {} to differentiate them.

// ── Default breadcrumb (type=Default) ──────────────────────────────────────
//
// Variable level support:
//   In Figma, add boolean properties named "Level 3" and "Level 4" to the
//   component. Toggle those properties to show/hide levels on the canvas.
//   Code Connect reads those booleans so the generated snippet in Dev Mode
//   always matches the exact number of levels the designer has configured.
figma.connect(
  Breadcrumb,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=6202-59',
  {
    variant: { type: 'Default' },
    props: {
      level1:      figma.nestedProps('level 1', { label: figma.string('label') }),
      level2:      figma.nestedProps('level 2', { label: figma.string('label') }),
      showLevel3:  figma.boolean('Level 3'),
      level3:      figma.nestedProps('level 3', { label: figma.string('label') }),
      showLevel4:  figma.boolean('Level 4'),
      level4:      figma.nestedProps('level 4', { label: figma.string('label') }),
    },
    // Level 4 is always the current-page item (no href) when visible.
    // Level 3 gets href only when level 4 is also visible; otherwise it becomes
    // the current-page item itself. Level 1 and 2 are always present links.
    example: (props) => (
      <Breadcrumb
        separator="/"
        items={[
          { label: props.level1.label, href: '#' },
          { label: props.level2.label, href: '#' },
          ...(props.showLevel3 ? [{ label: props.level3.label, href: props.showLevel4 ? '#' : undefined }] : []),
          ...(props.showLevel4 ? [{ label: props.level4.label }] : []),
        ]}
      />
    ),
  }
);

// ── Back breadcrumb (type=back) ────────────────────────────────────────────
figma.connect(
  BackBreadcrumb,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=6202-59',
  {
    variant: { type: 'back' },
    props: {
      level: figma.nestedProps('.Breadcrumbs/Core/level', { label: figma.string('label') }),
    },
    example: (props) => (
      <BackBreadcrumb label={props.level.label} onClick={() => {}} />
    ),
  }
);

// ── Subcomponent: .Breadcrumbs/Core/level (node 1150:3287) ─────────────────
// Prevents Figma from falling back to Tailwind auto-generation for this node.
figma.connect(
  Breadcrumb,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=1150-3287',
  {
    example: () => <Breadcrumb items={[{ label: 'Level', href: '#' }]} />,
  }
);

// ── Subcomponent: .Breadcrumbs/Core/separator (node 1151:552) ─────────────
figma.connect(
  Breadcrumb,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=1151-552',
  {
    example: () => <Breadcrumb items={[{ label: 'Level 1', href: '#' }, { label: 'Level 2' }]} />,
  }
);

// ── Subcomponent: .Breadcrumbs/Core/back-icon (node 1151:598) ─────────────
figma.connect(
  BackBreadcrumb,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=1151-598',
  {
    example: () => <BackBreadcrumb label="Back" onClick={() => {}} />,
  }
);
