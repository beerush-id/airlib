import { Card, CardBody, CardGroup, CardHeader, CardTitle } from '@airlib/react-ui/components';
import { page, setup } from '@anchorlib/react';
import { cardRoute } from '../route.js';

const CardDemo = setup(() => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Cards</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Cards contain content and actions about a single subject. They are pure CSS components.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Standard Cards</CardTitle>
            <p className="air-body-sm">Cards come in three variants: elevated (default), filled, and outlined.</p>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Elevated (Default)</CardTitle>
                </CardHeader>
                <CardBody>Uses surface-container-low with a shadow to express elevation.</CardBody>
              </Card>
              <Card variant="filled">
                <CardHeader>
                  <CardTitle>Filled</CardTitle>
                </CardHeader>
                <CardBody>Uses surface-container-highest without a shadow.</CardBody>
              </Card>
              <Card variant="outlined">
                <CardHeader>
                  <CardTitle>Outlined</CardTitle>
                </CardHeader>
                <CardBody>Uses the default surface color with an outline.</CardBody>
              </Card>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Segmented Card Group</CardTitle>
            <p className="air-body-sm">Cards can be grouped together into a segmented surface.</p>
          </CardHeader>
          <CardBody>
            <div className="flex justify-center">
              <div className="max-w-sm w-full">
                <CardGroup>
                  <Card>
                    <CardHeader>
                      <CardTitle>Header Card</CardTitle>
                    </CardHeader>
                    <CardBody>This is the first segment of the card group. It has a large top radius.</CardBody>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Middle Card</CardTitle>
                    </CardHeader>
                    <CardBody>This segment sits in the middle and uses the small inner radius on all corners.</CardBody>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Footer Card</CardTitle>
                    </CardHeader>
                    <CardBody>This is the final segment with a large bottom radius.</CardBody>
                  </Card>
                </CardGroup>
              </div>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'CardDemo');

export const CardPage = page(cardRoute).render(() => <CardDemo />);
export default CardPage;
