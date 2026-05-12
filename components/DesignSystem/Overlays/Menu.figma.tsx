import { figma } from '@figma/code-connect';
import { Button } from '../Buttons/Button';
import { Menu } from './Menu';

const MenuItem = Menu.Item;
const MenuLabel = Menu.Label;

figma.connect(
  Menu,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=5733-6690',
  {
    props: {
      content: figma.instance('content'),
    },
    example: (props) => (
      <Menu defaultOpened withinPortal={false}>
        <Menu.Target>
          <Button variant="outline" size="xs">
            Open menu
          </Button>
        </Menu.Target>
        <Menu.Dropdown>{props.content}</Menu.Dropdown>
      </Menu>
    ),
  }
);

figma.connect(
  MenuItem,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=5711-1305',
  {
    props: {
      children: figma.string('children'),
      leftSection: figma.instance('leftSection'),
      rightSection: figma.instance('rightSection'),
    },
    example: (props) => (
      <MenuItem
        leftSection={props.leftSection}
        rightSection={props.rightSection}
      >
        {props.children}
      </MenuItem>
    ),
  }
);

figma.connect(
  MenuItem,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=5711-1305',
  {
    variant: { state: 'active' },
    props: {
      children: figma.string('children'),
      leftSection: figma.instance('leftSection'),
      rightSection: figma.instance('rightSection'),
    },
    example: (props) => (
      <MenuItem
        leftSection={props.leftSection}
        rightSection={props.rightSection}
        bg="var(--ad-color-brand-light)"
      >
        {props.children}
      </MenuItem>
    ),
  }
);

figma.connect(
  MenuLabel,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=1213-1768',
  {
    props: {
      children: figma.string('children'),
    },
    example: (props) => <MenuLabel>{props.children}</MenuLabel>,
  }
);
