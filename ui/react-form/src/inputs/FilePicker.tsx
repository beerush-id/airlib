import { setup, render } from '@anchorlib/react';
import { formInput, type AnyType } from '@airlib/form';
import type { InputHTMLAttributes, ChangeEvent } from 'react';

export interface FilePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
  onFiles?: (files: FileList | null) => void;
}

export const FilePicker = setup<FilePickerProps>((props) => {
  const input = formInput(props as AnyType);
  const rest = props.$omit(['type', 'name', 'disabled', 'onChange', 'onFiles']);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.onFiles?.(e.currentTarget.files);
    props.onChange?.(e);
  };

  return render(
    () => <input {...rest} type="file" name={input.name} disabled={input.disabled} onChange={handleChange} />,
    'FilePickerView'
  );
}, 'FilePicker');
