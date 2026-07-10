import {
  Button,
  ButtonGroup,
  Fab,
  IconButton,
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  CardTitle,
} from '@airlib/react-ui/components';
import { page, setup } from '@anchorlib/react';
import { buttonRoute } from '../route.js';

const ButtonDemo = setup(() => {
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
          <CardHeader>
            <CardTitle>Standard Buttons</CardTitle>
            <p className="air-body-sm">Buttons have five primary variants for different levels of emphasis.</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-4 items-center">
              <Button>Filled</Button>
              <Button variant="elevated">Elevated</Button>
              <Button variant="tonal">Tonal</Button>
              <Button variant="outlined">Outlined</Button>
              <Button variant="text">Text</Button>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>With Icons</CardTitle>
            <p className="air-body-sm">Buttons can include icons to clarify their action.</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-4 items-center">
              <Button>
                <span className="air-icon text-[18px]">add</span>
                Leading
              </Button>
              <Button variant="elevated">
                Trailing
                <span className="air-icon text-[18px]">arrow_forward</span>
              </Button>
              <Button variant="tonal">
                <span className="air-icon text-[18px]">favorite</span>
                Both
                <span className="air-icon text-[18px]">close</span>
              </Button>
              <Button variant="outlined">
                <span className="air-icon text-[18px]">search</span>
                Search
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Sizes</CardTitle>
            <p className="air-body-sm">Buttons are available in various sizes from Extra Small to Extra Large.</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="tonal" className="air-button-xs">
                Extra Small
              </Button>
              <Button variant="tonal" className="air-button-sm">
                Small
              </Button>
              <Button variant="tonal">Medium</Button>
              <Button variant="tonal" className="air-button-lg">
                Large
              </Button>
              <Button variant="tonal" className="air-button-xl">
                Extra Large
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Icon Buttons</CardTitle>
            <p className="air-body-sm">
              Icon buttons are ideal for supplementary actions like bookmarking or settings.
            </p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-6">
              <div className="flex gap-4 items-center">
                <IconButton>
                  <span className="air-icon">star</span>
                </IconButton>
                <IconButton variant="filled">
                  <span className="air-icon">star</span>
                </IconButton>
                <IconButton variant="tonal">
                  <span className="air-icon">star</span>
                </IconButton>
                <IconButton variant="outlined">
                  <span className="air-icon">star</span>
                </IconButton>
              </div>

              <h3 className="air-title-md text-on-surface-variant mt-4">Sizes</h3>
              <div className="flex gap-4 items-center">
                <IconButton variant="tonal" className="air-icon-button-xs">
                  <span className="air-icon">star</span>
                </IconButton>
                <IconButton variant="tonal" className="air-icon-button-sm">
                  <span className="air-icon">star</span>
                </IconButton>
                <IconButton variant="tonal">
                  <span className="air-icon">star</span>
                </IconButton>
                <IconButton variant="tonal" className="air-icon-button-lg">
                  <span className="air-icon">star</span>
                </IconButton>
                <IconButton variant="tonal" className="air-icon-button-xl">
                  <span className="air-icon">star</span>
                </IconButton>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Floating Action Buttons (FAB)</CardTitle>
            <p className="air-body-sm">FABs represent the primary action of a screen.</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-6">
              <div className="flex gap-6 items-center">
                <Fab>
                  <span className="air-icon">edit</span>
                </Fab>
                <Fab variant="surface">
                  <span className="air-icon">edit</span>
                </Fab>
                <Fab variant="secondary">
                  <span className="air-icon">edit</span>
                </Fab>
                <Fab variant="tertiary">
                  <span className="air-icon">edit</span>
                </Fab>
                <Fab extended>
                  <span className="air-icon mr-2">add</span>
                  Create New
                </Fab>
              </div>

              <h3 className="air-title-md text-on-surface-variant mt-4">Sizes</h3>
              <div className="flex gap-6 items-end">
                <Fab variant="secondary" className="air-fab-sm">
                  <span className="air-icon">add</span>
                </Fab>
                <Fab variant="secondary">
                  <span className="air-icon">add</span>
                </Fab>
                <Fab variant="secondary" className="air-fab-lg">
                  <span className="air-icon">add</span>
                </Fab>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Button Groups</CardTitle>
            <p className="air-body-sm">Group related buttons together.</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-8 items-center">
              <ButtonGroup>
                <Button variant="outlined">Left</Button>
                <Button variant="outlined">Middle</Button>
                <Button variant="outlined">Right</Button>
              </ButtonGroup>
              <div className="air-split-button-group air-split-button-tonal">
                <button type="button" className="air-split-button-primary">
                  Publish
                </button>
                <button type="button" className="air-split-button-trailing">
                  <span className="air-icon">arrow_drop_down</span>
                </button>
              </div>
              <div className="air-segmented-group">
                <button className="air-segmented-button" aria-pressed="true">
                  Day
                </button>
                <button className="air-segmented-button">Week</button>
                <button className="air-segmented-button">Month</button>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Compact Tool & Icon Buttons</CardTitle>
            <p className="air-body-sm">
              Compact 32px tool buttons (<code className="text-primary font-mono">air-tool-button</code> for text
              labels) and square tool icon buttons (<code className="text-primary font-mono">air-tool-icon-button</code>{' '}
              for icons or formatting symbols) designed for toolbars and compact action bars.
            </p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-4 items-center">
              <button type="button" className="air-tool-button px-3">
                Action
              </button>
              <button type="button" className="air-tool-button active px-3" aria-pressed="true">
                Active Action
              </button>
              <button type="button" className="air-tool-icon-button font-bold">
                B
              </button>
              <button type="button" className="air-tool-icon-button italic active" aria-pressed="true">
                I
              </button>
              <button type="button" className="air-tool-icon-button underline">
                U
              </button>
              <button type="button" className="air-tool-icon-button">
                <span className="air-icon">settings</span>
              </button>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'ButtonDemo');

export const ButtonPage = page(buttonRoute).render(() => <ButtonDemo />);
export default ButtonPage;
