import { setup, render } from '@anchorlib/react';
import { formField, type FormFieldState } from '@airlib/form';
import type { HTMLAttributes, ReactNode } from 'react';

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  name: string;
  label?: string;
  labelClass?: string;
  errorClass?: string;
  children?: ReactNode | ((field: FormFieldState<unknown>) => ReactNode);
}

export const Field = setup<FieldProps>((props) => {
  const rest = props.$omit(['name', 'label', 'labelClass', 'errorClass', 'children']);
  const field = formField(props.name);

  return render(() => {
    if (typeof props.children === 'function') {
      return props.children(field);
    }

    return (
      <div {...rest}>
        {props.label && <label className={props.labelClass}>{props.label}</label>}
        {props.children}
        {field.error?.map((err) => (
          <span className={props.errorClass} key={err}>
            {err}
          </span>
        ))}
      </div>
    );
  });
});
