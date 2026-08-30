import { render, setup, type Bindable } from '@airlib/react';
import type { InputEventHandler, InputHTMLAttributes } from 'react';

type FieldError = { message: string } | undefined;

export interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
  value?: Bindable<string>;
  label?: string;
  error?: FieldError;
}

export const InputField = setup<InputFieldProps>((props) => {
  const restProps = props.$omit(['value', 'label', 'error', 'onInput', 'onChange']);

  const handleInput: InputEventHandler<HTMLInputElement> = (e) => {
    props.value = e.currentTarget.value;
    props.onInput?.(e);
  };

  return render(() => {
    const inputElement = (
      <input
        {...restProps}
        className={`air-text-field ${props.className ?? ''}`.trim()}
        value={props.value ?? ''}
        onInput={handleInput}
      />
    );

    if (!props.label && !props.error) {
      return inputElement;
    }

    return (
      <div className="air-text-field-base">
        {props.label ? (
          <label htmlFor={props.id} className="air-field-label">
            {props.label}
          </label>
        ) : null}
        {inputElement}
        {props.error ? <span className="air-text-field-supporting-error">{props.error.message}</span> : null}
      </div>
    );
  });
}, 'InputField');

export default InputField;
