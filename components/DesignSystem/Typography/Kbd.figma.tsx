import { figma } from '@figma/code-connect';
import { Kbd } from './Kbd';

figma.connect(
  Kbd,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=6346-36&t=y0IJ175mkJJcYKZp-4',
  {
    props: {
      size: figma.enum('size', {
        xs: 'xs',
        sm: 'sm',
        md: 'md',
        lg: 'lg',
        xl: 'xl',
      }),
      content: figma.string('content'),
    },
    example: (props) => (
      <Kbd size={props.size}>
        {props.content}
      </Kbd>
    ),
  }
);
