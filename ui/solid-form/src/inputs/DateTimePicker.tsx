import type { JSX } from 'solid-js';
import { createInput } from './createInput.js';

export interface DateTimePickerProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  errorClass?: string;
}
export const DateTimePicker = createInput<DateTimePickerProps>('datetime-local');
