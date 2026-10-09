import { figma } from '@figma/code-connect';
import { Button } from '../Buttons/Button';
import { Popover } from './Popover';

figma.connect(
  Popover,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=6272-108&t=F9hLR9eQ6A8lxsBi-4',
  {
    props: {
      position: figma.enum('position', {
        top: 'top',
        bottom: 'bottom',
        left: 'left',
        right: 'right',
        none: 'bottom',
      }),
      withArrow: figma.enum('position', {
        top: true,
        bottom: true,
        left: true,
        right: true,
        none: false,
      }),
      children: figma.slot('children'),
    },
    example: (props) => (
      <Popover
        trigger={<Button variant="outline">Open popover</Button>}
        position={props.position}
        withArrow={props.withArrow}
      >
        {props.children}
      </Popover>
    ),
  }
);
