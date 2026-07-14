import { createTextFiled, type TextFieldProps } from '../Input.js';

export interface PasswordFieldProps extends TextFieldProps {}
export const PasswordField = createTextFiled<string, PasswordFieldProps>('password', 'PasswordField');
