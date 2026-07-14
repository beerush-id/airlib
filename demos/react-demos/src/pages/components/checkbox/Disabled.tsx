import { Field } from '@airlib/react-ui/components';
import { Checkbox } from '@airlib/react-ui/form';

export default () => (
  <div className="flex flex-col gap-4">
    <Field>
      <Checkbox checked={false} disabled />
      <span>Disabled Unchecked</span>
    </Field>

    <Field>
      <Checkbox checked={true} disabled />
      <span>Disabled Checked</span>
    </Field>

    <Field>
      <Checkbox checked="mixed" disabled />
      <span>Disabled Indeterminate</span>
    </Field>
  </div>
);
