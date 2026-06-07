import type { JSX as Jsx } from 'solid-js/jsx-runtime';
import { createInput } from './createInput.js';

export interface ColorPickerProps extends Jsx.InputHTMLAttributes<HTMLInputElement> {
  errorClass?: string;
}
export const ColorPicker = createInput<ColorPickerProps>('color');
