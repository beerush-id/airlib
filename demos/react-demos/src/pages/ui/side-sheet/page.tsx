import { Card, CardBody, CardGroup, CardHeader, CardTitle } from '@airlib/react-ui/components';
import { page, setup } from '@anchorlib/react';
import { sideSheetRoute } from '../route.js';

const SideSheetDemo = setup(() => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Side Sheet</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Side sheets show supplementary content that slides in from the edge of the screen.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Modal Side Sheet</CardTitle>
            <p className="air-body-sm">A side sheet that blocks interaction with the rest of the screen.</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4 relative overflow-hidden h-96">
              <div className="p-4">
                <h3 className="air-title-md mb-4">Background Content</h3>
                <p className="air-body-md text-on-surface-variant">The side sheet slides over this content.</p>
              </div>
              <div className="air-side-sheet-scrim absolute" data-state="open" style={{ position: 'absolute' }}></div>
              <div
                className="air-side-sheet air-side-sheet-right air-side-sheet-surface absolute"
                data-state="open"
                style={{ position: 'absolute', maxWidth: '60%' }}
              >
                <div className="p-4">
                  <h4 className="air-title-sm mb-4">Sheet Content</h4>
                  <div className="flex flex-col gap-2">
                    <div className="h-8 bg-surface-container rounded-md"></div>
                    <div className="h-8 bg-surface-container rounded-md"></div>
                    <div className="h-8 bg-surface-container rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'SideSheetDemo');

export const SideSheetPage = page(sideSheetRoute).render(() => <SideSheetDemo />);
export default SideSheetPage;
