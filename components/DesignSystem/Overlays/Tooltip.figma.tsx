import { figma } from '@figma/code-connect';
import { Tooltip } from './Tooltip';

figma.connect(
  Tooltip,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=6211-44&t=F9hLR9eQ6A8lxsBi-4',
  {
    props: {
      label: figma.string('label'),
      position: figma.enum('position', {
        top: 'top',
        'top-start': 'top-start',
        'top-end': 'top-end',
        bottom: 'bottom',
        'bottom-start': 'bottom-start',
        'bottom-end': 'bottom-end',
        left: 'left',
        right: 'right',
      }),
    },
    example: (props) => (
      <Tooltip label={props.label} position={props.position}>
        <span>Trigger element</span>
      </Tooltip>
    ),
  }
);
