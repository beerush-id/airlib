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
  ListItemSupportingText,
  Status,
  type StatusVariant,
} from '@airlib/react-ui/components';
import { page, setup } from '@anchorlib/react';
import { statusRoute } from '../route.js';

const ALL_VARIANTS: { variant: StatusVariant; label: string }[] = [
  { variant: 'surface', label: 'Surface' },
  { variant: 'primary', label: 'Primary' },
  { variant: 'secondary', label: 'Secondary' },
  { variant: 'tertiary', label: 'Tertiary' },
  { variant: 'success', label: 'Success' },
  { variant: 'warning', label: 'Warning' },
  { variant: 'info', label: 'Info' },
  { variant: 'error', label: 'Error' },
];

const StatusDemo = setup(() => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Status</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Status pills indicate static categories, item states, or tags within inline layouts and lists across all
          semantic and theme variants.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Trailing Status Indicators</CardTitle>
            <p className="air-body-sm">
              Status pills positioned as trailing indicators inside list rows (`air-list-view`).
            </p>
          </CardHeader>
          <CardBody>
            <List segmented>
              <ListItem variant="filled" className="cursor-default">
                <Avatar variant="primary">
                  <Icon name="dns" />
                </Avatar>
                <ListItemContent className="min-w-0">
                  <span className="air-title-md text-on-surface truncate">US-East Main Cluster</span>
                  <ListItemSupportingText className="truncate">PostgreSQL v16.3 Node</ListItemSupportingText>
                </ListItemContent>
                <Status variant="success" size="sm" dot={true} className="ml-4 shrink-0">
                  Connected
                </Status>
              </ListItem>

              <ListItem variant="filled" className="cursor-default">
                <Avatar variant="tertiary">
                  <Icon name="memory" />
                </Avatar>
                <ListItemContent className="min-w-0">
                  <span className="air-title-md text-on-surface truncate">EU-Central Redis Cache</span>
                  <ListItemSupportingText className="truncate">In-Memory Store 32GB</ListItemSupportingText>
                </ListItemContent>
                <Status variant="warning" size="sm" dot={true} className="ml-4 shrink-0">
                  High Memory (88%)
                </Status>
              </ListItem>

              <ListItem variant="filled" className="cursor-default">
                <Avatar variant="error">
                  <Icon name="backup" />
                </Avatar>
                <ListItemContent className="min-w-0">
                  <span className="air-title-md text-on-surface truncate">AP-South Archival Node</span>
                  <ListItemSupportingText className="truncate">Daily Cold Storage Sync</ListItemSupportingText>
                </ListItemContent>
                <Status variant="error" size="sm" dot={true} className="ml-4 shrink-0">
                  Sync Offline
                </Status>
              </ListItem>

              <ListItem variant="filled" className="cursor-default">
                <Avatar variant="secondary">
                  <Icon name="verified_user" />
                </Avatar>
                <ListItemContent className="min-w-0">
                  <span className="air-title-md text-on-surface truncate">Enterprise Identity Gateway</span>
                  <ListItemSupportingText className="truncate">OIDC & SAML Authentication</ListItemSupportingText>
                </ListItemContent>
                <div className="inline-flex items-center gap-2 ml-4 shrink-0">
                  <Status variant="primary" size="sm">
                    Pro Plan
                  </Status>
                  <Status variant="info" size="sm" dot={true}>
                    Verified
                  </Status>
                </div>
              </ListItem>
            </List>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Small Sizing (`sm` - 16px)</CardTitle>
            <p className="air-body-sm">
              Compact status indicators suitable for dense data tables, badging, and tight list rows.
            </p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-wrap gap-2 items-center">
                {ALL_VARIANTS.map(({ variant, label }) => (
                  <Status key={variant} variant={variant} size="sm">
                    {label}
                  </Status>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                {ALL_VARIANTS.map(({ variant, label }) => (
                  <Status key={`${variant}-dot`} variant={variant} size="sm" dot={true}>
                    {label}
                  </Status>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Medium Sizing (`md` - 20px / Default)</CardTitle>
            <p className="air-body-sm">
              Standard status pill sizing for card headers, navigation bars, and general UI indicators.
            </p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-wrap gap-2 items-center">
                {ALL_VARIANTS.map(({ variant, label }) => (
                  <Status key={variant} variant={variant} size="md">
                    {label}
                  </Status>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                {ALL_VARIANTS.map(({ variant, label }) => (
                  <Status key={`${variant}-dot`} variant={variant} size="md" dot={true}>
                    {label}
                  </Status>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Large Sizing (`lg` - 24px)</CardTitle>
            <p className="air-body-sm">
              Prominent status pills for hero sections, account verification banners, and primary status callouts.
            </p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-wrap gap-2 items-center">
                {ALL_VARIANTS.map(({ variant, label }) => (
                  <Status key={variant} variant={variant} size="lg">
                    {label}
                  </Status>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                {ALL_VARIANTS.map(({ variant, label }) => (
                  <Status key={`${variant}-dot`} variant={variant} size="lg" dot={true}>
                    {label}
                  </Status>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'StatusDemo');

export const StatusPage = page(statusRoute).render(() => <StatusDemo />);
export default StatusPage;
