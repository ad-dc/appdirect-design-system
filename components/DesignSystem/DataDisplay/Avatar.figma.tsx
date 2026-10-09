import { figma } from '@figma/code-connect';
import { Avatar } from './Avatar';

figma.connect(
  Avatar,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=6341-63&t=y0IJ175mkJJcYKZp-4',
  {
    props: {
      size: figma.enum('size', {
        xs: 'xs',
        sm: 'sm',
        md: 'md',
        lg: 'lg',
        xl: 'xl',
      }),
      variant: figma.enum('variant', {
        icon: 'icon',
        image: 'image',
        initials: 'initials',
      }),
    },
    example: (props) => (
      <Avatar variant={props.variant} size={props.size} />
    ),
  }
);
