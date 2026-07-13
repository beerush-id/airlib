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
import { fabRoute } from '../route.js';
import Extended from './Extended.js';
import Sizes from './Sizes.js';
import Standard from './Standard.js';

const FabDemo = setup(() => {
  const codeState = mutable({
    standard: false,
    sizes: false,
    extended: false,
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Floating Action Buttons</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          FABs represent the primary action of a screen. They appear in front of all screen content, typically as a
          circular shape with an icon in its center.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Standard Variants</CardTitle>
              <p className="air-body-sm">FABs can use primary, secondary, tertiary, or surface colors.</p>
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
              <CardTitle>Sizes</CardTitle>
              <p className="air-body-sm">FABs come in small, default, and large sizes.</p>
            </div>
            <Button variant="text" active={$bind(codeState, 'sizes')}>
              <Icon name={() => (codeState.sizes ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.sizes ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.sizes}>
            <CardBody>
              <Sizes />
            </CardBody>
          </Show>
          <Show when={() => codeState.sizes}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Sizes.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>

        <Card variant="outlined">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Extended FABs</CardTitle>
              <p className="air-body-sm">Extended FABs are wider, and they include a text label along with the icon.</p>
            </div>
            <Button variant="text" active={$bind(codeState, 'extended')}>
              <Icon name={() => (codeState.extended ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.extended ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.extended}>
            <CardBody>
              <Extended />
            </CardBody>
          </Show>
          <Show when={() => codeState.extended}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Extended.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>
      </CardGroup>
    </div>
  );
}, 'FabDemo');

export const FabPage = page(fabRoute).render(() => <FabDemo />);
export default FabPage;
