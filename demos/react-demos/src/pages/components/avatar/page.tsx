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
import { avatarRoute } from '../route.js';
import ImageFallback from './ImageFallback.js';
import Semantic from './Semantic.js';
import Shapes from './Shapes.js';
import Sizing from './Sizing.js';

const AvatarDemo = setup(() => {
  const codeState = mutable({
    image: false,
    semantic: false,
    sizing: false,
    shapes: false,
  });

  return (
    <div className="w-full flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Avatars</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Avatars represent users, entities, or icons across lists, cards, and navigation items. They support images,
          automatic text abbreviations, and custom icons.
        </p>
      </div>

      <CardGroup className="w-full">
        <Card variant="outlined" className="w-full">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Image & Monogram Fallbacks</CardTitle>
              <p className="air-body-sm">
                Pass `src` and `alt`. If the image is omitted or fails to load, the avatar automatically computes and
                displays monogram initials (`abbr`) from `alt`.
              </p>
            </div>
            <Button variant="text" active={$bind(codeState, 'image')}>
              <Icon name={() => (codeState.image ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.image ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.image}>
            <CardBody>
              <ImageFallback />
            </CardBody>
          </Show>
          <Show when={() => codeState.image}>
            <CardBody>
              <CodeBlock code={async () => (await import('./ImageFallback.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>

        <Card variant="outlined">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Semantic Variants</CardTitle>
              <p className="air-body-sm">
                Avatars support all semantic color palettes (`surface`, `primary`, `secondary`, `tertiary`, and `error`)
                with icons and text monograms.
              </p>
            </div>
            <Button variant="text" active={$bind(codeState, 'semantic')}>
              <Icon name={() => (codeState.semantic ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.semantic ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.semantic}>
            <CardBody>
              <Semantic />
            </CardBody>
          </Show>
          <Show when={() => codeState.semantic}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Semantic.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>

        <Card variant="outlined">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Sizing (`sm`, `md`, `lg`)</CardTitle>
              <p className="air-body-sm">
                Compact (`32px`), standard (`40px`), and large (`56px`) avatar sizes to accommodate various density
                requirements.
              </p>
            </div>
            <Button variant="text" active={$bind(codeState, 'sizing')}>
              <Icon name={() => (codeState.sizing ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.sizing ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.sizing}>
            <CardBody>
              <Sizing />
            </CardBody>
          </Show>
          <Show when={() => codeState.sizing}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Sizing.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>

        <Card variant="outlined">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>Shapes (`circle`, `rounded`)</CardTitle>
              <p className="air-body-sm">
                Circular (`rounded-full`) or rounded square (`rounded-md`) shapes suitable for both user profiles and
                entity representations.
              </p>
            </div>
            <Button variant="text" active={$bind(codeState, 'shapes')}>
              <Icon name={() => (codeState.shapes ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.shapes ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.shapes}>
            <CardBody>
              <Shapes />
            </CardBody>
          </Show>
          <Show when={() => codeState.shapes}>
            <CardBody>
              <CodeBlock code={async () => (await import('./Shapes.tsx?raw')).default} />
            </CardBody>
          </Show>
        </Card>
      </CardGroup>
    </div>
  );
}, 'AvatarDemo');

export const AvatarPage = page(avatarRoute).render(() => <AvatarDemo />);
export default AvatarPage;
