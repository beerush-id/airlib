import { Card, CardBody, CardGroup, CardHeader, CardTitle } from '@airlib/react-ui/components';
import { page, setup } from '@anchorlib/react';
import { pickerRoute } from '../route.js';

const PickerDemo = setup(() => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Pickers</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Date and time pickers allow users to select a specific date, time, or range.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Date Picker</CardTitle>
            <p className="air-body-sm">Select a specific date from a calendar view.</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4 max-w-sm">
              <div className="air-date-picker bg-surface-container-high p-4 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="air-label-large text-on-surface-variant">Select date</span>
                  <button className="air-icon-button">
                    <span className="air-icon">edit</span>
                  </button>
                </div>
                <div className="air-headline-large mb-6">Aug 23, 2023</div>
                <div className="flex justify-between items-center mb-4">
                  <span className="air-title-small">August 2023</span>
                  <div>
                    <button className="air-icon-button">
                      <span className="air-icon">chevron_left</span>
                    </button>
                    <button className="air-icon-button">
                      <span className="air-icon">chevron_right</span>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  <span className="air-body-small text-on-surface-variant w-10 h-10 leading-10">S</span>
                  <span className="air-body-small text-on-surface-variant w-10 h-10 leading-10">M</span>
                  <span className="air-body-small text-on-surface-variant w-10 h-10 leading-10">T</span>
                  <span className="air-body-small text-on-surface-variant w-10 h-10 leading-10">W</span>
                  <span className="air-body-small text-on-surface-variant w-10 h-10 leading-10">T</span>
                  <span className="air-body-small text-on-surface-variant w-10 h-10 leading-10">F</span>
                  <span className="air-body-small text-on-surface-variant w-10 h-10 leading-10">S</span>
                </div>
                <div className="air-date-picker-grid grid grid-cols-7 gap-1">
                  <button className="air-date-picker-cell air-body-sm">1</button>
                  <button className="air-date-picker-cell air-body-sm">2</button>
                  <button className="air-date-picker-cell air-body-sm">3</button>
                  <button role="gridcell" className="air-date-picker-cell air-body-sm" aria-selected="true">
                    4
                  </button>
                  <button className="air-date-picker-cell air-body-sm air-date-picker-cell-today">5</button>
                  <button className="air-date-picker-cell air-body-sm">6</button>
                  <button className="air-date-picker-cell air-body-sm">7</button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Time Picker</CardTitle>
            <p className="air-body-sm">Select a specific time using numerical input.</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4 max-w-sm">
              <div className="air-time-picker bg-surface-container-high p-6 rounded-3xl flex flex-col items-center gap-6">
                <span className="air-label-medium text-on-surface-variant self-start">Select time</span>
                <div className="flex items-center gap-2">
                  <button role="option" className="air-time-picker-unit" aria-selected="true">
                    12
                  </button>
                  <div className="air-time-picker-separator air-display-md">:</div>
                  <div className="air-time-picker-unit bg-surface-container text-on-surface">00</div>
                  <div className="flex flex-col border border-outline rounded-lg overflow-hidden ml-2">
                    <button className="px-3 py-2 bg-tertiary-container text-on-tertiary-container air-label-large">
                      AM
                    </button>
                    <button className="px-3 py-2 bg-surface text-on-surface air-label-large border-t border-outline">
                      PM
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'PickerDemo');

export const PickerPage = page(pickerRoute).render(() => <PickerDemo />);

export default PickerPage;
