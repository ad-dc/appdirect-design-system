import { figma } from '@figma/code-connect';
import { Progress } from './Progress';

figma.connect(
  Progress,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=6510-57',
  {
    props: {
      size: figma.enum('size', {
        xs: 'xs',
        sm: 'sm',
        md: 'md',
        lg: 'lg',
        xl: 'xl',
      }),
      value: figma.enum('value', {
        '0': 0,
        '25': 25,
        '50': 50,
        '75': 75,
        '100': 100,
      }),
    },
    example: (props) => (
      <Progress size={props.size} value={props.value} />
    ),
  }
);
