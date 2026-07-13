import { Icon, IconButton } from '@airlib/react-ui/components';

export default () => (
  <div className="flex gap-4 items-center justify-center">
    <IconButton>
      <Icon name="star" />
    </IconButton>
    <IconButton variant="filled">
      <Icon name="star" />
    </IconButton>
    <IconButton variant="tonal">
      <Icon name="star" />
    </IconButton>
    <IconButton variant="outlined">
      <Icon name="star" />
    </IconButton>
  </div>
);
