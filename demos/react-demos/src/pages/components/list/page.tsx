import {
  Avatar,
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  CardTitle,
  Icon,
  List,
  ListItem,
  ListItemContent,
  ListSubtitle,
  ListTitle,
} from '@airlib/react-ui/components';
import { page, setup } from '@anchorlib/react';
import { listRoute } from '../route.js';

const ListDemo = setup(() => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Lists</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Lists are continuous, vertical indexes of text or images.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Filled List</CardTitle>
            <p className="air-body-sm">A list of items with filled background.</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4 max-w-lg">
              <List variant="filled">
                <ListItem>
                  <Avatar variant="tertiary">
                    <Icon name="person" />
                  </Avatar>
                  <ListItemContent>
                    <ListTitle>Alex Smith</ListTitle>
                    <ListSubtitle>Online</ListSubtitle>
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <Avatar variant="secondary">
                    <Icon name="person" />
                  </Avatar>
                  <ListItemContent>
                    <ListTitle>Jane Doe</ListTitle>
                    <ListSubtitle>Away</ListSubtitle>
                  </ListItemContent>
                </ListItem>
              </List>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Segmented List</CardTitle>
            <p className="air-body-sm">A list with visually separated segments.</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4 max-w-lg">
              <List segmented>
                <ListItem variant="filled">
                  <Avatar variant="primary" size="lg" shape="rounded">
                    <Icon name="description" />
                  </Avatar>
                  <ListItemContent>
                    <ListTitle>Document.pdf</ListTitle>
                    <ListSubtitle>Updated 2 mins ago</ListSubtitle>
                  </ListItemContent>
                  <button className="air-icon-button ml-4 shrink-0">
                    <Icon name="more_vert" />
                  </button>
                </ListItem>
                <ListItem variant="filled">
                  <Avatar variant="secondary" size="lg" shape="rounded">
                    <Icon name="image" />
                  </Avatar>
                  <ListItemContent>
                    <ListTitle>Image.png</ListTitle>
                    <ListSubtitle>Updated 1 hour ago</ListSubtitle>
                  </ListItemContent>
                  <button className="air-icon-button ml-4 shrink-0">
                    <Icon name="more_vert" />
                  </button>
                </ListItem>
              </List>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'ListDemo');

export const ListPage = page(listRoute).render(() => <ListDemo />);

export default ListPage;
