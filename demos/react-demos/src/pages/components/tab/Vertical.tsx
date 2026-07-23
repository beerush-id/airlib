import {
  Avatar,
  Button,
  Card,
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
  <Tab value="overview" orientation="vertical">
    <TabList>
      <TabButton name="overview">
        <Icon name="dashboard" /> Overview
      </TabButton>
      <TabButton name="users">
        <Icon name="group" /> Users
      </TabButton>
    </TabList>

    <TabContent name="overview" className="air-card">
      <CardHeader>
        <CardTitle>System Overview</CardTitle>
        <CardSubtitle>A quick glance at your application's performance.</CardSubtitle>
      </CardHeader>
      <CardBody className="grid grid-cols-2 gap-4">
        <Card variant="outlined">
          <CardBody className="flex flex-col items-center justify-center py-6">
            <Icon name="monitoring" className="text-3xl text-primary mb-2" />
            <span className="air-headline-md font-bold">24.5k</span>
            <span className="air-label-md text-on-surface-variant mt-1">Active Sessions</span>
          </CardBody>
        </Card>
        <Card variant="outlined">
          <CardBody className="flex flex-col items-center justify-center py-6">
            <Icon name="payments" className="text-3xl text-secondary mb-2" />
            <span className="air-headline-md font-bold">$12,400</span>
            <span className="air-label-md text-on-surface-variant mt-1">MRR</span>
          </CardBody>
        </Card>
      </CardBody>
    </TabContent>

    <TabContent name="users" className="air-card">
      <CardHeader className="flex-row justify-between">
        <div>
          <CardTitle>User Management</CardTitle>
          <CardSubtitle>Manage your platform's users.</CardSubtitle>
        </div>
        <Button variant="filled" size="sm">
          <Icon name="add" /> Invite
        </Button>
      </CardHeader>
      <CardBody>
        <List segmented>
          {[1, 2, 3].map((i) => (
            <ListItem key={i}>
              <Avatar size="md" />
              <ListItemContent>
                <ListTitle>User {i}</ListTitle>
                <ListSubtitle>user{i}@example.com</ListSubtitle>
              </ListItemContent>
              <Button variant="text" size="sm">
                Edit
              </Button>
            </ListItem>
          ))}
        </List>
      </CardBody>
    </TabContent>
  </Tab>
);
