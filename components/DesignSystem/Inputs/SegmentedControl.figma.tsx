import { figma } from '@figma/code-connect';
import { SegmentedControl } from './SegmentedControl';

figma.connect(
  SegmentedControl,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=7055-18182',
  {
    props: {
      size: figma.enum('size', { xs: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' }),
      showSegment3: figma.boolean('segment3'),
      showSegment4: figma.boolean('segment4'),
      showSegment5: figma.boolean('segment5'),
    },
    example: (props) => (
      <SegmentedControl
        size={props.size}
        data={[
          'Segment 1',
          'Segment 2',
          ...(props.showSegment3 ? ['Segment 3'] : []),
          ...(props.showSegment4 ? ['Segment 4'] : []),
          ...(props.showSegment5 ? ['Segment 5'] : []),
        ]}
      />
    ),
  }
);
