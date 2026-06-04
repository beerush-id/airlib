import { setup, render } from '@anchorlib/react';
import { formField, type FormFieldState, type FormState } from '@airlib/form';
import type { HTMLAttributes, ReactNode } from 'react';
import type { ZodType } from 'zod';

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  name: string;
  match?: string | ((form: FormState<ZodType>) => boolean);
  label?: string;
  labelClass?: string;
  errorClass?: string;
  children?: ReactNode | ((field: FormFieldState<unknown>) => ReactNode);
}

export const Field = setup<FieldProps>((props) => {
  const rest = props.$omit(['name', 'match', 'label', 'labelClass', 'errorClass', 'children']);
  const field = formField(props.name, props.match);
  const fieldId = props.name.replace(/\./g, '-');
  const errorId = `${fieldId}-error`;

  return render(() => {
    if (typeof props.children === 'function') {
      return props.children(field);
    }

    return (
      <div {...rest}>
        {props.label && (
          <label htmlFor={fieldId} className={props.labelClass}>
            {props.label}
          </label>
        )}
        {props.children}
        {field.error && (
          <span id={errorId} className={props.errorClass} role="alert">
            {field.error.join(', ')}
          </span>
        )}
      </div>
    );
  }, 'FieldView');
}, 'Field');
