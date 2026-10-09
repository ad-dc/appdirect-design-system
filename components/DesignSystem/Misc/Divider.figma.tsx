import { figma } from '@figma/code-connect';
import { Divider } from './Divider';

figma.connect(
  Divider,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=6207-48&t=F9hLR9eQ6A8lxsBi-4',
  {
    props: {
      orientation: figma.enum('orientation', {
        horizontal: 'horizontal',
        vertical: 'vertical',
      }),
      size: figma.enum('size', {
        xs: 'xs',
        sm: 'sm',
        md: 'md',
        lg: 'lg',
        xl: 'xl',
      }),
    },
    example: (props) => (
      <Divider orientation={props.orientation} size={props.size} />
    ),
  }
);
