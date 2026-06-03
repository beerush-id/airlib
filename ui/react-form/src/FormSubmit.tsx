import { setup, render } from '@anchorlib/react';
import { getForm, type FormState } from '@airlib/form';
import type { ZodType } from 'zod';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface FormSubmitProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children?: ReactNode | ((form?: FormState<ZodType>) => ReactNode);
}

export const FormSubmit = setup<FormSubmitProps>((props) => {
  const form = getForm();
  const rest = props.$omit(['disabled', 'type', 'children']);

  return render(() => (
    <button {...rest} type="submit" disabled={!form?.canSubmit}>
      {typeof props.children === 'function' ? props.children(form) : props.children}
    </button>
  ));
});
