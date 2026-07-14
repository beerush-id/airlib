import { Field } from '@airlib/react-ui/components';
import { Checkbox } from '@airlib/react-ui/form';

export default () => (
  <div className="flex flex-col gap-4">
    <Field>
      <Checkbox checked={false} />
      <span>Unchecked</span>
    </Field>

    <Field>
      <Checkbox checked={true} />
      <span>Checked</span>
    </Field>

    <Field>
      <Checkbox indeterminate />
      <span>Indeterminate</span>
    </Field>
  </div>
);
