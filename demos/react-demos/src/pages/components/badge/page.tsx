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
import { badgeRoute } from '../route.js';
import Basic from './Basic.js';
import Dot from './Dot.js';
import IconBadge from './IconBadge.js';
import Variants from './Variants.js';

const BadgeDemo = setup(() => {
  const codeState = mutable({
    basic: false,
    dot: false,
    icon: false,
    variants: false,
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Badges</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Badges show notifications, counts, or status information on top of other elements.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Basic Badges</CardTitle>
              <p className="air-body-sm">Badges with numbers or text indicating counts or states.</p>
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

        <Card variant="outlined">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Dot Badges</CardTitle>
              <p className="air-body-sm">Dot badges can be used to indicate a status without a specific count.</p>
            </div>
            <Button variant="text" active={$bind(codeState, 'dot')}>
              <Icon name={() => (codeState.dot ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.dot ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.dot}>
            <CardBody>
              <Dot />
            </CardBody>
          </Show>
          <Show when={() => codeState.dot}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Dot.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>

        <Card variant="outlined">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Icon & Avatar Badges</CardTitle>
              <p className="air-body-sm">Badges seamlessly position themselves over Icons and Avatars.</p>
            </div>
            <Button variant="text" active={$bind(codeState, 'icon')}>
              <Icon name={() => (codeState.icon ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.icon ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.icon}>
            <CardBody>
              <IconBadge />
            </CardBody>
          </Show>
          <Show when={() => codeState.icon}>
            <CardBody>
              <CodeBlock code={async () => (await import('./IconBadge.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>

        <Card variant="outlined">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Semantic Variants</CardTitle>
              <p className="air-body-sm">
                Badges support standard semantic colors: primary, secondary, tertiary, error, and surface.
              </p>
            </div>
            <Button variant="text" active={$bind(codeState, 'variants')}>
              <Icon name={() => (codeState.variants ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.variants ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.variants}>
            <CardBody>
              <Variants />
            </CardBody>
          </Show>
          <Show when={() => codeState.variants}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Variants.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>
      </CardGroup>
    </div>
  );
}, 'BadgeDemo');

export const BadgePage = page(badgeRoute).render(() => <BadgeDemo />);
export default BadgePage;
