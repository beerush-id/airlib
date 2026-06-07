import type { InputHTMLAttributes } from 'react';
import { createInput } from './createInput.js';

export interface ColorPickerProps extends InputHTMLAttributes<HTMLInputElement> {
  errorClass?: string;
}
export const ColorPicker = createInput<ColorPickerProps>('color');
