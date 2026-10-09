import React from 'react';
import { figma } from '@figma/code-connect';
import { DropZone } from './DropZone';

// Code Connect — `Ⓜ️ Dropzone` (node 1868:11698)
//
// Figma component properties (match these names in Figma or update the figma.string keys):
//   title (text)        → DS `title`
//   description (text)  → DS `description`
//
// DS vs Mantine:
//   • Import `DropZone` from `@/components/DesignSystem` — do NOT use raw `Dropzone` from
//     `@mantine/dropzone` for product UI; Mantine has no `title`/`description` props (those
//     are DS-only; Mantine only takes `children` + file props).
//   • Icons, Idle/Accept/Reject states, and `Inline` layout are fixed inside `DropZone.tsx`.
//
// Props to set in application code (not mapped from this Figma component):
//   • onDrop (required for real usage) — (files: File[]) => void
//   • onReject — optional; forwarded to Mantine
//   • maxSize — bytes; default 5 * 1024 ** 2 in DS
//   • accept — default IMAGE_MIME_TYPE from `@mantine/dropzone` in DS
//   • ...rest — any other Mantine DropzoneProps except `children` (see DropZoneProps)
//
// Docs: components/DesignSystem/FIGMA_PROPS_REGISTRY.md → DropZone
//
figma.connect(
  DropZone,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=7055-18383&t=y0IJ175mkJJcYKZp-4',
  {
    props: {
      title: figma.string('title'),
      description: figma.string('description'),
    },
    example: (props) => (
      <DropZone
        title={props.title}
        description={props.description}
        onDrop={() => {
          /* wire to upload handler */
        }}
        onReject={() => {
          /* optional: toast or log rejections */
        }}
      />
    ),
  }
);
