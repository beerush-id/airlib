import { Fab, Icon } from '@airlib/react-ui/components';

export default () => (
  <div className="flex gap-6 items-center">
    <Fab>
      <Icon name="edit" />
    </Fab>
    <Fab variant="surface">
      <Icon name="edit" />
    </Fab>
    <Fab variant="secondary">
      <Icon name="edit" />
    </Fab>
    <Fab variant="tertiary">
      <Icon name="edit" />
    </Fab>
  </div>
);
