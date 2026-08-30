import {
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  CardTitle,
  Field,
  FieldLabel,
  FieldSupportingText,
} from '@airlib/react-ui/components';
import { Textarea } from '@airlib/react-ui/form';
import { page, setup } from '@airlib/react';
import { textareaRoute } from '../route.js';

const TextareaDemo = setup(() => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Textarea</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Textarea lets users enter and edit multi-line text. It is a CSS component that relies on the native textarea
          element with auto-scaling minimum height and vertical resize support.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Standard Textareas</CardTitle>
            <p className="air-body-sm">Basic multi-line text input fields.</p>
          </CardHeader>
          <CardBody>
            <div className="flex items-start gap-4">
              <Field className="flex-1 min-w-[240px]">
                <Textarea id="ta-1" variant="outlined" placeholder="e.g., Tell us about yourself..." />
                <FieldLabel>Outlined Textarea</FieldLabel>
                <FieldSupportingText>Supporting text</FieldSupportingText>
              </Field>
              <Field className="flex-1 min-w-[240px]">
                <Textarea id="ta-2" variant="filled" placeholder="e.g., Additional notes and comments..." />
                <FieldLabel>Filled Textarea</FieldLabel>
                <FieldSupportingText>Supporting text</FieldSupportingText>
              </Field>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Textareas with Error State</CardTitle>
            <p className="air-body-sm">Multi-line text inputs displaying validation errors.</p>
          </CardHeader>
          <CardBody>
            <div className="flex items-start gap-4">
              <Field className="flex-1 min-w-[240px]" error>
                <Textarea
                  id="ta-3"
                  variant="outlined"
                  value="Invalid bio content exceeding limits..."
                  placeholder="e.g., Tell us about yourself..."
                />
                <FieldLabel>Outlined Textarea</FieldLabel>
                <FieldSupportingText>Bio must be less than 500 characters</FieldSupportingText>
              </Field>
              <Field className="flex-1 min-w-[240px]" error>
                <Textarea
                  id="ta-4"
                  variant="filled"
                  value="Invalid notes format..."
                  placeholder="e.g., Additional notes and comments..."
                />
                <FieldLabel>Filled Textarea</FieldLabel>
                <FieldSupportingText>Please remove invalid characters</FieldSupportingText>
              </Field>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Sizes</CardTitle>
            <p className="air-body-sm">Textareas in different proportional sizes.</p>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <Field size="sm" className="flex-1">
                <Textarea variant="outlined" placeholder="Small outlined..." />
                <FieldLabel>Small</FieldLabel>
                <FieldSupportingText>Supporting text</FieldSupportingText>
              </Field>
              <Field size="sm" className="flex-1">
                <Textarea variant="filled" placeholder="Small filled..." />
                <FieldLabel>Small</FieldLabel>
                <FieldSupportingText>Supporting text</FieldSupportingText>
              </Field>
            </div>

            <div className="flex items-start gap-4">
              <Field size="md" className="flex-1">
                <Textarea variant="outlined" placeholder="Medium outlined..." />
                <FieldLabel>Medium (Default)</FieldLabel>
                <FieldSupportingText>Supporting text</FieldSupportingText>
              </Field>
              <Field size="md" className="flex-1">
                <Textarea variant="filled" placeholder="Medium filled..." />
                <FieldLabel>Medium (Default)</FieldLabel>
                <FieldSupportingText>Supporting text</FieldSupportingText>
              </Field>
            </div>

            <div className="flex items-start gap-4">
              <Field size="lg" className="flex-1">
                <Textarea variant="outlined" placeholder="Large outlined..." />
                <FieldLabel>Large</FieldLabel>
                <FieldSupportingText>Supporting text</FieldSupportingText>
              </Field>
              <Field size="lg" className="flex-1">
                <Textarea variant="filled" placeholder="Large filled..." />
                <FieldLabel>Large</FieldLabel>
                <FieldSupportingText>Supporting text</FieldSupportingText>
              </Field>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Standalone Input Utilities</CardTitle>
            <p className="air-body-sm">
              Using <code className="text-primary font-mono">air-textarea-input</code> without a{' '}
              <code className="text-primary font-mono">&lt;Field&gt;</code> wrapper across different sizes. The
              placeholder acts as a visible label replacement.
            </p>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <textarea
                className="air-textarea-input air-textarea-sm flex-1 min-w-[240px]"
                placeholder="Small Outlined..."
              />
              <textarea
                className="air-textarea-input-filled air-textarea-sm flex-1 min-w-[240px]"
                placeholder="Small Filled..."
              />
            </div>
            <div className="flex items-start gap-4">
              <textarea
                className="air-textarea-input flex-1 min-w-[240px]"
                placeholder="Medium Outlined (Default)..."
              />
              <textarea
                className="air-textarea-input-filled flex-1 min-w-[240px]"
                placeholder="Medium Filled (Default)..."
              />
            </div>
            <div className="flex items-start gap-4">
              <textarea
                className="air-textarea-input air-textarea-lg flex-1 min-w-[240px]"
                placeholder="Large Outlined..."
              />
              <textarea
                className="air-textarea-input-filled air-textarea-lg flex-1 min-w-[240px]"
                placeholder="Large Filled..."
              />
            </div>
            <div className="flex items-start gap-4">
              <textarea
                className="air-textarea-input air-textarea-error flex-1 min-w-[240px]"
                placeholder="Error Outlined..."
              />
              <textarea
                className="air-textarea-input-filled air-textarea-error flex-1 min-w-[240px]"
                placeholder="Error Filled..."
              />
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'TextareaDemo');

export const TextareaPage = page(textareaRoute).render(() => <TextareaDemo />);

export default TextareaPage;
