import type { InputHTMLAttributes } from 'react';
import { createInput } from './createInput.js';

export interface TimePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
  value?: Date | string;
}
export const TimePicker = createInput<TimePickerProps>('time');
