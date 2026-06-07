import type { JSX } from 'solid-js';
import { createInput } from './createInput.js';

export interface EmailInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  errorClass?: string;
}
export const EmailInput = createInput<EmailInputProps>('email');
