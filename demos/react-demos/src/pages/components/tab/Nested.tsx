import {
  Badge,
  Button,
  CardBody,
  CardHeader,
  CardSubtitle,
  CardTitle,
  Icon,
  List,
  ListItem,
  ListItemContent,
  ListSubtitle,
  ListTitle,
  Tab,
  TabButton,
  TabContent,
  TabList,
} from '@airlib/react-ui/components';

export default () => (
  <Tab value="app">
    <TabList>
      <TabButton name="app">Application</TabButton>
      <TabButton name="billing">Billing</TabButton>
    </TabList>

    <TabContent name="app" className="air-card">
      <CardHeader>
        <CardTitle>Application Workspaces</CardTitle>
        <CardSubtitle>Configure environments and access keys.</CardSubtitle>
      </CardHeader>
      <CardBody>
        <Tab value="production" orientation="vertical" outlined>
          <TabList>
            <TabButton name="production">
              Production <Badge color="primary">Live</Badge>
            </TabButton>
            <TabButton name="staging">Staging</TabButton>
            <TabButton name="development">Development</TabButton>
          </TabList>

          <TabContent name="production" className="air-card">
            <CardHeader>
              <CardTitle>Production Environment</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="air-body-sm mb-4">Actions taken here immediately affect live users.</p>
              <Button variant="filled" color="error">
                Rotate API Keys
              </Button>
            </CardBody>
          </TabContent>
          <TabContent name="staging" className="air-card">
            <CardHeader>
              <CardTitle>Staging Environment</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="air-body-sm text-on-surface-variant">Your pre-production testing ground.</p>
            </CardBody>
          </TabContent>
          <TabContent name="development" className="air-card">
            <CardHeader>
              <CardTitle>Development Environment</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="air-body-sm text-on-surface-variant">Local sandbox and integration testing.</p>
            </CardBody>
          </TabContent>
        </Tab>
      </CardBody>
    </TabContent>

    <TabContent name="billing" className="air-card">
      <CardHeader>
        <CardTitle>Billing & Subscriptions</CardTitle>
        <CardSubtitle>Manage your payments and review history.</CardSubtitle>
      </CardHeader>
      <CardBody>
        <Tab value="invoices" outlined>
          <TabList>
            <TabButton name="invoices">Past Invoices</TabButton>
            <TabButton name="methods">Payment Methods</TabButton>
          </TabList>

          <TabContent name="invoices">
            <List>
              <ListItem>
                <Icon name="receipt_long" />
                <ListItemContent>
                  <ListTitle>INV-2023-089</ListTitle>
                  <ListSubtitle>Oct 12, 2023</ListSubtitle>
                </ListItemContent>
                <span className="font-bold mr-4">$49.00</span>
                <Button variant="text" size="sm">
                  Download
                </Button>
              </ListItem>
            </List>
          </TabContent>

          <TabContent name="methods">
            <List>
              <ListItem>
                <Icon name="credit_card" />
                <ListItemContent>
                  <ListTitle>Visa ending in 4242</ListTitle>
                  <ListSubtitle>Expires 12/2025</ListSubtitle>
                </ListItemContent>
                <Button variant="text" size="sm">
                  Remove
                </Button>
              </ListItem>
            </List>
          </TabContent>
        </Tab>
      </CardBody>
    </TabContent>
  </Tab>
);
