import { setup } from '@anchorlib/solid';
import { formInput, type AnyType } from '@airlib/form';
import type { JSX } from 'solid-js';

export interface FilePickerProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  onFiles?: (files: FileList | null) => void;
}

export const FilePicker = setup<FilePickerProps>((props) => {
  (props as AnyType).type = 'file';
  const input = formInput(props as AnyType);
  const rest = props.$omit(['type', 'name', 'disabled', 'onChange', 'onFiles']);

  const handleChange = (e: Event) => {
    const files = (e.currentTarget as HTMLInputElement).files;
    if (typeof props.onFiles === 'function') {
      props.onFiles(files);
    }
    if (typeof props.onChange === 'function') {
      props.onChange(e as any);
    }
  };

  return <input {...rest} type="file" name={input.name} disabled={input.disabled} onChange={handleChange} />;
});
