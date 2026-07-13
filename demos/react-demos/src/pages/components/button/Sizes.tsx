import { Button, Icon } from '@airlib/react-ui/components';

export default () => (
  <div className="flex flex-wrap gap-4 items-center justify-center">
    <Button variant="tonal" size="xs">
      <Icon name="star" />
      <span>Extra Small</span>
    </Button>
    <Button variant="tonal" size="sm">
      <Icon name="star" />
      <span>Small</span>
    </Button>
    <Button variant="tonal">
      <Icon name="star" />
      <span>Medium</span>
    </Button>
    <Button variant="tonal" size="lg">
      <Icon name="star" />
      <span>Large</span>
    </Button>
    <Button variant="tonal" size="xl">
      <Icon name="star" />
      <span>Extra Large</span>
    </Button>
  </div>
);
