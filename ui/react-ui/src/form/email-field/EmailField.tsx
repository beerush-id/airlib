import { createTextFiled, type TextFieldProps } from '../Input.js';

export interface EmailFieldProps extends TextFieldProps {}
export const EmailField = createTextFiled<string, EmailFieldProps>('email', 'EmailField');
