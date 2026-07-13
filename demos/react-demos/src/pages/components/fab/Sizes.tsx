import { Fab, Icon } from '@airlib/react-ui/components';

export default () => (
  <div className="flex gap-6 items-end">
    <Fab variant="secondary" size="sm">
      <Icon name="add" />
    </Fab>
    <Fab variant="secondary">
      <Icon name="add" />
    </Fab>
    <Fab variant="secondary" size="lg">
      <Icon name="add" />
    </Fab>
  </div>
);
