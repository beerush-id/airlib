import { setup } from '@anchorlib/solid';
import { formField, type AnyType } from '@airlib/form';
import type { JSX } from 'solid-js';

export interface FieldListProps<T = AnyType> {
  name: string;
  children: (items: T[]) => JSX.Element;
}

export const FieldList = setup<FieldListProps>((props) => {
  const field = formField<AnyType[]>(props.name);
  if (!Array.isArray(field.value)) field.value = [];

  return (() => props.children(field.value)) as any;
});
