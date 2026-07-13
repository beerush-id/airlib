import { Badge, BadgeContainer, Button } from '@airlib/react-ui/components';

export default () => (
  <div className="flex flex-wrap gap-8 items-center">
    <BadgeContainer>
      <Button variant="tonal">Default</Button>
      <Badge>1</Badge>
    </BadgeContainer>
    <BadgeContainer>
      <Button variant="tonal">Primary</Button>
      <Badge variant="primary">2</Badge>
    </BadgeContainer>
    <BadgeContainer>
      <Button variant="tonal">Secondary</Button>
      <Badge variant="secondary">3</Badge>
    </BadgeContainer>
    <BadgeContainer>
      <Button variant="tonal">Tertiary</Button>
      <Badge variant="tertiary">4</Badge>
    </BadgeContainer>
    <BadgeContainer>
      <Button variant="tonal">Error</Button>
      <Badge variant="error">5</Badge>
    </BadgeContainer>
    <BadgeContainer>
      <Button variant="tonal">Surface</Button>
      <Badge variant="surface">6</Badge>
    </BadgeContainer>
  </div>
);
