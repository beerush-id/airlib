import { Card, CardBody, CardGroup, CardHeader, CardTitle, Checkbox, Field } from '@airlib/react-ui/components';
import { page, setup } from '@anchorlib/react';
import { checkboxRoute } from '../route.js';

const CheckboxDemo = setup(() => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Checkbox</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Checkboxes allow users to select one or more options from a set.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Standard Checkbox</CardTitle>
            <p className="air-body-sm">Toggle states include checked, unchecked, and indeterminate.</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4">
              <Field>
                <Checkbox checked={false} />
                Unchecked
              </Field>

              <Field>
                <Checkbox checked={true} />
                Checked
              </Field>

              <Field>
                <Checkbox checked="mixed" />
                Indeterminate
              </Field>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'CheckboxDemo');

export const CheckboxPage = page(checkboxRoute).render(() => <CheckboxDemo />);
export default CheckboxPage;
