import { createTab } from '@airlib/react-ui';

const tabNames = ['flight', 'hotel', 'car'] as const;
const Tab = createTab<(typeof tabNames)[number]>();

export function TabDemo() {
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
}
