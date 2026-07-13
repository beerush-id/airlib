import { BadgeContainer, BadgeDot, Button } from '@airlib/react-ui/components';

export default () => (
  <div className="flex flex-wrap gap-8 items-center">
    <BadgeContainer>
      <Button variant="tonal">Notifications</Button>
      <BadgeDot />
    </BadgeContainer>
    <BadgeContainer>
      <Button variant="tonal">Updates</Button>
      <BadgeDot variant="primary" />
    </BadgeContainer>
    <BadgeContainer>
      <Button variant="tonal">Warnings</Button>
      <BadgeDot variant="error" />
    </BadgeContainer>
  </div>
);
