import type { FormField, FormState } from '@airlib/form';
import { formField } from '@airlib/form';
import { render, setup } from '@anchorlib/react';
import type { HTMLAttributes, ReactNode } from 'react';
import type { ZodObject, ZodRawShape } from 'zod';
import { FIELD_OPTIONS, FIELD_OPTIONS_KEYS, type FieldDefaultOptions } from './config.js';

export interface FieldProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
    Omit<FieldDefaultOptions, 'class'> {
  name: string;
  match?: string | ((form: FormState<ZodObject<ZodRawShape>>) => boolean);
  label?: string;
  children?: ReactNode | ((field: FormField<unknown>) => ReactNode);
}

export const Field = setup<FieldProps>((props) => {
  const rest = props.$omit(['name', 'match', 'label', 'className', 'children', ...(FIELD_OPTIONS_KEYS as never[])]);
  const field = formField(() => props.name, props.match);
  const fieldId = props.name.replace(/\./g, '-');
  const errorId = `${fieldId}-error`;

  return render(() => {
    if (!field.name) {
      return (
        <span className={props.errorClass ?? FIELD_OPTIONS.errorClass}>[FieldError]: Name property is required!</span>
      );
    }
    if (typeof props.children === 'function') {
      return props.children(field);
    }

    return (
      <div {...rest} className={props.className ?? FIELD_OPTIONS.class}>
        {props.label && (
          <label htmlFor={fieldId} className={props.labelClass ?? FIELD_OPTIONS.labelClass}>
            {props.label}
            {field.required && (
              <span className={props.requiredClass ?? FIELD_OPTIONS.requiredClass}>
                {props.requiredLabel ?? FIELD_OPTIONS.requiredLabel}
              </span>
            )}
          </label>
        )}
        {props.children}
        {field.touched &&
          field.error?.map((error, i) => (
            <span key={i} id={errorId} className={props.errorClass ?? FIELD_OPTIONS.errorClass} role="alert">
              {error}
            </span>
          ))}
        {field.valid && !field.matched && props.mismatchLabel && (
          <span id={errorId} className={props.errorClass ?? FIELD_OPTIONS.errorClass} role="alert">
            {props.mismatchLabel}
          </span>
        )}
      </div>
    );
  }, 'FieldView');
}, 'Field');
