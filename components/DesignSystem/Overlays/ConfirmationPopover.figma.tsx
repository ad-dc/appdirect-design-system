import { figma } from '@figma/code-connect';
import { Button } from '../Buttons/Button';
import { ConfirmationPopover } from './Popover';

// TODO(REV-6435): replace placeholder Figma URL when the typed-confirmation
// ConfirmationPopover variant is added to the ADDS Admin Mantine Core file
// (`needs-connect`).
figma.connect(
  ConfirmationPopover,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=0-0',
  {
    props: {
      title: figma.string('title'),
      confirmLabel: figma.string('confirmLabel'),
      confirmationKeyword: figma.string('confirmationKeyword'),
      children: figma.string('body'),
    },
    example: (props) => (
      <ConfirmationPopover
        trigger={<Button variant="outline">{props.confirmLabel}</Button>}
        title={props.title}
        confirmLabel={props.confirmLabel}
        confirmationKeyword={props.confirmationKeyword}
      >
        {props.children}
      </ConfirmationPopover>
    ),
  }
);
