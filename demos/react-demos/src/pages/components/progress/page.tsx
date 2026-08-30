import {
  CircularProgress,
  LinearProgress,
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  CardTitle,
} from '@airlib/react-ui/components';
import { page, setup } from '@airlib/react';
import { progressRoute } from '../route.js';

const ProgressDemo = setup(() => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Progress</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Progress indicators express an unspecified wait time or display the length of a process.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Linear Progress</CardTitle>
            <p className="air-body-sm">Displays the progress of an operation along a linear track.</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-8 max-w-md">
              <div>
                <h3 className="air-label-md mb-2 text-on-surface-variant">Determinate (45%)</h3>
                <LinearProgress value={45} />
              </div>
              <div>
                <h3 className="air-label-md mb-2 text-on-surface-variant">Indeterminate</h3>
                <LinearProgress />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Circular Progress</CardTitle>
            <p className="air-body-sm">Displays progress along a circular track.</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-8 items-center">
              <div>
                <h3 className="air-label-md mb-4 text-on-surface-variant text-center">Standard</h3>
                <div className="w-12 h-12">
                  <CircularProgress />
                </div>
              </div>
              <div>
                <h3 className="air-label-md mb-4 text-on-surface-variant text-center">Indeterminate</h3>
                <div className="w-12 h-12">
                  <CircularProgress indeterminate />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'ProgressDemo');

export const ProgressPage = page(progressRoute).render(() => <ProgressDemo />);
export default ProgressPage;
