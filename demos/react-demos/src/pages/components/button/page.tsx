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
import { buttonRoute } from '../route.js';
import Compact from './Compact.js';
import Groups from './Groups.js';
import Sizes from './Sizes.js';
import Standard from './Standard.js';
import WithIcons from './WithIcons.js';

const ButtonDemo = setup(() => {
  const codeState = mutable({
    standard: false,
    icons: false,
    sizes: false,
    groups: false,
    compact: false,
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Buttons</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Buttons allow users to take actions, and make choices, with a single tap. There are several variants for
          different levels of emphasis.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Standard Buttons</CardTitle>
              <p className="air-body-sm">Buttons have five primary variants for different levels of emphasis.</p>
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
              <CardTitle>With Icons</CardTitle>
              <p className="air-body-sm">Buttons can include icons to clarify their action.</p>
            </div>
            <Button variant="text" active={$bind(codeState, 'icons')}>
              <Icon name={() => (codeState.icons ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.icons ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.icons}>
            <CardBody>
              <WithIcons />
            </CardBody>
          </Show>
          <Show when={() => codeState.icons}>
            <CardBody>
              <CodeBlock code={async () => (await import('./WithIcons.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>

        <Card variant="outlined">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Sizes</CardTitle>
              <p className="air-body-sm">Buttons are available in various sizes from Extra Small to Extra Large.</p>
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
              <CardTitle>Button Groups</CardTitle>
              <p className="air-body-sm">Group related buttons together.</p>
            </div>
            <Button variant="text" active={$bind(codeState, 'groups')}>
              <Icon name={() => (codeState.groups ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.groups ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.groups}>
            <CardBody>
              <Groups />
            </CardBody>
          </Show>
          <Show when={() => codeState.groups}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Groups.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>

        <Card variant="outlined">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Compact Tool & Icon Buttons</CardTitle>
              <p className="air-body-sm">
                Compact 32px tool buttons (<code className="text-primary font-mono">air-tool-button</code> for text
                labels) and square tool icon buttons (
                <code className="text-primary font-mono">air-tool-icon-button</code> for icons or formatting symbols)
                designed for toolbars and compact action bars.
              </p>
            </div>
            <Button variant="text" active={$bind(codeState, 'compact')}>
              <Icon name={() => (codeState.compact ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.compact ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.compact}>
            <CardBody>
              <Compact />
            </CardBody>
          </Show>
          <Show when={() => codeState.compact}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Compact.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>
      </CardGroup>
    </div>
  );
}, 'ButtonDemo');

export const ButtonPage = page(buttonRoute).render(() => <ButtonDemo />);
export default ButtonPage;
