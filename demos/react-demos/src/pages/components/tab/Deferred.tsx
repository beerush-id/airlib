import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardSubtitle,
  CardTitle,
  Icon,
  Tab,
  TabButton,
  TabContent,
  TabList,
} from '@airlib/react-ui/components';
import { effect, mutable, render, setup } from '@anchorlib/react';

const HeavyChartWidget = setup(() => {
  const state = mutable({
    loading: true,
  });

  effect(() => {
    const timer = setTimeout(() => {
      state.loading = false;
    }, 1500);
    return () => clearTimeout(timer);
  });

  return render(() => (
    <Card variant="outlined" className="p-8">
      {state.loading ? (
        <div className="flex flex-col items-center gap-3 text-primary">
          <Icon name="sync" className="animate-spin text-3xl" />
          <span className="air-label-md">Loading Heavy Dataset (100k+ rows)...</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 w-full">
          <Icon name="bar_chart" className="text-6xl text-tertiary" />
          <h3 className="air-title-md">Q3 Performance Metrics</h3>
        </div>
      )}
    </Card>
  ));
}, 'HeavyChartWidget');

export default () => (
  <Tab value="summary" deferred>
    <TabList>
      <TabButton name="summary">Summary</TabButton>
      <TabButton name="reports">Detailed Reports (Heavy)</TabButton>
    </TabList>

    <TabContent name="summary" className="air-card">
      <CardHeader>
        <CardTitle>Account Summary</CardTitle>
        <CardSubtitle>Your account is in good standing.</CardSubtitle>
      </CardHeader>
      <CardBody>
        <p className="air-body-md">
          The Detailed Reports tab contains a heavy data visualization widget. Because this Tab group is marked with{' '}
          <code>deferred</code>, the chart widget won't be mounted into the DOM, and won't fetch its massive dataset,
          until you actually click the tab.
        </p>
      </CardBody>
    </TabContent>

    <TabContent name="reports" className="air-card">
      <CardHeader>
        <CardTitle>Detailed Reports</CardTitle>
        <CardSubtitle>
          This component was just mounted. Check the loading state below.
        </CardSubtitle>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <HeavyChartWidget />
        <div className="flex justify-end">
          <Button variant="outlined">
            <Icon name="download" /> Export CSV
          </Button>
        </div>
      </CardBody>
    </TabContent>
  </Tab>
);
