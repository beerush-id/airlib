import type { JSX } from 'solid-js';
import { createInput } from './createInput.js';

export interface DatePickerProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  errorClass?: string;
}
export const DatePicker = createInput<DatePickerProps>('date');
