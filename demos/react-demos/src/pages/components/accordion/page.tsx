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
import { accordionRoute } from '../route.js';
import Custom from './Custom.js';
import Individual from './Individual.js';
import Single from './Single.js';

const AccordionDemo = setup(() => {
  const codeState = mutable({
    single: false,
    individual: false,
    custom: false,
  });

  return (
    <div className="w-full flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Accordion</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Accordions organize complex interfaces into collapsible sections, supporting both mutually exclusive groups
          and independent panel expansion.
        </p>
      </div>

      <CardGroup className="w-full">
        <Card variant="outlined" className="w-full">
          <CardHeader className="flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <CardTitle>
                <span>Single Selection Group</span>
              </CardTitle>
              <CardSubtitle>
                When a `value` prop is provided to the `Accordion` container, only one section can remain open at a
                time.
              </CardSubtitle>
            </div>
            <Button variant="text" active={$bind(codeState, 'single')}>
              <Icon name={() => (codeState.single ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.single ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.single}>
            <CardBody>
              <Single />
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
              <CardTitle>Individual Expand & Collapse</CardTitle>
              <CardSubtitle>
                When used without a `value` prop, each item manages its own expansion state independently, allowing
                multiple open panels simultaneously.
              </CardSubtitle>
            </div>
            <Button variant="text" active={$bind(codeState, 'individual')}>
              <Icon name={() => (codeState.individual ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.individual ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.individual}>
            <CardBody>
              <Individual />
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
              <CardTitle>Custom Header & Composable Structure</CardTitle>
              <CardSubtitle>
                Use `AccordionHeader` and `AccordionContent` directly within `Accordion` for rich custom layouts with
                badges, icons, and status indicators.
              </CardSubtitle>
            </div>
            <Button variant="text" active={$bind(codeState, 'custom')}>
              <Icon name={() => (codeState.custom ? 'code_off' : 'code')} />
              <Tooltip>{() => (codeState.custom ? 'Hide Code' : 'Show Code')}</Tooltip>
            </Button>
          </CardHeader>
          <Show when={() => !codeState.custom}>
            <CardBody>
              <Custom />
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
}, 'AccordionDemo');

export const AccordionPage = page(accordionRoute).render(() => <AccordionDemo />);
export default AccordionPage;
