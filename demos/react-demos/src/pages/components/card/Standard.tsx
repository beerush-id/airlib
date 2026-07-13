import { Card, CardBody, CardHeader, CardTitle } from '@airlib/react-ui/components';

export default () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Elevated (Default)</CardTitle>
      </CardHeader>
      <CardBody>Uses surface-container-low with a shadow to express elevation.</CardBody>
    </Card>
    <Card variant="filled">
      <CardHeader>
        <CardTitle>Filled</CardTitle>
      </CardHeader>
      <CardBody>Uses surface-container-highest without a shadow.</CardBody>
    </Card>
    <Card variant="outlined">
      <CardHeader>
        <CardTitle>Outlined</CardTitle>
      </CardHeader>
      <CardBody>Uses the default surface color with an outline.</CardBody>
    </Card>
  </div>
);
