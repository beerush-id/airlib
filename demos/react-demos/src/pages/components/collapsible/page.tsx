import {
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  CardTitle,
  Collapsible,
  CollapsibleContent,
  CollapsibleGroup,
  CollapsibleTrigger,
  Icon,
} from '@airlib/react-ui/components';
import { page, setup } from '@anchorlib/react';
import { collapsibleRoute } from '../route.js';

const CollapsibleDemo = setup(() => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Collapsible</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Collapsible is the unstyled disclosure primitive used to build custom dropdowns, navigation groupings, and
          expandable panels.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Basic Disclosure Group</CardTitle>
            <p className="air-body-sm">
              Use `CollapsibleGroup` with `Collapsible` items (`label` prop) for clean, zero-overhead disclosure
              sections.
            </p>
          </CardHeader>
          <CardBody>
            <div className="max-w-xl border border-outline-variant rounded-md overflow-hidden p-2">
              <CollapsibleGroup className="flex flex-col gap-1">
                <Collapsible name="overview" label="System Architecture" expanded={true}>
                  <div className="p-3 text-sm text-on-surface-variant bg-surface-container-lowest rounded">
                    Overview of core system microservices, database clusters, and network routing configurations.
                  </div>
                </Collapsible>
                <Collapsible name="dependencies" label="Installed Packages">
                  <div className="p-3 text-sm text-on-surface-variant bg-surface-container-lowest rounded">
                    List of active production modules, UI libraries, and runtime dependencies.
                  </div>
                </Collapsible>
              </CollapsibleGroup>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Custom Triggers & Content</CardTitle>
            <p className="air-body-sm">
              Combine `CollapsibleTrigger` and `CollapsibleContent` inside `Collapsible` for complete layout control.
            </p>
          </CardHeader>
          <CardBody>
            <div className="max-w-xl">
              <CollapsibleGroup>
                <Collapsible name="custom-panel" expanded={true}>
                  <CollapsibleTrigger className="w-full flex items-center justify-between p-3 rounded-lg bg-surface-container-high hover:bg-surface-container-highest transition-colors">
                    <span className="font-semibold text-sm">Toggle Custom Drawer Details</span>
                    <Icon name="unfold_more" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 p-4 border border-outline-variant/60 rounded-lg text-sm text-on-surface-variant">
                      Custom content area inside a pure disclosure primitive without card-level accordion padding or
                      surface backgrounds.
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CollapsibleGroup>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'CollapsibleDemo');

export const CollapsiblePage = page(collapsibleRoute).render(() => <CollapsibleDemo />);
export default CollapsiblePage;
