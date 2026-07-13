import { Avatar, Icon } from '@airlib/react-ui/components';

export default () => (
  <div className="flex flex-wrap gap-4 items-center">
    <Avatar variant="surface">
      <Icon name="person" />
    </Avatar>
    <Avatar variant="primary">
      <Icon name="dns" />
    </Avatar>
    <Avatar variant="secondary">
      <Icon name="verified_user" />
    </Avatar>
    <Avatar variant="tertiary">
      <Icon name="memory" />
    </Avatar>
    <Avatar variant="error">
      <Icon name="backup" />
    </Avatar>
    <Avatar variant="primary" alt="Alex Smith" />
    <Avatar variant="secondary" alt="Jane Doe" />
  </div>
);
