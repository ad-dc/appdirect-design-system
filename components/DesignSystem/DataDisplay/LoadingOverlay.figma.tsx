import { figma } from '@figma/code-connect';
import { LoadingOverlay } from './LoadingOverlay';

// TODO(REV-6435): replace placeholder Figma URL when the LoadingOverlay component is added to
// the ADDS Admin Mantine Core file (`needs-connect`).
figma.connect(
  LoadingOverlay,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=0-0',
  {
    props: {
      visible: figma.boolean('visible'),
    },
    example: (props) => (
      <LoadingOverlay visible={props.visible} />
    ),
  }
);
