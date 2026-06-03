import type { InputHTMLAttributes } from 'react';
import { createInput } from './createInput.js';

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
  value?: Date | string;
}
export const DatePicker = createInput<DatePickerProps>('date');
