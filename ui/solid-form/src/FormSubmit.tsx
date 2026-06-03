import { setup } from '@anchorlib/solid';
import { getForm, type FormState } from '@airlib/form';
import type { ZodType } from 'zod';
import { createMemo, type JSX } from 'solid-js';

export interface FormSubmitProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children?: JSX.Element | ((form?: FormState<ZodType>) => JSX.Element);
}

export const FormSubmit = setup<FormSubmitProps>((props) => {
  const form = getForm();
  const rest = props.$omit(['disabled', 'type', 'children']);

  return createMemo(() => (
    <button {...rest} type="submit" disabled={!form?.canSubmit}>
      {typeof props.children === 'function' ? props.children(form) : props.children}
    </button>
  )) as unknown as JSX.Element;
});
