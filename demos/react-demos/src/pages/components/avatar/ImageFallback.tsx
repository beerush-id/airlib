import { Avatar } from '@airlib/react-ui/components';

export default () => (
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
);
