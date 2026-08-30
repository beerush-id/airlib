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
import { $bind, mutable, page, Show, setup } from '@airlib/react';
import { collapsibleRoute } from '../route.js';
import Controlled from './Controlled.js';
import Custom from './Custom.js';
import Individual from './Individual.js';
import Single from './Single.js';

const CollapsibleDemo = setup(() => {
  const codeState = mutable({
    individual: false,
    single: false,
    controlled: false,
    custom: false,
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Collapsible</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Collapsible is the unstyled disclosure primitive used to build custom dropdowns, navigation groupings, and
          expandable panels.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Individual Expansion</CardTitle>
              <CardSubtitle>
                Without a `value` prop, each collapsible manages its own state independently. Style the headless primitive triggers by targeting `.air-collapsible-trigger` via CSS, or applying nested arbitrary variants.
              </CardSubtitle>
            </div>
            <Button variant="text" active={$bind(codeState, 'individual')}>
              <Icon name={() => (codeState.individual ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.individual ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.individual}>
            <CardBody>
              <div className="w-full flex justify-center py-4">
                <Individual />
              </div>
            </CardBody>
          </Show>
          <Show when={() => codeState.individual}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Individual.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>

        <Card variant="outlined">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Single Selection</CardTitle>
              <CardSubtitle>
                Pass a `value` prop (with `$bind`) to `CollapsibleGroup` to create a mutually exclusive disclosure section where only one panel can remain open.
              </CardSubtitle>
            </div>
            <Button variant="text" active={$bind(codeState, 'single')}>
              <Icon name={() => (codeState.single ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.single ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.single}>
            <CardBody>
              <div className="w-full flex justify-center py-4">
                <Single />
              </div>
            </CardBody>
          </Show>
          <Show when={() => codeState.single}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Single.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>

        <Card variant="outlined">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Controlled Expansion</CardTitle>
              <CardSubtitle>
                Use `$bind(state)` on the `expanded` prop of individual items to externally control them, useful for "Expand All" / "Collapse All" functionality.
              </CardSubtitle>
            </div>
            <Button variant="text" active={$bind(codeState, 'controlled')}>
              <Icon name={() => (codeState.controlled ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.controlled ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.controlled}>
            <CardBody>
              <div className="w-full flex justify-center py-4">
                <Controlled />
              </div>
            </CardBody>
          </Show>
          <Show when={() => codeState.controlled}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Controlled.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>

        <Card variant="outlined">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Custom Triggers & Content</CardTitle>
              <CardSubtitle>
                Combine `CollapsibleTrigger` and `CollapsibleContent` inside `Collapsible` for complete layout control.
              </CardSubtitle>
            </div>
            <Button variant="text" active={$bind(codeState, 'custom')}>
              <Icon name={() => (codeState.custom ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.custom ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.custom}>
            <CardBody>
              <div className="w-full flex justify-center py-4">
                <Custom />
              </div>
            </CardBody>
          </Show>
          <Show when={() => codeState.custom}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Custom.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>
      </CardGroup>
    </div>
  );
}, 'CollapsibleDemo');

export const CollapsiblePage = page(collapsibleRoute).render(() => <CollapsibleDemo />);
export default CollapsiblePage;
