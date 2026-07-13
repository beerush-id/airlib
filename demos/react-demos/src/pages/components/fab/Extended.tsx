import { Fab, Icon } from '@airlib/react-ui/components';

export default () => (
  <div className="flex gap-6 items-center">
    <Fab extended>
      <Icon name="add" />
      <span>Create New</span>
    </Fab>
    <Fab extended variant="secondary">
      <Icon name="edit" />
      <span>Compose</span>
    </Fab>
    <Fab extended variant="tertiary">
      <Icon name="navigation" />
      <span>Navigate</span>
    </Fab>
  </div>
);
