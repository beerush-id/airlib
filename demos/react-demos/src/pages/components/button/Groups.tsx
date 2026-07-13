import { Button, ButtonGroup, Icon, IconButton } from '@airlib/react-ui/components';

export default () => (
  <div className="flex flex-col gap-6">
    <div className="flex flex-wrap gap-4 items-center justify-between">
      <ButtonGroup>
        <Button>Left</Button>
        <Button>Middle</Button>
        <Button>Right</Button>
      </ButtonGroup>
      <div className="air-split-button-group">
        <Button variant="tonal">Publish</Button>
        <IconButton variant="tonal">
          <Icon name="arrow_drop_down" />
        </IconButton>
      </div>
      <div className="air-segmented-group">
        <Button variant="tonal" aria-pressed="true">
          Day
        </Button>
        <Button variant="tonal">Week</Button>
        <Button variant="tonal">Month</Button>
      </div>
    </div>

    <div className="air-divider"></div>

    <div>
      <h3 className="air-title-md text-on-surface-variant mb-4">Small</h3>
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <ButtonGroup>
          <Button size="sm">Left</Button>
          <Button size="sm">Middle</Button>
          <Button size="sm">Right</Button>
        </ButtonGroup>
        <div className="air-split-button-group">
          <Button size="sm" variant="tonal">
            Publish
          </Button>
          <IconButton size="sm" variant="tonal">
            <Icon name="arrow_drop_down" />
          </IconButton>
        </div>
        <div className="air-segmented-group">
          <Button size="sm" variant="tonal" aria-pressed="true">
            Day
          </Button>
          <Button size="sm" variant="tonal">
            Week
          </Button>
          <Button size="sm" variant="tonal">
            Month
          </Button>
        </div>
      </div>
    </div>

    <div className="air-divider"></div>

    <div>
      <h3 className="air-title-md text-on-surface-variant mb-4">Large</h3>
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <ButtonGroup>
          <Button size="lg">Left</Button>
          <Button size="lg">Middle</Button>
          <Button size="lg">Right</Button>
        </ButtonGroup>
        <div className="air-split-button-group">
          <Button size="lg" variant="tonal">
            Publish
          </Button>
          <IconButton size="lg" variant="tonal">
            <Icon name="arrow_drop_down" />
          </IconButton>
        </div>
        <div className="air-segmented-group">
          <Button size="lg" variant="tonal" aria-pressed="true">
            Day
          </Button>
          <Button size="lg" variant="tonal">
            Week
          </Button>
          <Button size="lg" variant="tonal">
            Month
          </Button>
        </div>
      </div>
    </div>

    <div className="air-divider"></div>

    <div>
      <h3 className="air-title-md text-on-surface-variant mb-4">Extra Large</h3>
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <ButtonGroup>
          <Button size="xl">Left</Button>
          <Button size="xl">Middle</Button>
          <Button size="xl">Right</Button>
        </ButtonGroup>
        <div className="air-split-button-group">
          <Button size="xl" variant="tonal">
            Publish
          </Button>
          <IconButton size="xl" variant="tonal">
            <Icon name="arrow_drop_down" />
          </IconButton>
        </div>
        <div className="air-segmented-group">
          <Button size="xl" variant="tonal" aria-pressed="true">
            Day
          </Button>
          <Button size="xl" variant="tonal">
            Week
          </Button>
          <Button size="xl" variant="tonal">
            Month
          </Button>
        </div>
      </div>
    </div>
  </div>
);
