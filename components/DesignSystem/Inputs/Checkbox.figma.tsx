import { figma } from '@figma/code-connect';
import { Checkbox } from './Checkbox';

figma.connect(
  Checkbox,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=6415-385',
  {
    props: {
      size: figma.enum('size', {
        xs: 'xs',
        sm: 'sm',
        md: 'md',
        lg: 'lg',
        xl: 'xl',
      }),
      label: figma.string('label'),
      checked: figma.boolean('checked'),
      indeterminate: figma.boolean('indeterminate'),
      disabled: figma.boolean('disabled'),
      required: figma.boolean('required'),
    },
    example: (props) => (
      <Checkbox
        size={props.size}
        label={props.label}
        checked={props.checked}
        indeterminate={props.indeterminate}
        disabled={props.disabled}
        required={props.required}
      />
    ),
  }
);
