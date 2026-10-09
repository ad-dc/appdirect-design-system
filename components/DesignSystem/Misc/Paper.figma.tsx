import React from 'react';
import { figma } from '@figma/code-connect';
import { Paper } from './Paper';

figma.connect(
  Paper,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=6671-52&t=y0IJ175mkJJcYKZp-4',
  {
    props: {
      shadow: figma.enum('shadow', {
        none: undefined,
        xs: 'xs',
        sm: 'sm',
        md: 'md',
        lg: 'lg',
        xl: 'xl',
      }),
      withBorder: figma.boolean('border'),
      children: figma.slot('children'),
    },
    example: (props) => (
      <Paper shadow={props.shadow} withBorder={props.withBorder}>
        {props.children}
      </Paper>
    ),
  }
);
