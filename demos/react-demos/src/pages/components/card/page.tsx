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
import { cardRoute } from '../route.js';
import Action from './Action.js';
import Segmented from './Segmented.js';
import Standard from './Standard.js';

const CardDemo = setup(() => {
  const codeState = mutable({
    standard: false,
    segmented: false,
    action: false,
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Cards</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Cards contain content and actions about a single subject. They are pure CSS components.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Standard Cards</CardTitle>
              <p className="air-body-sm">Cards come in three variants: elevated (default), filled, and outlined.</p>
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
              <CardTitle>Cards with Actions</CardTitle>
              <p className="air-body-sm">Cards can contain buttons and other interactive elements.</p>
            </div>
            <Button variant="text" active={$bind(codeState, 'action')}>
              <Icon name={() => (codeState.action ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.action ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.action}>
            <CardBody>
              <Action />
            </CardBody>
          </Show>
          <Show when={() => codeState.action}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Action.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>

        <Card variant="outlined">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Segmented Card Group</CardTitle>
              <p className="air-body-sm">Cards can be grouped together into a segmented surface.</p>
            </div>
            <Button variant="text" active={$bind(codeState, 'segmented')}>
              <Icon name={() => (codeState.segmented ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.segmented ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.segmented}>
            <CardBody>
              <Segmented />
            </CardBody>
          </Show>
          <Show when={() => codeState.segmented}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Segmented.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>
      </CardGroup>
    </div>
  );
}, 'CardDemo');

export const CardPage = page(cardRoute).render(() => <CardDemo />);
export default CardPage;
