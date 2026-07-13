import { Icon, IconButton } from '@airlib/react-ui/components';

export default () => (
  <div className="flex flex-col gap-6">
    <div className="flex gap-4 items-center">
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

    <h3 className="air-title-md text-on-surface-variant mt-4">Sizes</h3>
    <div className="flex gap-4 items-center">
      <IconButton variant="outlined" size="xs" active={false}>
        <Icon name="star" />
      </IconButton>
      <IconButton variant="outlined" size="sm" active={false}>
        <Icon name="star" />
      </IconButton>
      <IconButton variant="outlined" active={false}>
        <Icon name="star" />
      </IconButton>
      <IconButton variant="outlined" size="lg" active={false}>
        <Icon name="star" />
      </IconButton>
      <IconButton variant="outlined" size="xl" active={false}>
        <Icon name="star" />
      </IconButton>
    </div>
  </div>
);
