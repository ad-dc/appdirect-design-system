import { figma } from '@figma/code-connect';
import { ThemeIcon } from './ThemeIcon';
import { RiStarLine } from '@remixicon/react';

figma.connect(
  ThemeIcon,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=6352-56&t=y0IJ175mkJJcYKZp-4',
  {
    props: {
      size: figma.enum('Size', {
        xs: 'xs',
        sm: 'sm',
        md: 'md',
        lg: 'lg',
        xl: 'xl',
        xxl: 'xxl',
      }),
    },
    example: (props) => (
      <ThemeIcon size={props.size}>
        <RiStarLine size={16} />
      </ThemeIcon>
    ),
  }
);
