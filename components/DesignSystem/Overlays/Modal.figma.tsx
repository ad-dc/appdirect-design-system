import React from 'react';
import { figma } from '@figma/code-connect';
import { Modal } from './Modal';

figma.connect(
  Modal,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=6274-129&t=F9hLR9eQ6A8lxsBi-4',
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
      <Modal
        opened
        onClose={() => undefined}
        title={props.title}
        size={props.size}
        withCloseButton={props.withCloseButton}
      >
        {props.children}
      </Modal>
    ),
  }
);
