import { figma } from '@figma/code-connect';
import { Tabs } from './Tabs';
import { RiCircleLine } from '@remixicon/react';
import { Badge } from '../DataDisplay/Badge';

// Horizontal — default state
figma.connect(
  Tabs.Tab,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=7055-18241',
  {
    props: {
      label: figma.string('label'),
      leftSection: figma.boolean('leftSection'),
      rightSection: figma.boolean('rightSection'),
    },
    example: (props) => {
      const leftSection = props.leftSection ? <RiCircleLine size={14} /> : undefined;
      const rightSection = props.rightSection ? <Badge size="xs">99</Badge> : undefined;

      return (
        <Tabs defaultValue="tab-1">
          <Tabs.List>
            <Tabs.Tab value="tab-1" leftSection={leftSection} rightSection={rightSection}>
              {props.label}
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="tab-1">Tab content</Tabs.Panel>
        </Tabs>
      );
    },
  }
);

// Horizontal — active state
figma.connect(
  Tabs.Tab,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=7055-18241',
  {
    variant: { state: 'active' },
    props: {
      label: figma.string('label'),
      leftSection: figma.boolean('leftSection'),
      rightSection: figma.boolean('rightSection'),
    },
    example: (props) => {
      const leftSection = props.leftSection ? <RiCircleLine size={14} /> : undefined;
      const rightSection = props.rightSection ? <Badge size="xs">99</Badge> : undefined;

      return (
        <Tabs value="tab-1">
          <Tabs.List>
            <Tabs.Tab value="tab-1" leftSection={leftSection} rightSection={rightSection}>
              {props.label}
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="tab-1">Tab content</Tabs.Panel>
        </Tabs>
      );
    },
  }
);

// Vertical-left — default state
figma.connect(
  Tabs.Tab,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=7055-18241',
  {
    variant: { alignment: 'vertical-left' },
    props: {
      label: figma.string('label'),
      leftSection: figma.boolean('leftSection'),
      rightSection: figma.boolean('rightSection'),
    },
    example: (props) => {
      const leftSection = props.leftSection ? <RiCircleLine size={14} /> : undefined;
      const rightSection = props.rightSection ? <Badge size="xs">99</Badge> : undefined;

      return (
        <Tabs defaultValue="tab-1" orientation="vertical" placement="left">
          <Tabs.List>
            <Tabs.Tab value="tab-1" leftSection={leftSection} rightSection={rightSection}>
              {props.label}
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="tab-1">Tab content</Tabs.Panel>
        </Tabs>
      );
    },
  }
);

// Vertical-left — active state
figma.connect(
  Tabs.Tab,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=7055-18241',
  {
    variant: { alignment: 'vertical-left', state: 'active' },
    props: {
      label: figma.string('label'),
      leftSection: figma.boolean('leftSection'),
      rightSection: figma.boolean('rightSection'),
    },
    example: (props) => {
      const leftSection = props.leftSection ? <RiCircleLine size={14} /> : undefined;
      const rightSection = props.rightSection ? <Badge size="xs">99</Badge> : undefined;

      return (
        <Tabs value="tab-1" orientation="vertical" placement="left">
          <Tabs.List>
            <Tabs.Tab value="tab-1" leftSection={leftSection} rightSection={rightSection}>
              {props.label}
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="tab-1">Tab content</Tabs.Panel>
        </Tabs>
      );
    },
  }
);

// Vertical-right — default state
figma.connect(
  Tabs.Tab,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=7055-18241',
  {
    variant: { alignment: 'vertical-right' },
    props: {
      label: figma.string('label'),
      leftSection: figma.boolean('leftSection'),
      rightSection: figma.boolean('rightSection'),
    },
    example: (props) => {
      const leftSection = props.leftSection ? <RiCircleLine size={14} /> : undefined;
      const rightSection = props.rightSection ? <Badge size="xs">99</Badge> : undefined;

      return (
        <Tabs defaultValue="tab-1" orientation="vertical" placement="right">
          <Tabs.List>
            <Tabs.Tab value="tab-1" leftSection={leftSection} rightSection={rightSection}>
              {props.label}
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="tab-1">Tab content</Tabs.Panel>
        </Tabs>
      );
    },
  }
);

// Vertical-right — active state
figma.connect(
  Tabs.Tab,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=7055-18241',
  {
    variant: { alignment: 'vertical-right', state: 'active' },
    props: {
      label: figma.string('label'),
      leftSection: figma.boolean('leftSection'),
      rightSection: figma.boolean('rightSection'),
    },
    example: (props) => {
      const leftSection = props.leftSection ? <RiCircleLine size={14} /> : undefined;
      const rightSection = props.rightSection ? <Badge size="xs">99</Badge> : undefined;

      return (
        <Tabs value="tab-1" orientation="vertical" placement="right">
          <Tabs.List>
            <Tabs.Tab value="tab-1" leftSection={leftSection} rightSection={rightSection}>
              {props.label}
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="tab-1">Tab content</Tabs.Panel>
        </Tabs>
      );
    },
  }
);
