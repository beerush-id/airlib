import { setup, render } from '@anchorlib/react';
import { formField, type AnyType } from '@airlib/form';
import type { ReactNode } from 'react';

export interface FieldListProps<T = AnyType> {
  name: string;
  children: (items: T[]) => ReactNode;
}

export const FieldList = setup<FieldListProps>((props) => {
  const field = formField<AnyType[]>(props.name);
  if (!Array.isArray(field.value)) field.value = [];

  return render(() => props.children(field.value));
});
