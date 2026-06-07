import type { JSX } from 'solid-js';
import { createInput } from './createInput.js';

export interface TextInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  errorClass?: string;
}
export const TextInput = createInput<TextInputProps>('text');
