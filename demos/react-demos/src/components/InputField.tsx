import { render, setup, type Bindable } from '@airlib/react';

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
      <div className="air-text-field">
        <label htmlFor={props.id} className="air-field-label">
          {props.label}
        </label>
        <input
          id={props.id}
          type={props.type ?? 'text'}
          className="air-text-field"
          value={props.value}
          onChange={(e) => {
            props.value = e.currentTarget.value;
          }}
          placeholder=" "
        />
      </div>
      {props.error ? <span className="air-body-sm text-error">{props.error.message}</span> : null}
    </div>
  ));
}, 'InputField');

export default InputField;
