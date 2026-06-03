import { render, setup } from '@anchorlib/react';
import { type AnyType, formState } from '@airlib/form';
import type { ZodType } from 'zod';
import type { FormHTMLAttributes, SubmitEvent } from 'react';

export interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  schema: ZodType;
  value?: Record<string, AnyType>;
  onSubmit?: (
    data: Record<string, AnyType>,
    changes: Partial<Record<string, AnyType>>,
    e: SubmitEvent<HTMLFormElement>
  ) => Promise<void> | void;
}

export const Form = setup<FormProps>((props) => {
  const form = formState(props.schema as AnyType, props as AnyType);
  const rest = props.$omit(['schema', 'value', 'onSubmit']);

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (props.onSubmit) {
      form.submit((data, changes) => props.onSubmit!(data, changes, e));
    }
  };

  return render(() => (
    <form {...rest} onSubmit={handleSubmit}>
      {props.children}
    </form>
  ));
});
