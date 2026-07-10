import { Card, CardBody, CardGroup, CardHeader, CardTitle } from '@airlib/react-ui/components';
import { page, setup } from '@anchorlib/react';
import { snackbarRoute } from '../route.js';

const SnackbarDemo = setup(() => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Snackbars</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Snackbars provide brief messages about app processes at the bottom of the screen.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Standard Snackbar</CardTitle>
            <p className="air-body-sm">A brief message with an optional action.</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4 max-w-lg">
              <div
                className="air-snackbar flex items-center justify-between min-w-[300px]"
                data-state="visible"
                style={{ position: 'relative', bottom: 'auto', left: 'auto', transform: 'none' }}
              >
                Single-line snackbar
                <button className="air-snackbar-action ml-4 font-medium">Action</button>
              </div>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'SnackbarDemo');

export const SnackbarPage = page(snackbarRoute).render(() => <SnackbarDemo />);
export default SnackbarPage;
