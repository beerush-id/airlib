import { Avatar, Badge, BadgeContainer, BadgeDot, Icon } from '@airlib/react-ui/components';

export default () => (
  <div className="flex flex-wrap gap-8 items-center">
    <BadgeContainer>
      <Icon name="notifications" className="text-2xl" />
      <BadgeDot />
    </BadgeContainer>
    <BadgeContainer>
      <Icon name="mail" className="text-2xl" />
      <Badge>4</Badge>
    </BadgeContainer>
    <BadgeContainer>
      <Avatar shape="circle">
        <Icon name="person" />
      </Avatar>
      <BadgeDot variant="secondary" />
    </BadgeContainer>
    <BadgeContainer>
      <Avatar shape="rounded">
        <Icon name="shopping_cart" />
      </Avatar>
      <Badge variant="primary">2</Badge>
    </BadgeContainer>
  </div>
);
