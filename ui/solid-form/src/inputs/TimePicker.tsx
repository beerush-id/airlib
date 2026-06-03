import type { JSX } from 'solid-js';
import { createInput } from './createInput.js';

export interface TimePickerProps extends JSX.InputHTMLAttributes<HTMLInputElement> {}
export const TimePicker = createInput<TimePickerProps>('time');
