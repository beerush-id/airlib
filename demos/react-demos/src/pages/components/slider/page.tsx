import { Card, CardBody, CardGroup, CardHeader, CardTitle, Field, FieldLabel } from '@airlib/react-ui/components';
import { Slider } from '@airlib/react-ui/form';
import { $bind, mutable, page, setup } from '@anchorlib/react';
import { sliderRoute } from '../route.js';

const SliderDemo = setup(() => {
  const data = mutable({
    continuous: 40,
    discrete: 3,
  });

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
            <div className="flex flex-col gap-8 max-w-md w-full">

              <Field>
                <FieldLabel required>Volume</FieldLabel>
                <Slider min={0} max={100} value={$bind(data, 'continuous')} />
              </Field>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Discrete Slider</CardTitle>
            <p className="air-body-sm">Use discrete sliders with step value when specific values are required.</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-8 max-w-md w-full">
              <Field>
                <FieldLabel>Rating</FieldLabel>
                <Slider min={1} max={5} step={1} value={$bind(data, 'discrete')} />
              </Field>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'SliderDemo');

export const SliderPage = page(sliderRoute).render(() => <SliderDemo />);

export default SliderPage;
