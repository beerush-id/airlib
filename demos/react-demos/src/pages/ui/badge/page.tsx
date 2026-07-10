import {
  Badge,
  BadgeContainer,
  BadgeDot,
  Button,
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  CardTitle,
} from '@airlib/react-ui/components';
import { page, setup } from '@anchorlib/react';
import { badgeRoute } from '../route.js';

const BadgeDemo = setup(() => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Badges</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">Badges show notifications, counts, or status.</p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <p className="air-body-sm">Badges can be dots or contain numbers to indicate counts.</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-8 items-center">
              <BadgeContainer>
                <Button variant="tonal">Notifications</Button>
                <BadgeDot />
              </BadgeContainer>
              <BadgeContainer>
                <Button variant="tonal">Messages</Button>
                <Badge>3</Badge>
              </BadgeContainer>
              <BadgeContainer>
                <Button variant="tonal">Alerts</Button>
                <Badge>99+</Badge>
              </BadgeContainer>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'BadgeDemo');

export const BadgePage = page(badgeRoute).render(() => <BadgeDemo />);
export default BadgePage;
