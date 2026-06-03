import type { JSX } from 'solid-js';
import { createInput } from './createInput.js';

export interface EmailInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {}
export const EmailInput = createInput<EmailInputProps>('email');
