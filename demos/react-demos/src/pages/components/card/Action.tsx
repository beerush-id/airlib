import { Button, Card, CardBody, CardHeader, CardSubtitle, CardTitle } from '@airlib/react-ui/components';

export default () => (
  <div className="flex justify-center">
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle>Glass Souls</CardTitle>
        <CardSubtitle>By M. T. Anderson</CardSubtitle>
      </CardHeader>
      <CardBody>
        <p className="air-body-md">
          A story about young people navigating a futuristic society where their experiences are constantly broadcasted.
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="text">Details</Button>
          <Button variant="filled">Read</Button>
        </div>
      </CardBody>
    </Card>
  </div>
);
