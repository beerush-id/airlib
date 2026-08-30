import { Card, CardBody, CardGroup, CardHeader, CardTitle, Field } from '@airlib/react-ui/components';
import { Radio } from '@airlib/react-ui/form';
import { page, setup } from '@airlib/react';
import { radioRoute } from '../route.js';

const RadioDemo = setup(() => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Radio Button</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Radio buttons allow users to select one option from a set.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Standard Radio Group</CardTitle>
            <p className="air-body-sm">Only one radio button in a group can be selected at a time.</p>
          </CardHeader>
          <CardBody>
            <div className="flex gap-8">
              <Field>
                <Radio checked={false} />
                Unchecked
              </Field>
              <Field>
                <Radio checked={true} />
                Checked
              </Field>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'RadioDemo');

export const RadioPage = page(radioRoute).render(() => <RadioDemo />);
export default RadioPage;
