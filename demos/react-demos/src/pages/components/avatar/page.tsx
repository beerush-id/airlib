import { Avatar, Card, CardBody, CardGroup, CardHeader, CardTitle, Icon } from '@airlib/react-ui/components';
import { page, setup } from '@anchorlib/react';
import { avatarRoute } from '../route.js';

const AvatarDemo = setup(() => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Avatars</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Avatars represent users, entities, or icons across lists, cards, and navigation items. They support images,
          automatic text abbreviations, and custom icons.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Image & Monogram Fallbacks</CardTitle>
            <p className="air-body-sm">
              Pass `src` and `alt`. If the image is omitted or fails to load, the avatar automatically computes and
              displays monogram initials (`abbr`) from `alt`.
            </p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex flex-col gap-1.5 items-center">
                <Avatar
                  size="lg"
                  variant="primary"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=faces"
                  alt="Jane Doe"
                />
                <span className="air-body-sm text-on-surface-variant">Image URL</span>
              </div>

              <div className="flex flex-col gap-1.5 items-center">
                <Avatar
                  size="lg"
                  variant="secondary"
                  src="https://broken-image-link-fallback.example.org/photo.jpg"
                  alt="Alex Smith"
                />
                <span className="air-body-sm text-on-surface-variant">Error to Abbr (`AS`)</span>
              </div>

              <div className="flex flex-col gap-1.5 items-center">
                <Avatar size="lg" variant="tertiary" alt="Maria Garcia" />
                <span className="air-body-sm text-on-surface-variant">Auto Abbr (`MG`)</span>
              </div>

              <div className="flex flex-col gap-1.5 items-center">
                <Avatar size="lg" variant="error">
                  PRO
                </Avatar>
                <span className="air-body-sm text-on-surface-variant">Explicit Initials (`PRO`)</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Semantic Variants</CardTitle>
            <p className="air-body-sm">
              Avatars support all semantic color palettes (`surface`, `primary`, `secondary`, `tertiary`, and `error`)
              with icons and text monograms.
            </p>
          </CardHeader>
          <CardBody>
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
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Sizing (`sm`, `md`, `lg`)</CardTitle>
            <p className="air-body-sm">
              Compact (`32px`), standard (`40px`), and large (`56px`) avatar sizes to accommodate various density
              requirements.
            </p>
          </CardHeader>
          <CardBody>
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
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Shapes (`circle`, `rounded`)</CardTitle>
            <p className="air-body-sm">
              Circular (`rounded-full`) or rounded square (`rounded-md`) shapes suitable for both user profiles and
              entity representations.
            </p>
          </CardHeader>
          <CardBody>
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
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'AvatarDemo');

export const AvatarPage = page(avatarRoute).render(() => <AvatarDemo />);
export default AvatarPage;
