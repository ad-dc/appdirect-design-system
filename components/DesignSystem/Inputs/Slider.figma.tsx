import { figma } from '@figma/code-connect';
import { Slider } from './Slider';

figma.connect(
  Slider,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=7055-18585&t=y0IJ175mkJJcYKZp-4',
  {
    props: {},
    example: () => <Slider thumbSize={16} defaultValue={40} />,
  }
);
