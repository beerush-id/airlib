import { render, setup, type Bindable } from '@airlib/react';

export const CheckboxField = setup<{
  id: string;
  label: string;
  checked: Bindable<boolean>;
}>((props) => {
  return render(() => (
    <label htmlFor={props.id} className="flex items-center gap-3 cursor-pointer select-none">
      <div className="air-checkbox">
        <input
          id={props.id}
          type="checkbox"
          className="air-checkbox-input"
          checked={props.checked}
          onChange={() => {
            props.checked = !props.checked;
          }}
        />
        <div className="air-checkbox-box" aria-hidden="true" />
      </div>
      <span className="air-body-md text-on-surface">{props.label}</span>
    </label>
  ));
}, 'CheckboxField');

export default CheckboxField;
