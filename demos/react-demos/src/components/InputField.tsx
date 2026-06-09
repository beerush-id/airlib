import { render, setup, type Bindable } from '@anchorlib/react';

type FieldError = { message: string } | undefined;

export const InputField = setup<{
  id: string;
  type?: string;
  label: string;
  value?: Bindable<string>;
  error?: FieldError;
}>((props) => {
  return render(() => (
    <div className="flex flex-col gap-1 text-left w-full">
      <div className="text-field text-field-outlined">
        <label htmlFor={props.id} className="text-field-label">
          {props.label}
        </label>
        <input
          id={props.id}
          type={props.type ?? 'text'}
          className="text-field-input"
          value={props.value}
          onChange={(e) => {
            props.value = e.currentTarget.value;
          }}
          placeholder=" "
        />
      </div>
      {props.error ? <span className="text-body-small text-error">{props.error.message}</span> : null}
    </div>
  ));
}, 'InputField');

export default InputField;
