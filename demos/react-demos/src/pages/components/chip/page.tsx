import { Chip, Card, CardBody, CardGroup, CardHeader, CardTitle } from '@airlib/react-ui/components';
import { page, setup } from '@anchorlib/react';
import { chipRoute } from '../route.js';

const ChipDemo = setup(() => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Chips</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Chips help people enter information, make selections, filter content, or trigger actions.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Standard Chips</CardTitle>
            <p className="air-body-sm">Chips can be outlined, elevated, or selected.</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-4 items-center">
              <Chip variant="outlined">Outlined Chip</Chip>
              <Chip variant="elevated">Elevated Chip</Chip>
              <Chip selected>Selected Chip</Chip>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Sizes</CardTitle>
            <p className="air-body-sm">Chips come in small, medium, and large sizes.</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-4 items-center">
              <Chip className="air-chip-sm">Small Chip</Chip>
              <Chip className="air-chip-md">Medium Chip</Chip>
              <Chip className="air-chip-lg">Large Chip</Chip>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'ChipDemo');

export const ChipPage = page(chipRoute).render(() => <ChipDemo />);
export default ChipPage;
