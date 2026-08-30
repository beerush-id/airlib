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
import { $bind, mutable, page, Show, setup } from '@airlib/react';
import { formRoute } from '../route.js';
import General from './General.js';
import Typed from './Typed.js';

const FormDemo = setup(() => {
  const codeState = mutable({
    general: false,
    typed: false,
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Forms & Validation</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Robust, reactive form components powered by <code>@airlib/form</code> and Zod, featuring seamless state
          synchronization and built-in validation.
        </p>
      </div>
      <CardGroup>
        <Card variant="outlined">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>General Form</CardTitle>
              <p className="air-card-subtitle">
                A comprehensive example combining various input types, inline layouts, and interactive validations.
              </p>
            </div>
            <Button variant="text" active={$bind(codeState, 'general')}>
              <Icon name={() => (codeState.general ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.general ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.general}>
            <CardBody>
              <General />
            </CardBody>
          </Show>
          <Show when={() => codeState.general}>
            <CardBody>
              <CodeBlock code={async () => (await import('./General.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>

        <Card variant="outlined">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Typed Form</CardTitle>
              <p className="air-card-subtitle">
                A fully typed form generated using <code>createForm()</code>.
              </p>
            </div>
            <Button variant="text" active={$bind(codeState, 'typed')}>
              <Icon name={() => (codeState.typed ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.typed ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.typed}>
            <CardBody>
              <Typed />
            </CardBody>
          </Show>
          <Show when={() => codeState.typed}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Typed.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>
      </CardGroup>
    </div>
  );
}, 'FormDemo');

export const FormPage = page(formRoute).render(() => <FormDemo />);
export default FormPage;
