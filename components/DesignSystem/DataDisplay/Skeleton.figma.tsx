import { figma } from '@figma/code-connect';
import { Skeleton } from './Skeleton';

// TODO(REV-6435): replace placeholder Figma URL when the Skeleton component is added to
// the ADDS Admin Mantine Core file (`needs-connect`).
figma.connect(
  Skeleton,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=0-0',
  {
    props: {
      height: figma.string('height'),
      width: figma.string('width'),
    },
    example: (props) => (
      <Skeleton height={props.height} width={props.width} />
    ),
  }
);
