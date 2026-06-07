import type { InputHTMLAttributes } from 'react';
import { createInput } from './createInput.js';

export interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorClass?: string;
}
export const PasswordInput = createInput<PasswordInputProps>('password');
