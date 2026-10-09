import { figma } from '@figma/code-connect';
import { Button } from '../Buttons/Button';
import { Stack } from '../Layout/Stack';
import { Text } from '../Typography/Text';
import { Drawer } from './Drawer';

figma.connect(
  Drawer,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=6275-59',
  {
    props: {
      title: figma.string('title'),
      size: figma.enum('size', {
        xs: 'xs',
        sm: 'sm',
        md: 'md',
        lg: 'lg',
        xl: 'xl',
      }),
      withCloseButton: figma.boolean('withCloseButton'),
      children: figma.slot('children'),
    },
    example: (props) => (
      <Drawer
        opened
        onClose={() => undefined}
        title={props.title}
        size={props.size}
        withCloseButton={props.withCloseButton}
      >
        {props.children}
      </Drawer>
    ),
  }
);
