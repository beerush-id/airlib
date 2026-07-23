import {
  Card,
  CardHeader,
  CardTitle,
  Collapsible,
  CollapsibleContent,
  CollapsibleGroup,
  CollapsibleTrigger,
  Field,
  Icon,
} from '@airlib/react-ui/components';
import { Checkbox, Radio, RadioGroup } from '@airlib/react-ui/form';
import { $bind, mutable, setup } from '@anchorlib/react';

const Individual = setup(() => {
  const state = mutable({
    brand: true,
    price: true,
    selectedPrice: 'under_50',
  });

  return (
    <Card variant={'outlined'} className="w-full max-w-70">
      <CardHeader className="p-4">
        <CardTitle className="gap-2">
          <Icon name="filter_list" />
          <span>Filters</span>
        </CardTitle>
      </CardHeader>
      <div className="air-divider" />

      <CollapsibleGroup>
        <Collapsible name="brand" expanded={$bind(state, 'brand')}>
          {(ctx) => (
            <>
              <CollapsibleTrigger className="air-link-nav p-4 justify-between">
                <span>Brand</span>
                <Icon size={16} name={() => (ctx.expanded ? 'remove' : 'add')} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col gap-3 px-4 pb-4">
                  <Field>
                    <Checkbox />
                    <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                      Google
                    </span>
                  </Field>
                  <Field>
                    <Checkbox />
                    <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                      Apple
                    </span>
                  </Field>
                </div>
              </CollapsibleContent>
            </>
          )}
        </Collapsible>

        <div className="air-divider" />

        <Collapsible name="price" expanded={$bind(state, 'price')}>
          {(ctx) => (
            <>
              <CollapsibleTrigger className="air-link-nav p-4 justify-between">
                <span>Price Range</span>
                <Icon size={16} name={() => (ctx.expanded ? 'remove' : 'add')} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <RadioGroup value={$bind(state, 'selectedPrice')} className="flex flex-col gap-3 px-4 pb-4">
                  <Field>
                    <Radio value="under_50" />
                    <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                      Under $50
                    </span>
                  </Field>
                  <Field>
                    <Radio value="50_200" />
                    <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                      $50 - $200
                    </span>
                  </Field>
                  <Field>
                    <Radio value="over_200" />
                    <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                      Over $200
                    </span>
                  </Field>
                </RadioGroup>
              </CollapsibleContent>
            </>
          )}
        </Collapsible>
      </CollapsibleGroup>
    </Card>
  );
}, 'Individual');

export default Individual;
