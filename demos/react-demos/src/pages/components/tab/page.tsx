import { Card, CardBody, CardGroup, CardHeader, CardTitle } from '@airlib/react-ui/components';
import { page, setup } from '@anchorlib/react';
import { tabRoute } from '../route.js';

const TabDemo = setup(() => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Tabs</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">Tabs organize content into selectable sections.</p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Tabs (CSS Only)</CardTitle>
            <p className="air-body-sm">
              For the React component wrapper, see the main UI page demo. This demonstrates the CSS structure.
            </p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4 max-w-lg">
              <div className="air-tab flex-1">
                <div role="tablist" className="air-tab-list">
                  <button role="tab" className="air-tab-item" aria-selected="true">
                    Flight
                    <div className="air-tab-indicator w-full" />
                  </button>
                  <button role="tab" className="air-tab-item" aria-selected="false">
                    Hotel
                  </button>
                  <button role="tab" className="air-tab-item" aria-selected="false">
                    Car
                  </button>
                </div>
                <div role="tabpanel" className="air-tab-content p-4 air-body-md text-on-surface-variant">
                  Tab content goes here.
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'TabDemo');

export const TabPage = page(tabRoute).render(() => <TabDemo />);

export default TabPage;
