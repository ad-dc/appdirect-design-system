import { figma } from '@figma/code-connect';
import { Anchor } from './Anchor';

// TODO(REV-6435): replace placeholder Figma URL with the production node-id when the
// Anchor component is added to the ADDS Admin Mantine Core file (`needs-connect`).
figma.connect(
  Anchor,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=0-0',
  {
    props: {
      children: figma.string('label'),
    },
    example: (props) => (
      <Anchor href="#">{props.children}</Anchor>
    ),
  }
);
