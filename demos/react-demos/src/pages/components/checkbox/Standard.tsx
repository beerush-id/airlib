import { Checkbox, Field } from '@airlib/react-ui/components';

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
      <Checkbox checked="mixed" />
      <span>Indeterminate</span>
    </Field>
  </div>
);
