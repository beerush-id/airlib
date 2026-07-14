import { Card, CardBody, CardGroup, CardHeader, CardTitle, Field } from '@airlib/react-ui/components';
import { Switch } from '@airlib/react-ui/form';
import { page, setup } from '@anchorlib/react';
import { switchRoute } from '../route.js';

const SwitchDemo = setup(() => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Switch</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Switches toggle the state of a single setting on or off.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Standard Switch</CardTitle>
            <p className="air-body-sm">A setting that requires an immediate on/off change.</p>
          </CardHeader>
          <CardBody>
            <div className="flex gap-8">
              <Field>
                <Switch checked={false} />
                Unchecked
              </Field>
              <Field>
                <Switch checked={true} />
                Checked
              </Field>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'SwitchDemo');

export const SwitchPage = page(switchRoute).render(() => <SwitchDemo />);
export default SwitchPage;
