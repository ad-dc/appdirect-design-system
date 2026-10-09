import { figma } from '@figma/code-connect';
import { Switch } from './Switch';

figma.connect(
  Switch,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=6406-116&t=kmCY8PcaF7gXHN6Z-11',
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
      onLabel: figma.string('onLabel'),
      offLabel: figma.string('offLabel'),
    },
    example: (props) => (
      <Switch
        size={props.size}
        label={props.label}
        checked={props.checked}
        {...(props.onLabel && { onLabel: props.onLabel })}
        {...(props.offLabel && { offLabel: props.offLabel })}
      />
    ),
  }
);

