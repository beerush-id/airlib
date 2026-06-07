import type { InputHTMLAttributes } from 'react';
import { createInput } from './createInput.js';

export interface NumberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorClass?: string;
}
export const NumberInput = createInput<NumberInputProps>('number');
