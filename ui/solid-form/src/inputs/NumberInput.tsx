import type { JSX } from 'solid-js';
import { createInput } from './createInput.js';

export interface NumberInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  errorClass?: string;
}
export const NumberInput = createInput<NumberInputProps>('number');
