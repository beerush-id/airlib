import type { JSX } from 'solid-js';
import { createInput } from './createInput.js';

export interface DatePickerProps extends JSX.InputHTMLAttributes<HTMLInputElement> {}
export const DatePicker = createInput<DatePickerProps>('date');
