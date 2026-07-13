import { Badge, BadgeContainer, Button } from '@airlib/react-ui/components';

export default () => (
  <div className="flex flex-wrap gap-8 items-center">
    <BadgeContainer>
      <Button variant="tonal">Messages</Button>
      <Badge>3</Badge>
    </BadgeContainer>
    <BadgeContainer>
      <Button variant="tonal">Alerts</Button>
      <Badge>99+</Badge>
    </BadgeContainer>
    <BadgeContainer>
      <Button variant="tonal">Drafts</Button>
      <Badge>New</Badge>
    </BadgeContainer>
  </div>
);
