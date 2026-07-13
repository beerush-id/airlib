import { Avatar, Icon } from '@airlib/react-ui/components';

export default () => (
  <div className="flex flex-wrap gap-4 items-center">
    <Avatar variant="primary" shape="circle">
      <Icon name="person" />
    </Avatar>
    <Avatar variant="primary" shape="rounded">
      <Icon name="description" />
    </Avatar>
    <Avatar variant="secondary" size="lg" shape="circle" alt="Alex Smith" />
    <Avatar variant="secondary" size="lg" shape="rounded" alt="Alex Smith" />
  </div>
);
