import { Fab, Icon } from '@airlib/react-ui/components';

export default () => (
  <div className="flex flex-col gap-6">
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
      <Fab extended>
        <Icon name="add" />
        <span>Create New</span>
      </Fab>
    </div>

    <div className="air-divider"></div>

    <div>
      <h3 className="air-title-md text-on-surface-variant mb-4">Sizes</h3>
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
    </div>
  </div>
);
