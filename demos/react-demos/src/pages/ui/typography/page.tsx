import {
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  CardTitle,
  Display,
  Headline,
  Title,
  Text,
  TextLabel,
} from '@airlib/react-ui/components';
import { page, setup } from '@anchorlib/react';
import { typographyRoute } from '../route.js';

const TypographyDemo = setup(() => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Display size="sm">Typography</Display>
        <div className="text-on-surface-variant max-w-3xl mt-4">
          <Text size="lg">
            Material Design 3 typography system implemented as CSS utility classes. These classes apply the correct font
            sizes, line heights, and letter spacings according to the Material specification.
          </Text>
        </div>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Display</CardTitle>
            <Text size="sm">Used for large, prominent headings.</Text>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
                <div className="w-24 shrink-0">
                  <TextLabel size="md">Large</TextLabel>
                </div>
                <Display size="lg">Display Large</Display>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
                <div className="w-24 shrink-0">
                  <TextLabel size="md">Medium</TextLabel>
                </div>
                <Display size="md">Display Medium</Display>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
                <div className="w-24 shrink-0">
                  <TextLabel size="md">Small</TextLabel>
                </div>
                <Display size="sm">Display Small</Display>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Headline</CardTitle>
            <Text size="sm">Used for section headings.</Text>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
                <div className="w-24 shrink-0">
                  <TextLabel size="md">Large</TextLabel>
                </div>
                <Headline size="lg">Headline Large</Headline>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
                <div className="w-24 shrink-0">
                  <TextLabel size="md">Medium</TextLabel>
                </div>
                <Headline size="md">Headline Medium</Headline>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
                <div className="w-24 shrink-0">
                  <TextLabel size="md">Small</TextLabel>
                </div>
                <Headline size="sm">Headline Small</Headline>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <Text size="sm">Used for medium-emphasis text.</Text>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
                <div className="w-24 shrink-0">
                  <TextLabel size="md">Large</TextLabel>
                </div>
                <Title size="lg">Title Large</Title>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
                <div className="w-24 shrink-0">
                  <TextLabel size="md">Medium</TextLabel>
                </div>
                <Title size="md">Title Medium</Title>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
                <div className="w-24 shrink-0">
                  <TextLabel size="md">Small</TextLabel>
                </div>
                <Title size="sm">Title Small</Title>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Body</CardTitle>
            <Text size="sm">Used for long-form reading and small text.</Text>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
                <div className="w-24 shrink-0">
                  <TextLabel size="md">Large</TextLabel>
                </div>
                <Text size="lg">Body Large</Text>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
                <div className="w-24 shrink-0">
                  <TextLabel size="md">Medium</TextLabel>
                </div>
                <Text size="md">Body Medium</Text>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
                <div className="w-24 shrink-0">
                  <TextLabel size="md">Small</TextLabel>
                </div>
                <Text size="sm">Body Small</Text>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Label</CardTitle>
            <Text size="sm">Used for small, functional text.</Text>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
                <div className="w-24 shrink-0">
                  <TextLabel size="md">Large</TextLabel>
                </div>
                <TextLabel size="lg">Label Large</TextLabel>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
                <div className="w-24 shrink-0">
                  <TextLabel size="md">Medium</TextLabel>
                </div>
                <TextLabel size="md">Label Medium</TextLabel>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
                <div className="w-24 shrink-0">
                  <TextLabel size="md">Small</TextLabel>
                </div>
                <TextLabel size="sm">Label Small</TextLabel>
              </div>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'TypographyDemo');

export const TypographyPage = page(typographyRoute).render(() => <TypographyDemo />);

export default TypographyPage;
