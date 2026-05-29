import { figma } from '@figma/code-connect';
import { ActionIcon } from './ActionIcon';
import { IconStar } from '@tabler/icons-react';

figma.connect(
  ActionIcon,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=1386-7331&t=F9hLR9eQ6A8lxsBi-4',
  {
    props: {
      size: figma.enum('size', { xs: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' }),
      variant: figma.enum('variant', { default: 'default', outline: 'outline', link: 'link' }),
    },
    example: (props) => (
      <ActionIcon variant={props.variant} size={props.size}>
        <IconStar />
      </ActionIcon>
    ),
  }
);
