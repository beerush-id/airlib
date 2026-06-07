import type { InputHTMLAttributes } from 'react';
import { createInput } from './createInput.js';

export interface DateTimePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
  value?: Date | string;
  errorClass?: string;
}
export const DateTimePicker = createInput<DateTimePickerProps>('datetime-local');
