import { setup } from '@anchorlib/solid';
import { formField, type FormFieldState, type FormState } from '@airlib/form';
import { createMemo, type JSX } from 'solid-js';
import type { ZodType } from 'zod';

export interface FieldProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
  name: string;
  match?: string | ((form: FormState<ZodType>) => boolean);
  label?: string;
  labelClass?: string;
  errorClass?: string;
  children?: JSX.Element | ((field: FormFieldState<unknown>) => JSX.Element);
}

export const Field = setup<FieldProps>((props) => {
  const rest = props.$omit(['name', 'match', 'label', 'labelClass', 'errorClass', 'children']);
  const field = formField(props.name, props.match);
  const fieldId = () => props.name.replace(/\./g, '-');
  const errorId = () => `${fieldId()}-error`;

  return createMemo(() => {
    if (typeof props.children === 'function') {
      return props.children(field);
    }

    return (
      <div {...rest}>
        {props.label && (
          <label for={fieldId()} class={props.labelClass}>
            {props.label}
          </label>
        )}
        {props.children}
        {field.error && (
          <span id={errorId()} class={props.errorClass} role="alert">
            {field.error.join(', ')}
          </span>
        )}
      </div>
    );
  }) as unknown as JSX.Element;
});
