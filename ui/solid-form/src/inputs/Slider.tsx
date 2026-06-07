import type { JSX } from 'solid-js';
import { createInput } from './createInput.js';

export interface SliderProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  errorClass?: string;
}
export const Slider = createInput<SliderProps>('range');
