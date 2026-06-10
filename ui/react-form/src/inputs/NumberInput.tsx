import type { Bindable } from '@anchorlib/react';
import type { InputHTMLAttributes } from 'react';
import { createInput } from './createInput.js';

export interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
  errorClass?: string;
  value?: Bindable<number>;
}
export const NumberInput = createInput<NumberInputProps>('number');
