import type { JSX } from 'solid-js';
import { createInput } from './createInput.js';

export interface TextInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {}
export const TextInput = createInput<TextInputProps>('text');
