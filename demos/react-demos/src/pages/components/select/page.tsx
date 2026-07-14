import { Card, CardBody, CardGroup, CardHeader, CardTitle, TextLabel } from '@airlib/react-ui/components';
import { createSelect, Select, SelectButton, SelectItem, SelectMenu } from '@airlib/react-ui/form';
import { $bind, mutable, page, setup } from '@anchorlib/react';
import { selectRoute } from '../route.js';

const SelectDemo = setup(() => {
  const FruitSelect = createSelect<string>();
  const FRUITS = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
  ];

  const state = mutable({
    fruit: '',
    fruits: [] as string[],
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Select</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Displays a collapsible list of options and allows a user to select one or more values. Fully accessible via
          WAI-ARIA combobox and listbox patterns.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Single Selection</CardTitle>
            <p className="air-body-sm">
              Displays a standard list of options where a user can select a single value. The selection instantly
              updates the bound state.
            </p>
          </CardHeader>
          <CardBody>
            <div className="flex gap-4 items-center">
              <Select placeholder="Select Fruit" value={$bind(state, 'fruit')}>
                <SelectButton />
                <SelectMenu>
                  {FRUITS.map((fruit) => (
                    <SelectItem key={fruit.value} value={fruit.value}>
                      {fruit.label}
                    </SelectItem>
                  ))}
                </SelectMenu>
              </Select>
              <div className="flex-1 flex flex-col items-end gap-1">
                <TextLabel>Selected:</TextLabel>
                <TextLabel strong>{() => state.fruit || 'None'}</TextLabel>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Multiple Selection</CardTitle>
            <p className="air-body-sm">
              Displays a list of options with checkboxes, allowing users to select multiple values at once. Values are
              stored as an array.
            </p>
          </CardHeader>
          <CardBody>
            <div className="flex gap-4 items-center">
              <FruitSelect placeholder="Select Fruits" multiple values={state.fruits}>
                <FruitSelect.Button />
                <FruitSelect.Menu>
                  {FRUITS.map((fruit) => (
                    <FruitSelect.Option key={fruit.value} value={fruit.value}>
                      {fruit.label}
                    </FruitSelect.Option>
                  ))}
                </FruitSelect.Menu>
              </FruitSelect>
              <div className="flex-1 flex flex-col items-end gap-1">
                <TextLabel>Selected:</TextLabel>
                <TextLabel strong>{() => (state.fruits.length ? state.fruits.join(', ') : 'None')}</TextLabel>
              </div>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'SelectDemo');

export const SelectPage = page(selectRoute).render(() => <SelectDemo />);
export default SelectPage;
