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
import { iconButtonRoute } from '../route.js';
import Sizes from './Sizes.js';
import Standard from './Standard.js';
import Tools from './Tools.js';

const IconButtonDemo = setup(() => {
  const codeState = mutable({
    standard: false,
    sizes: false,
    tools: false,
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Icon Buttons</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Icon buttons help users take supplementary actions with a single tap, using icons instead of text labels.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Standard Variants</CardTitle>
              <p className="air-body-sm">Icon buttons come in standard, filled, tonal, and outlined variants.</p>
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
              <p className="air-body-sm">Available in multiple sizes to fit different UI contexts.</p>
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
              <CardTitle>Tool Icon Buttons</CardTitle>
              <p className="air-body-sm">Compact square icon buttons designed specifically for toolbars and rich text editors.</p>
            </div>
            <Button variant="text" active={$bind(codeState, 'tools')}>
              <Icon name={() => (codeState.tools ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.tools ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.tools}>
            <CardBody>
              <Tools />
            </CardBody>
          </Show>
          <Show when={() => codeState.tools}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Tools.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>
      </CardGroup>
    </div>
  );
}, 'IconButtonDemo');

export const IconButtonPage = page(iconButtonRoute).render(() => <IconButtonDemo />);
export default IconButtonPage;
