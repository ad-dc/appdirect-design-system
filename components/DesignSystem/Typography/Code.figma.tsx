import { figma } from '@figma/code-connect';
import { Code } from './Code';

figma.connect(
  Code,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=7055-15715&t=y0IJ175mkJJcYKZp-4',
  {
    props: {
      // TODO: Restore bindings once the Figma Code component exposes matching props
      // color: figma.enum('color', {
      //   gray: 'gray',
      //   red: 'red',
      //   green: 'green',
      //   blue: 'blue',
      //   yellow: 'yellow',
      // }),
      // block: figma.boolean('block'),
      // children: figma.string('content'),
    },
    example: () => (
      <Code color="blue" block>
        const value = 42;
      </Code>
    ),
  }
);
