import { render, setup, type Bindable } from '@anchorlib/react';

export const CheckboxField = setup<{
  id: string;
  label: string;
  checked: Bindable<boolean>;
}>((props) => {
  return render(() => (
    <label htmlFor={props.id} className="flex items-center gap-3 cursor-pointer select-none">
      <div className="checkbox">
        <input
          id={props.id}
          type="checkbox"
          className="checkbox-input"
          checked={props.checked}
          onChange={() => {
            props.checked = !props.checked;
          }}
        />
        <div className="checkbox-box" aria-hidden="true" />
      </div>
      <span className="text-body-medium text-on-surface">{props.label}</span>
    </label>
  ));
}, 'CheckboxField');

export default CheckboxField;
