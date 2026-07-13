import { Card, CardBody, CardGroup, CardHeader, CardTitle } from '@airlib/react-ui/components';
import { page, setup } from '@anchorlib/react';
import { sliderRoute } from '../route.js';

const SliderDemo = setup(() => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Slider</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Sliders allow users to make selections from a range of values. The native input range can be styled using
          Material 3 CSS utilities.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Continuous Slider</CardTitle>
            <p className="air-body-sm">Select a value along a continuous range.</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-8 max-w-md">
              <div className="flex items-center h-12 w-full">
                <input type="range" className="air-slider-primary w-full" min="0" max="100" defaultValue="40" />
              </div>
              <div className="flex items-center h-12 w-full">
                <input type="range" className="air-slider-secondary w-full" min="0" max="100" defaultValue="70" />
              </div>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'SliderDemo');

export const SliderPage = page(sliderRoute).render(() => <SliderDemo />);

export default SliderPage;
