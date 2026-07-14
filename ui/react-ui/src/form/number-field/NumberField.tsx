import { createTextFiled, type TextFieldProps } from '../Input.js';

export interface NumberFieldProps extends TextFieldProps<number> {
  min?: number;
  max?: number;
}

export const NumberField = createTextFiled<number, NumberFieldProps>('number', 'NumberField');
