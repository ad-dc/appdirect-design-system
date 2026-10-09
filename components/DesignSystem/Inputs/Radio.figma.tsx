import { figma } from '@figma/code-connect';
import { Radio } from './Radio';

figma.connect(
  Radio,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=6397-125&t=1LrRB2fT0aSOV74o-11',

  
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
      required: figma.boolean('required'),
      disabled: figma.boolean('disabled'),
      checked: figma.boolean('checked'),
    },
    example: (props) => (
      <Radio
        size={props.size}
        label={props.label}
        required={props.required}
        disabled={props.disabled}
        checked={props.checked}
        value="option"
        name="radio"
      />
    ),
  }
);

