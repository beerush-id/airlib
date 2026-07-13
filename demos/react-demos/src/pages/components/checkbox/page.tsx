import {
  Button,
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  CardTitle,
  CodeBlock,
  Icon,
  Tooltip,
} from '@airlib/react-ui/components';
import { $bind, mutable, page, Show, setup } from '@anchorlib/react';
import { checkboxRoute } from '../route.js';
import Disabled from './Disabled.js';
import Standard from './Standard.js';

const CheckboxDemo = setup(() => {
  const codeState = mutable({
    standard: false,
    disabled: false,
  });

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
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Standard Checkbox</CardTitle>
              <p className="air-body-sm">Toggle states include checked, unchecked, and indeterminate.</p>
            </div>
            <Button variant="text" active={$bind(codeState, 'standard')}>
              <Icon name={() => (codeState.standard ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.standard ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.standard}>
            <CardBody>
              <Standard />
            </CardBody>
          </Show>
          <Show when={() => codeState.standard}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Standard.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>

        <Card variant="outlined">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Disabled Checkbox</CardTitle>
              <p className="air-body-sm">Checkboxes can be disabled to prevent user interaction.</p>
            </div>
            <Button variant="text" active={$bind(codeState, 'disabled')}>
              <Icon name={() => (codeState.disabled ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.disabled ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.disabled}>
            <CardBody>
              <Disabled />
            </CardBody>
          </Show>
          <Show when={() => codeState.disabled}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Disabled.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>
      </CardGroup>
    </div>
  );
}, 'CheckboxDemo');

export const CheckboxPage = page(checkboxRoute).render(() => <CheckboxDemo />);
export default CheckboxPage;
