import { Avatar, Icon } from '@airlib/react-ui/components';

export default () => (
  <div className="flex flex-wrap gap-6 items-center">
    <Avatar variant="primary" size="sm">
      <Icon name="person" />
    </Avatar>
    <Avatar variant="primary" size="md">
      <Icon name="person" />
    </Avatar>
    <Avatar variant="primary" size="lg">
      <Icon name="person" />
    </Avatar>
    <Avatar variant="tertiary" size="sm" alt="Alex Smith" />
    <Avatar variant="tertiary" size="md" alt="Alex Smith" />
    <Avatar variant="tertiary" size="lg" alt="Alex Smith" />
  </div>
);
