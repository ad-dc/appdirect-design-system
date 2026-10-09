import { figma } from '@figma/code-connect';
import { TextArea } from './TextArea';

figma.connect(
  TextArea,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=7055-15240&t=F9hLR9eQ6A8lxsBi-4',
  {
    props: {
      size: figma.enum('size', { xs: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' }),
      label: figma.string('label'),
      description: figma.boolean('hasDescription', {
        true: figma.string('description'),
        false: undefined,
      }),
      required: figma.boolean('required'),
      showOptional: figma.boolean('showOptional'),
      hasHelpIcon: figma.boolean('hasHelpIcon'),
      placeholder: figma.enum('state', {
        default: figma.string('placeholder'),
      }),
      value: figma.enum('state', {
        filled: figma.string('value'),
        disabled: figma.string('value'),
        error: figma.string('value'),
      }),
      disabled: figma.enum('state', { default: undefined, filled: undefined, disabled: true, error: undefined }),
      error: figma.enum('state', { default: undefined, filled: undefined, disabled: undefined, error: true }),
      errorMessage: figma.string('error'),
    },
    example: (props) => (
      <TextArea
        size={props.size}
        label={props.label}
        placeholder={props.placeholder}
        value={props.value}
        description={props.description}
        required={props.required}
        showOptional={props.showOptional}
        hasHelpIcon={props.hasHelpIcon}
        helpIconLabel="More information"
        disabled={props.disabled}
        error={props.error}
        errorCaption={props.errorMessage}
        minRows={3}
      />
    ),
  }
);
