import type { Bindable } from '@anchorlib/react';
import type { InputHTMLAttributes } from 'react';
import { createInput } from './createInput.js';

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
  errorClass?: string;
  value?: Bindable<string>;
}
export const PasswordInput = createInput<PasswordInputProps>('password');
