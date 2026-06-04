import { setup, render } from '@anchorlib/react';
import { getForm, type FormState } from '@airlib/form';
import type { ZodType } from 'zod';
import type { ButtonHTMLAttributes, ReactNode, MouseEvent } from 'react';

export interface FormResetProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children?: ReactNode | ((form?: FormState<ZodType>) => ReactNode);
}

export const FormReset = setup<FormResetProps>((props) => {
  const form = getForm();
  const rest = props.$omit(['disabled', 'type', 'children', 'onClick']);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    form?.reset();
    props.onClick?.(e);
  };

  return render(
    () => (
      <button {...rest} type="button" disabled={!form?.changed} onClick={handleClick}>
        {typeof props.children === 'function' ? props.children(form) : props.children}
      </button>
    ),
    'FormResetView'
  );
}, 'FormReset');
