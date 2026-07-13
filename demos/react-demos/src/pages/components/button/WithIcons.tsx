import { Button, Icon, Tooltip } from '@airlib/react-ui/components';

export default () => (
  <div className="flex flex-wrap gap-4 max-w-2xl mx-auto items-center justify-center">
    <Button>
      <Icon name="add" />
      <span>Leading</span>
      <Tooltip>Add leading tooltip</Tooltip>
    </Button>
    <Button variant="elevated">
      <span>Trailing</span>
      <Icon name="arrow_forward" />
    </Button>
    <Button variant="tonal">
      <Icon name="favorite" />
      <span>Both</span>
      <Icon name="close" />
    </Button>
    <Button variant="outlined">
      <Icon name="search" />
      <span>Search</span>
    </Button>
  </div>
);
