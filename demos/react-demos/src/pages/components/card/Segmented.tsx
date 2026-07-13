import { Card, CardBody, CardGroup, CardHeader, CardTitle } from '@airlib/react-ui/components';

export default () => (
  <div className="flex justify-center">
    <div className="max-w-sm w-full">
      <CardGroup>
        <Card>
          <CardHeader>
            <CardTitle>Header Card</CardTitle>
          </CardHeader>
          <CardBody>This is the first segment of the card group. It has a large top radius.</CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Middle Card</CardTitle>
          </CardHeader>
          <CardBody>This segment sits in the middle and uses the small inner radius on all corners.</CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Footer Card</CardTitle>
          </CardHeader>
          <CardBody>This is the final segment with a large bottom radius.</CardBody>
        </Card>
      </CardGroup>
    </div>
  </div>
);
