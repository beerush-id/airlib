import { setup } from '@anchorlib/solid';
import { type AnyType, formState } from '@airlib/form';
import type { ZodType } from 'zod';
import type { JSX } from 'solid-js';

export interface FormProps extends Omit<JSX.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  schema: ZodType;
  value?: Record<string, AnyType>;
  onSubmit?: (
    data: Record<string, AnyType>,
    changes: Partial<Record<string, AnyType>>,
    e: Event
  ) => Promise<void> | void;
}

export const Form = setup<FormProps>((props) => {
  const form = formState(props.schema as AnyType, props as AnyType);
  const rest = props.$omit(['schema', 'value', 'onSubmit']);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    if (props.onSubmit) {
      form.submit((data, changes) => props.onSubmit!(data, changes, e as any));
    }
  };

  return (
    <form {...rest} onSubmit={handleSubmit}>
      {props.children}
    </form>
  );
});
