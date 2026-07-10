import { createTab } from '@airlib/react-ui';
import { mutable, setup, snippet } from '@anchorlib/react';

const tabNames = ['flight', 'hotel', 'car', 'counter'] as const;
const Tab = createTab<(typeof tabNames)[number]>();

const Counter = setup(() => {
  const count = mutable(0);

  const CounterBadge = snippet(() => <span className="air-badge">{count.value}</span>, 'CounterBadge');

  return (
    <>
      <div className="air-card-header">
        <h2 className="air-card-title">Counter</h2>
      </div>
      <div className="air-card-body flex items-center justify-between gap-4">
        <div className="air-chip">
          <span>Notifications</span>
          <CounterBadge />
        </div>
        <button onClick={() => count.value++} className="air-button">
          Increment
        </button>
      </div>
    </>
  );
}, 'TabCounter');

export function TabDemo() {
  return (
    <div className="w-full gap-4 flex flex-col">
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
          <Tab.Button name="counter">
            <span>Counter</span>
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
        <Tab.Content name="counter" className="air-card">
          <Counter />
        </Tab.Content>
      </Tab>
      <Tab className="air-tab flex-1" value="counter" deferred>
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
          <Tab.Button name="counter">
            <span>Counter</span>
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
        <Tab.Content name="counter" className="air-card">
          <Counter />
        </Tab.Content>
      </Tab>
    </div>
  );
}
