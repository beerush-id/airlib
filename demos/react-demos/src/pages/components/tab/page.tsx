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
import { tabRoute } from '../route.js';
import Basic from './Basic.js';
import Deferred from './Deferred.js';
import Nested from './Nested.js';
import Semantic from './Semantic.js';
import Vertical from './Vertical.js';

const TabDemo = setup(() => {
  const codeState = mutable({
    basic: false,
    vertical: false,
    deferred: false,
    nested: false,
    semantic: false,
  });

  return (
    <div className="w-full flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Tabs</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Tabs organize content into selectable sections, allowing users to navigate between views within the same
          context.
        </p>
      </div>

      <CardGroup className="w-full">
        <Card variant="outlined" className="w-full">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>
                <span>Basic Tabs</span>
              </CardTitle>
              <p className="air-body-sm">A standard horizontal tab list with corresponding content panels.</p>
            </div>
            <Button variant="text" active={$bind(codeState, 'basic')}>
              <Icon name={() => (codeState.basic ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.basic ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.basic}>
            <CardBody>
              <Basic />
            </CardBody>
          </Show>
          <Show when={() => codeState.basic}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Basic.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>

        <Card variant="outlined" className="w-full">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>
                <span>Vertical Tabs</span>
              </CardTitle>
              <p className="air-body-sm">
                Tabs arranged vertically, ideal for side-navigation menus or deeper context areas.
              </p>
            </div>
            <Button variant="text" active={$bind(codeState, 'vertical')}>
              <Icon name={() => (codeState.vertical ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.vertical ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.vertical}>
            <CardBody>
              <Vertical />
            </CardBody>
          </Show>
          <Show when={() => codeState.vertical}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Vertical.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>

        <Card variant="outlined" className="w-full">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>
                <span>Deferred Rendering</span>
              </CardTitle>
              <p className="air-body-sm">
                Use the `deferred` prop to mount tab panels lazily. Panels will only render when their respective tab
                becomes active.
              </p>
            </div>
            <Button variant="text" active={$bind(codeState, 'deferred')}>
              <Icon name={() => (codeState.deferred ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.deferred ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.deferred}>
            <CardBody>
              <Deferred />
            </CardBody>
          </Show>
          <Show when={() => codeState.deferred}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Deferred.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>

        <Card variant="outlined" className="w-full">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>
                <span>Nested Tabs & Rich Content</span>
              </CardTitle>
              <p className="air-body-sm">
                Tabs manage their own state scopes, so nesting tabs and wrapping content in Cards works flawlessly out
                of the box.
              </p>
            </div>
            <Button variant="text" active={$bind(codeState, 'nested')}>
              <Icon name={() => (codeState.nested ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.nested ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.nested}>
            <CardBody className="bg-surface-container/30">
              <Nested />
            </CardBody>
          </Show>
          <Show when={() => codeState.nested}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Nested.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>

        <Card variant="outlined" className="w-full">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>
                <span>Semantic & Typed Factory</span>
              </CardTitle>
              <p className="air-body-sm">
                Create strictly typed Tab instances using <code>createTab()</code>. This allows you to construct highly
                readable, semantic component structures like <code>&lt;Booking.List&gt;</code> and{' '}
                <code>&lt;Booking.Content&gt;</code> while retaining strict type safety.
              </p>
            </div>
            <Button variant="text" active={$bind(codeState, 'semantic')}>
              <Icon name={() => (codeState.semantic ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.semantic ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.semantic}>
            <CardBody className="bg-surface-container/30">
              <Semantic />
            </CardBody>
          </Show>
          <Show when={() => codeState.semantic}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Semantic.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>
      </CardGroup>
    </div>
  );
}, 'TabDemo');

export const TabPage = page(tabRoute).render(() => <TabDemo />);

export default TabPage;
