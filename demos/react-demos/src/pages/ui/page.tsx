import { createTab, dialogConfirm } from '@airlib/react-ui/components';
import { webWindow } from '@airlib/react-ui/lib';
import { page, setup } from '@anchorlib/react';
import DemoWindow from './DemoWindow.js';
import { uiRoute } from './route.js';

const DialogConfirmDemo = setup(() => {
  const handleClick = () => {
    dialogConfirm({
      type: 'help',
      title: 'Are you sure?',
      message: 'Are you sure you want to perform this action?',
      // warningMessage: "This action can't be undone and you may lost access to the state.",
    }).then(console.log);
  };

  return (
    <div className="flex items-center gap-4">
      <button type="button" className="air-button" onClick={handleClick}>
        Confirm Action
      </button>
      <button type="button" className="air-button" onClick={() => demoWin.open()}>
        Open Window
      </button>
    </div>
  );
}, 'DialogConfirmDemo');

const demoWin = webWindow({
  name: 'asset-browser',
  title: 'Asset Browser',
  description: 'Multi window asset browser is awesome.',
  multiple: true,
  remember: 'default',
  rect: { minWidth: 960, minHeight: 680 },
}).render(DemoWindow);

const TabDemo = setup(() => {
  const tabNames = ['flight', 'hotel', 'car'] as const;
  const Tab = createTab<(typeof tabNames)[number]>();

  return (
    <div className="mt-8 mb-16 w-full gap-4 flex flex-col">
      <h2 className="air-headline-sm">Tabs</h2>
      <Tab className="air-tab flex-1" value="flight">
        <Tab.List>
          <Tab.Button name="flight">
            <span>Flight</span>
          </Tab.Button>
          <Tab.Button name="hotel">
            <span>Hotel</span>
          </Tab.Button>
          <Tab.Button name="car">
            <span>Car</span>
          </Tab.Button>
        </Tab.List>
        <Tab.Content name="flight" className="air-card">
          <div className="air-card-header">
            <h2 className="air-card-title">Flight</h2>
          </div>
          <div className="air-card-body">Flight tab content goes here.</div>
        </Tab.Content>
        <Tab.Content name="hotel" className="air-card">
          <div className="air-card-header">
            <h2 className="air-card-title">Hotel</h2>
          </div>
          <div className="air-card-body">Hotel tab content goes here.</div>
        </Tab.Content>
        <Tab.Content name="car" className="air-card">
          <div className="air-card-header">
            <h2 className="air-card-title">Car</h2>
          </div>
          <div className="air-card-body">Car tab content goes here.</div>
        </Tab.Content>
      </Tab>
      <Tab className="air-tab flex-1" value="flight" deferred>
        <Tab.List>
          <Tab.Button name="flight">
            <span>Flight</span>
          </Tab.Button>
          <Tab.Button name="hotel">
            <span>Hotel</span>
          </Tab.Button>
          <Tab.Button name="car">
            <span>Car</span>
          </Tab.Button>
        </Tab.List>
        <Tab.Content name="flight" className="air-card">
          <div className="air-card-header">
            <h2 className="air-card-title">Flight</h2>
          </div>
          <div className="air-card-body">Deferred flight tab content goes here.</div>
        </Tab.Content>
        <Tab.Content name="hotel" className="air-card">
          <div className="air-card-header">
            <h2 className="air-card-title">Hotel</h2>
          </div>
          <div className="air-card-body">Deferred hotel tab content goes here.</div>
        </Tab.Content>
        <Tab.Content name="car" className="air-card">
          <div className="air-card-header">
            <h2 className="air-card-title">Car</h2>
          </div>
          <div className="air-card-body">Deferred car tab content goes here.</div>
        </Tab.Content>
      </Tab>
    </div>
  );
}, 'TabDemo');

export const UIPage = page(uiRoute).render(() => (
  <>
    <h1>React UI</h1>
    <DialogConfirmDemo />
    <TabDemo />
  </>
));
