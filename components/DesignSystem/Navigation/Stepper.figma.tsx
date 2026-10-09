import { figma } from '@figma/code-connect';
import { Stepper } from './Stepper';

/**
 * Code Connect configuration for Stepper component
 *
 * Maps the Figma Stepper component to the DS Stepper using core Mantine props.
 * Steps 1-2 are always visible; steps 3-10 are toggled via boolean properties.
 *
 * Expected Figma Properties:
 * - orientation (variant): horizontal | vertical
 * - hasContent (boolean): toggles current step content area
 * - content (text): current step content text
 * - step3..step10 (boolean): toggles step visibility
 *
 * Nested step layers (Step 1 through Step 10), each with:
 * - label (text)
 * - description (text)
 */
figma.connect(
  Stepper,
  'https://www.figma.com/design/rXvD5jPC1i02ZIma87Qcbl/ADDS-Admin-Mantine-Core?node-id=7055-18403',
  {
    props: {
      orientation: figma.enum('orientation', {
        horizontal: 'horizontal',
        vertical: 'vertical',
      }),
      content: figma.boolean('hasContent', {
        true: figma.string('content'),
        false: undefined,
      }),
      step1: figma.nestedProps('Step 1', {
        label: figma.string('label'),
        description: figma.string('description'),
      }),
      step2: figma.nestedProps('Step 2', {
        label: figma.string('label'),
        description: figma.string('description'),
      }),
      showStep3: figma.boolean('step3'),
      step3: figma.nestedProps('Step 3', {
        label: figma.string('label'),
        description: figma.string('description'),
      }),
      showStep4: figma.boolean('step4'),
      step4: figma.nestedProps('Step 4', {
        label: figma.string('label'),
        description: figma.string('description'),
      }),
      showStep5: figma.boolean('step5'),
      step5: figma.nestedProps('Step 5', {
        label: figma.string('label'),
        description: figma.string('description'),
      }),
      showStep6: figma.boolean('step6'),
      step6: figma.nestedProps('Step 6', {
        label: figma.string('label'),
        description: figma.string('description'),
      }),
      showStep7: figma.boolean('step7'),
      step7: figma.nestedProps('Step 7', {
        label: figma.string('label'),
        description: figma.string('description'),
      }),
      showStep8: figma.boolean('step8'),
      step8: figma.nestedProps('Step 8', {
        label: figma.string('label'),
        description: figma.string('description'),
      }),
      showStep9: figma.boolean('step9'),
      step9: figma.nestedProps('Step 9', {
        label: figma.string('label'),
        description: figma.string('description'),
      }),
      showStep10: figma.boolean('step10'),
      step10: figma.nestedProps('Step 10', {
        label: figma.string('label'),
        description: figma.string('description'),
      }),
    },
    example: (props) => (
      <Stepper active={0} orientation={props.orientation}>
        <Stepper.Step label={props.step1.label} description={props.step1.description}>
          {props.content}
        </Stepper.Step>
        <Stepper.Step label={props.step2.label} description={props.step2.description} />
        {props.showStep3 && <Stepper.Step label={props.step3.label} description={props.step3.description} />}
        {props.showStep4 && <Stepper.Step label={props.step4.label} description={props.step4.description} />}
        {props.showStep5 && <Stepper.Step label={props.step5.label} description={props.step5.description} />}
        {props.showStep6 && <Stepper.Step label={props.step6.label} description={props.step6.description} />}
        {props.showStep7 && <Stepper.Step label={props.step7.label} description={props.step7.description} />}
        {props.showStep8 && <Stepper.Step label={props.step8.label} description={props.step8.description} />}
        {props.showStep9 && <Stepper.Step label={props.step9.label} description={props.step9.description} />}
        {props.showStep10 && <Stepper.Step label={props.step10.label} description={props.step10.description} />}
      </Stepper>
    ),
  }
);
