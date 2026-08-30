import { render, setup, type Bindable } from '@airlib/react';
import type { ReactNode, SelectHTMLAttributes } from 'react';

export interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value'> {
  value?: Bindable<string>;
  label?: string;
  children?: ReactNode;
}

export const SelectField = setup<SelectFieldProps>((props) => {
  const restProps = props.$omit(['value', 'label', 'children']);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    props.value = e.currentTarget.value;
    props.onChange?.(e);
  };

  return render(() => {
    const selectElement = (
      <select
        {...restProps}
        className={`air-select-trigger ${props.className ?? ''}`.trim()}
        value={props.value ?? ''}
        onChange={handleChange}
      >
        {props.children}
      </select>
    );

    if (!props.label) {
      return selectElement;
    }

    return (
      <div className="air-text-field-base">
        <label htmlFor={props.id} className="air-field-label">
          {props.label}
        </label>
        {selectElement}
      </div>
    );
  });
}, 'SelectField');

export default SelectField;
