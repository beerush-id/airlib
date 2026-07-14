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
import { TextField } from '@airlib/react-ui/form';
import { page, setup } from '@anchorlib/react';
import { textFieldRoute } from '../route.js';

const TextFieldDemo = setup(() => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Text Fields</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Text fields let users enter and edit text. They are CSS components that rely on the native input element.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Standard Text Fields</CardTitle>
            <p className="air-body-sm">Basic text input fields.</p>
          </CardHeader>
          <CardBody>
            <div className="flex items-center gap-4">
              <Field className="flex-1 min-w-[240px]">
                <TextField id="tf-1" variant="outlined" placeholder="e.g., John Doe" />
                <FieldLabel>Outlined Input</FieldLabel>
                <FieldSupportingText>Supporting text</FieldSupportingText>
              </Field>
              <Field className="flex-1 min-w-[240px]">
                <TextField id="tf-2" variant="filled" placeholder="e.g., Jane Doe" />
                <FieldLabel>Filled Input</FieldLabel>
                <FieldSupportingText>Supporting text</FieldSupportingText>
              </Field>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Text Fields with Error State</CardTitle>
            <p className="air-body-sm">Basic text input fields.</p>
          </CardHeader>
          <CardBody>
            <div className="flex items-center gap-4">
              <Field className="flex-1 min-w-[240px]" error>
                <TextField id="tf-1" variant="outlined" value="Invalid" placeholder="e.g., John Doe" />
                <FieldLabel>Outlined Input</FieldLabel>
                <FieldSupportingText>Supporting text</FieldSupportingText>
              </Field>
              <Field className="flex-1 min-w-[240px]" error>
                <TextField id="tf-2" variant="filled" value="Invalid" placeholder="e.g., Jane Doe" />
                <FieldLabel>Filled Input</FieldLabel>
                <FieldSupportingText>Supporting text</FieldSupportingText>
              </Field>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>With Icons</CardTitle>
            <p className="air-body-sm">Text fields with leading or trailing icons.</p>
          </CardHeader>
          <CardBody>
            <div className="flex items-center gap-4">
              <Field className="flex-1 min-w-[240px]">
                <span className="air-icon absolute left-4 top-[16px] text-on-surface-variant z-10 pointer-events-none">
                  search
                </span>
                <TextField id="tf-3" variant="outlined" />
                <FieldLabel>With Leading Icon</FieldLabel>
              </Field>

              <Field className="flex-1 min-w-[240px]">
                <TextField id="tf-4" />
                <FieldLabel>With Trailing Icon</FieldLabel>
                <button
                  type={'button'}
                  className="air-icon-button absolute right-2 top-[8px] text-on-surface-variant z-10"
                >
                  <span className="air-icon">visibility</span>
                </button>
              </Field>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Sizes</CardTitle>
            <p className="air-body-sm">Text fields in different sizes.</p>
          </CardHeader>
          <CardBody className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <Field size="sm" className="flex-1">
                <TextField variant="outlined" />
                <FieldLabel>Small</FieldLabel>
                <FieldSupportingText>Supporting text</FieldSupportingText>
              </Field>
              <Field size="sm" className="flex-1">
                <TextField />
                <FieldLabel>Small</FieldLabel>
                <FieldSupportingText>Supporting text</FieldSupportingText>
              </Field>
            </div>

            <div className="flex items-center gap-4">
              <Field size="md" className="flex-1">
                <TextField variant="outlined" />
                <FieldLabel>Medium (Defualt)</FieldLabel>
                <FieldSupportingText>Supporting text</FieldSupportingText>
              </Field>
              <Field size="md" className="flex-1">
                <TextField />
                <FieldLabel>Medium (Default)</FieldLabel>
                <FieldSupportingText>Supporting text</FieldSupportingText>
              </Field>
            </div>

            <div className="flex items-center gap-4">
              <Field size="lg" className="flex-1">
                <TextField variant="outlined" />
                <FieldLabel>Large</FieldLabel>
                <FieldSupportingText>Supporting text</FieldSupportingText>
              </Field>
              <Field size="lg" className="flex-1">
                <TextField />
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
              Using <code className="text-primary font-mono">air-text-field-input</code> without a{' '}
              <code className="text-primary font-mono">&lt;Field&gt;</code> wrapper across different sizes. The
              placeholder acts as a visible label replacement.
            </p>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <input
                type="text"
                className="air-text-field-input air-text-field-sm flex-1 min-w-[240px]"
                placeholder="Small Outlined..."
              />
              <input
                type="text"
                className="air-text-field-input-filled air-text-field-sm flex-1 min-w-[240px]"
                placeholder="Small Filled..."
              />
            </div>
            <div className="flex items-center gap-4">
              <input
                type="text"
                className="air-text-field-input flex-1 min-w-[240px]"
                placeholder="Medium Outlined (Default)..."
              />
              <input
                type="text"
                className="air-text-field-input-filled flex-1 min-w-[240px]"
                placeholder="Medium Filled (Default)..."
              />
            </div>
            <div className="flex items-center gap-4">
              <input
                type="text"
                className="air-text-field-input air-text-field-lg flex-1 min-w-[240px]"
                placeholder="Large Outlined..."
              />
              <input
                type="text"
                className="air-text-field-input-filled air-text-field-lg flex-1 min-w-[240px]"
                placeholder="Large Filled..."
              />
            </div>
            <div className="flex items-center gap-4">
              <input
                type="text"
                className="air-text-field-input air-text-field-error flex-1 min-w-[240px]"
                placeholder="Error Outlined..."
              />
              <input
                type="text"
                className="air-text-field-input-filled air-text-field-error flex-1 min-w-[240px]"
                placeholder="Error Filled..."
              />
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Compact Tool Inputs</CardTitle>
            <p className="air-body-sm">
              Compact 32px tool inputs (<code className="text-primary font-mono">air-tool-input</code>) designed for
              toolbars and compact control bars.
            </p>
          </CardHeader>
          <CardBody className="flex flex-col gap-6">
            <div className="flex items-center gap-4 flex-wrap">
              <input type="text" className="air-tool-input w-[120px]" defaultValue="16px" placeholder="Font size..." />
              <input type="text" className="air-tool-input w-[200px]" placeholder="Search document..." />
              <input
                type="text"
                className="air-tool-input w-[160px]"
                defaultValue="Inter"
                placeholder="Font family..."
              />
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'TextFieldDemo');

export const TextFieldPage = page(textFieldRoute).render(() => <TextFieldDemo />);

export default TextFieldPage;
