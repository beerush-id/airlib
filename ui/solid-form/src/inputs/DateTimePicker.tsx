import type { Bindable } from '@anchorlib/solid';
import type { JSX } from 'solid-js';
import { createInput } from './createInput.js';

export interface DateTimePickerProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  errorClass?: string;
  value?: Bindable<Date>;
}
export const DateTimePicker = createInput<DateTimePickerProps>('datetime-local');
