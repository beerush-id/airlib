import { Icon, IconButton } from '@airlib/react-ui/components';

export default () => (
  <div className="flex gap-4 items-center justify-center">
    <IconButton variant="tonal" size="xs">
      <Icon name="star" />
    </IconButton>
    <IconButton variant="tonal" size="sm">
      <Icon name="star" />
    </IconButton>
    <IconButton variant="tonal">
      <Icon name="star" />
    </IconButton>
    <IconButton variant="tonal" size="lg">
      <Icon name="star" />
    </IconButton>
    <IconButton variant="tonal" size="xl">
      <Icon name="star" />
    </IconButton>
    <IconButton variant="tonal" size="xxl">
      <Icon name="star" />
    </IconButton>
  </div>
);
