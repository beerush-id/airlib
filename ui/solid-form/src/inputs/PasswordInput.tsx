import type { JSX } from 'solid-js';
import { createInput } from './createInput.js';

export interface PasswordInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  errorClass?: string;
}
export const PasswordInput = createInput<PasswordInputProps>('password');
