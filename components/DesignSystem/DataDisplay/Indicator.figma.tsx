import { figma } from '@figma/code-connect';
import { Indicator } from './Indicator';

figma.connect(
  Indicator,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=6511-83',
  {
    props: {
      type: figma.enum('variant', {
        success: 'success',
        error: 'danger',
        pending: 'pending',
        default: 'default',
        info: 'info',
      }),
      size: figma.enum('size', {
        xs: 8,
        sm: 12,
        md: 16,
        lg: 20,
        xl: 24,
      }),
      withBorder: figma.boolean('withBorder'),
      label: figma.boolean('hasLabel', {
        true: figma.string('label'),
        false: undefined,
      }),
      inline: figma.boolean('hasLabel', {
        true: true,
        false: undefined,
      }),
    },
    example: (props) => (
      <Indicator
        type={props.type}
        size={props.size}
        withBorder={props.withBorder}
        label={props.label}
        inline={props.inline}
      >
        <div />
      </Indicator>
    ),
  }
);
