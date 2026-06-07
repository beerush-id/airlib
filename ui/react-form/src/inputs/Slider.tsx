import type { InputHTMLAttributes } from 'react';
import { createInput } from './createInput.js';

export interface SliderProps extends InputHTMLAttributes<HTMLInputElement> {
  errorClass?: string;
}
export const Slider = createInput<SliderProps>('range');
