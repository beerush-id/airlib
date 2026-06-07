import type { InputHTMLAttributes } from 'react';
import { createInput } from './createInput.js';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorClass?: string;
}
export const TextInput = createInput<TextInputProps>('text');
