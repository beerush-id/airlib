import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  Collapsible,
  CollapsibleContent,
  CollapsibleGroup,
  CollapsibleTrigger,
  Icon,
  Text,
} from '@airlib/react-ui/components';

export default () => (
  <CardGroup className="mx-auto max-w-sm">
    <Card>
      <CardHeader className="items-center">
        <Avatar size="xl" alt="John Smith" />
        <div className="text-center mt-2">
          <Text.Title>Jane Smith</Text.Title>
          <Text.Subtitle>Senior Product Designer</Text.Subtitle>
        </div>
      </CardHeader>
      <CardBody className="flex-row justify-center gap-2">
        <Button size="sm">
          <Icon name="add" />
          <span>Follow</span>
        </Button>
        <Button variant="tonal" size="sm">
          <Icon name="chat_bubble" />
          <span>Message</span>
        </Button>
      </CardBody>
    </Card>

    <CollapsibleGroup className="air-card">
      <Collapsible name="details">
        <CollapsibleContent>
          <CardBody className="gap-2">
            <Text>
              <Text.Label size="lg">Location:</Text.Label> San Francisco, CA
            </Text>
            <Text>
              <Text.Label size="lg">Joined:</Text.Label> March 2021
            </Text>
            <Text>
              <Text.Label size="lg">Bio:</Text.Label> Passionate about creating intuitive and accessible digital
              experiences. Coffee enthusiast.
            </Text>
          </CardBody>
        </CollapsibleContent>
        <CollapsibleTrigger className="air-link-nav justify-center p-4">
          <Icon name="person" />
          <span>Toggle Full Profile</span>
        </CollapsibleTrigger>
      </Collapsible>
    </CollapsibleGroup>
  </CardGroup>
);
