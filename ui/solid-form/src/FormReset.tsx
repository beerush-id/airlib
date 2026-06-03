import { setup } from '@anchorlib/solid';
import { getForm, type FormState } from '@airlib/form';
import type { ZodType } from 'zod';
import { createMemo, type JSX } from 'solid-js';

export interface FormResetProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children?: JSX.Element | ((form?: FormState<ZodType>) => JSX.Element);
}

export const FormReset = setup<FormResetProps>((props) => {
  const form = getForm();
  const rest = props.$omit(['disabled', 'type', 'children', 'onClick']);

  const handleClick = (e: MouseEvent) => {
    form?.reset();
    if (typeof props.onClick === 'function') {
      props.onClick(e as any);
    }
  };

  return createMemo(() => (
    <button {...rest} type="button" disabled={!form?.changed} onClick={handleClick}>
      {typeof props.children === 'function' ? props.children(form) : props.children}
    </button>
  )) as unknown as JSX.Element;
});
