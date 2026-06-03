import type { InputHTMLAttributes } from 'react';
import { createInput } from './createInput.js';

export interface EmailInputProps extends InputHTMLAttributes<HTMLInputElement> {}
export const EmailInput = createInput<EmailInputProps>('email');
