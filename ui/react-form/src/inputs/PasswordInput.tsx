import type { InputHTMLAttributes } from 'react';
import { createInput } from './createInput.js';

export interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {}
export const PasswordInput = createInput<PasswordInputProps>('password');
