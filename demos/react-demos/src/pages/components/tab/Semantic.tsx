import {
  CardBody,
  CardHeader,
  CardSubtitle,
  CardTitle,
  createTab,
  Icon,
  List,
  ListItem,
  ListItemContent,
  ListSubtitle,
  ListTitle,
  Status,
} from '@airlib/react-ui/components';

const tabNames = ['flight', 'hotel', 'car'] as const;
const Booking = createTab<(typeof tabNames)[number]>();

export default () => (
  <Booking value="flight">
    <Booking.List>
      <Booking.Button name="flight">Flight</Booking.Button>
      <Booking.Button name="hotel">Hotel</Booking.Button>
      <Booking.Button name="car">Car</Booking.Button>
    </Booking.List>

    <Booking.Content name="flight" className="air-card">
      <CardHeader>
        <CardTitle>Available Flights</CardTitle>
        <CardSubtitle>Select a flight for your upcoming trip.</CardSubtitle>
      </CardHeader>
      <CardBody>
        <List segmented>
          <ListItem>
            <Icon name="flight_takeoff" />
            <ListItemContent>
              <ListTitle>New York (JFK) to London (LHR)</ListTitle>
              <ListSubtitle>
                <Status>American Airlines</Status>
                <Status variant="secondary">
                  08:00 AM
                </Status>
                <Status variant="tertiary">
                  Non-stop
                </Status>
              </ListSubtitle>
            </ListItemContent>
            <Status variant="primary">$450</Status>
          </ListItem>
          <ListItem>
            <Icon name="flight_takeoff" />
            <ListItemContent>
              <ListTitle>San Francisco (SFO) to Tokyo (HND)</ListTitle>
              <ListSubtitle>
                <Status>Japan Airlines</Status>
                <Status variant="secondary">
                  11:30 AM
                </Status>
                <Status variant="tertiary">
                  Non-stop
                </Status>
              </ListSubtitle>
            </ListItemContent>
            <Status variant="primary">$850</Status>
          </ListItem>
        </List>
      </CardBody>
    </Booking.Content>

    <Booking.Content name="hotel" className="air-card">
      <CardHeader>
        <CardTitle>Recommended Hotels</CardTitle>
        <CardSubtitle>Top rated stays at your destination.</CardSubtitle>
      </CardHeader>
      <CardBody>
        <List segmented>
          <ListItem>
            <Icon name="hotel" />
            <ListItemContent>
              <ListTitle>The Grand Plaza</ListTitle>
              <ListSubtitle>
                <Status>Downtown</Status>
                <Status variant="secondary">
                  5 Stars
                </Status>
                <Status variant="tertiary">
                  Breakfast Included
                </Status>
              </ListSubtitle>
            </ListItemContent>
            <Status variant="secondary">$200 / night</Status>
          </ListItem>
          <ListItem>
            <Icon name="hotel" />
            <ListItemContent>
              <ListTitle>Seaside Resort & Spa</ListTitle>
              <ListSubtitle>
                <Status>Beachfront</Status>
                <Status variant="secondary">
                  4 Stars
                </Status>
                <Status variant="tertiary">
                  Pool Access
                </Status>
              </ListSubtitle>
            </ListItemContent>
            <Status variant="secondary">$150 / night</Status>
          </ListItem>
        </List>
      </CardBody>
    </Booking.Content>

    <Booking.Content name="car" className="air-card">
      <CardHeader>
        <CardTitle>Rental Vehicles</CardTitle>
        <CardSubtitle>Available cars for pick-up today.</CardSubtitle>
      </CardHeader>
      <CardBody>
        <List segmented>
          <ListItem>
            <Icon name="directions_car" />
            <ListItemContent>
              <ListTitle>Tesla Model 3</ListTitle>
              <ListSubtitle>
                <Status>Electric</Status>
                <Status variant="secondary">
                  4 Seats
                </Status>
                <Status variant="tertiary">
                  Autopilot
                </Status>
              </ListSubtitle>
            </ListItemContent>
            <Status variant="tertiary">$80 / day</Status>
          </ListItem>
          <ListItem>
            <Icon name="directions_car" />
            <ListItemContent>
              <ListTitle>Toyota RAV4</ListTitle>
              <ListSubtitle>
                <Status>SUV</Status>
                <Status variant="secondary">
                  5 Seats
                </Status>
                <Status variant="tertiary">
                  AWD
                </Status>
              </ListSubtitle>
            </ListItemContent>
            <Status variant="tertiary">$60 / day</Status>
          </ListItem>
        </List>
      </CardBody>
    </Booking.Content>
  </Booking>
);
