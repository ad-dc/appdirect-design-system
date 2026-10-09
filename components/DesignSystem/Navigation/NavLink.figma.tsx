import { figma } from '@figma/code-connect';
import { NavLink } from './NavLink';
import { RiCircleLine } from '@remixicon/react';
import { IconChevronRight } from '@tabler/icons-react';

figma.connect(
  NavLink,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=7055-15766',
  {
    props: {
      leftSection: figma.boolean('leftSection'),
      rightSection: figma.boolean('rightSection'),
      description: figma.boolean('description'),
    },
    example: (props) => {
      const leftSection = props.leftSection ? <RiCircleLine size={14} /> : undefined;
      const rightSection = props.rightSection ? <IconChevronRight size={16} /> : undefined;
      const description = props.description ? 'Description' : undefined;

      return (
        <NavLink
          label="Nav label"
          description={description}
          leftSection={leftSection}
          rightSection={rightSection}
        />
      );
    },
  }
);

figma.connect(
  NavLink,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=7055-15766',
  {
    variant: { state: 'active' },
    props: {
      leftSection: figma.boolean('leftSection'),
      rightSection: figma.boolean('rightSection'),
      description: figma.boolean('description'),
    },
    example: (props) => {
      const leftSection = props.leftSection ? <RiCircleLine size={14} /> : undefined;
      const rightSection = props.rightSection ? <IconChevronRight size={16} /> : undefined;
      const description = props.description ? 'Description' : undefined;

      return (
        <NavLink
          label="Nav label"
          description={description}
          leftSection={leftSection}
          rightSection={rightSection}
          active
        />
      );
    },
  }
);
