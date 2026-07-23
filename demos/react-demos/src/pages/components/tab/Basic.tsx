import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  CardSubtitle,
  CardTitle,
  Field,
  FieldLabel,
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
import { EmailField, Switch, TextField } from '@airlib/react-ui/form';

export default () => (
  <Tab value="profile">
    <TabList>
      <TabButton name="profile">Profile</TabButton>
      <TabButton name="notifications">
        Notifications
        <Badge>3</Badge>
      </TabButton>
    </TabList>

    <TabContent name="profile">
      <CardGroup>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardSubtitle>Update your photo and personal details here.</CardSubtitle>
          </CardHeader>
          <CardBody className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Avatar size="xxl" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" />
              <Button variant="text">Change Avatar</Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>First Name</FieldLabel>
                <TextField value="Jane" placeholder="Jane" />
              </Field>
              <Field>
                <FieldLabel>Last Name</FieldLabel>
                <TextField value="Doe" placeholder="Doe" />
              </Field>
              <Field className="col-span-2">
                <FieldLabel>Email Address</FieldLabel>
                <EmailField value="jane.doe@example.com" placeholder="jane.doe@example.com" />
              </Field>
            </div>
          </CardBody>
        </Card>
        <Card variant="filled">
          <CardBody>
            <div className="flex justify-end mt-2">
              <Button variant="filled">Save Changes</Button>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </TabContent>

    <TabContent name="notifications" className="air-card">
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardSubtitle>Decide what communications you'd like to receive.</CardSubtitle>
      </CardHeader>
      <CardBody>
        <List segmented>
          <ListItem variant="filled">
            <ListItemContent>
              <ListTitle>Security Alerts</ListTitle>
              <ListSubtitle>Get notified about important security updates.</ListSubtitle>
            </ListItemContent>
            <Switch defaultChecked />
          </ListItem>

          <ListItem variant="filled">
            <ListItemContent>
              <ListTitle>Marketing Emails</ListTitle>
              <ListSubtitle>Receive emails about new products and features.</ListSubtitle>
            </ListItemContent>
            <Switch />
          </ListItem>
        </List>
      </CardBody>
    </TabContent>
  </Tab>
);
