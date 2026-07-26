import {
  Button,
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  CardSubtitle,
  CardTitle,
  CodeBlock,
  Icon,
  Tooltip,
} from '@airlib/react-ui/components';
import { $bind, mutable, page, Show, setup } from '@anchorlib/react';
import { dialogRoute } from '../route.js';
import Data from './Data.js';
import Fullscreen from './Fullscreen.js';
import Imperative from './Imperative.js';
import Nested from './Nested.js';

const DialogDemo = setup(() => {
  const codeState = mutable({
    imperative: false,
    data: false,
    nested: false,
    fullscreen: false,
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Dialog</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Dialogs provide important prompts in a user flow, interrupt the user's current task, and require an action.
          The `airlib` dialog system supports data resolution flows, drag-to-move, focus trapping, and nesting out of
          the box.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Imperative Alerts</CardTitle>
              <CardSubtitle>
                Use `dialogConfirm()` for quick, imperative alerts and confirmations without needing to manage
                declarative state.
              </CardSubtitle>
            </div>
            <Button variant="text" active={$bind(codeState, 'imperative')}>
              <Icon name={() => (codeState.imperative ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.imperative ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.imperative}>
            <CardBody>
              <div className="w-full flex justify-center py-4">
                <Imperative />
              </div>
            </CardBody>
          </Show>
          <Show when={() => codeState.imperative}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Imperative.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>

        <Card variant="outlined">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Data Resolution & Draggable</CardTitle>
              <CardSubtitle>
                `createDialog&lt;In, Out&gt;()` allows passing initial data when opening and resolving final data when
                closing. Also, dialogs are natively draggable by holding `Shift` or `Meta` while dragging the surface.
              </CardSubtitle>
            </div>
            <Button variant="text" active={$bind(codeState, 'data')}>
              <Icon name={() => (codeState.data ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.data ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.data}>
            <CardBody>
              <div className="w-full flex justify-center py-4">
                <Data />
              </div>
            </CardBody>
          </Show>
          <Show when={() => codeState.data}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Data.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>

        <Card variant="outlined">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Nested Dialogs & Focus Trap</CardTitle>
              <CardSubtitle>
                Opening a dialog from within a dialog properly stacks the overlays and manages focus trapping between
                the nested layers automatically.
              </CardSubtitle>
            </div>
            <Button variant="text" active={$bind(codeState, 'nested')}>
              <Icon name={() => (codeState.nested ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.nested ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.nested}>
            <CardBody>
              <div className="w-full flex justify-center py-4">
                <Nested />
              </div>
            </CardBody>
          </Show>
          <Show when={() => codeState.nested}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Nested.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>

        <Card variant="outlined">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Fullscreen Variant</CardTitle>
              <CardSubtitle>
                Pass the `air-dialog-fullscreen` utility class to the `bodyClass` prop to create modal surfaces that
                cover the entire viewport.
              </CardSubtitle>
            </div>
            <Button variant="text" active={$bind(codeState, 'fullscreen')}>
              <Icon name={() => (codeState.fullscreen ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.fullscreen ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.fullscreen}>
            <CardBody>
              <div className="w-full flex justify-center py-4">
                <Fullscreen />
              </div>
            </CardBody>
          </Show>
          <Show when={() => codeState.fullscreen}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Fullscreen.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>
      </CardGroup>
    </div>
  );
}, 'DialogDemo');

export const DialogPage = page(dialogRoute).render(() => <DialogDemo />);

export default DialogPage;
