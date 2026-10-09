import { figma } from '@figma/code-connect';
import { Chip } from './Chip';

figma.connect(
  Chip,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=6498-140',
  {
    props: {
      size: figma.enum('size', {
        xs: 'xs',
        sm: 'sm',
        md: 'md',
        lg: 'lg',
        xl: 'xl',
      }),
      color: figma.enum('color', {
        default: 'default',
        info: 'info',
        success: 'success',
        danger: 'danger',
        pending: 'pending',
      }),
      checked: figma.boolean('checked'),
      children: figma.string('children'),
    },
    example: (props) => (
      <Chip
        value="chip-value"
        size={props.size}
        variant={props.color}
        checked={props.checked}
      >
        {props.children}
      </Chip>
    ),
  }
);
