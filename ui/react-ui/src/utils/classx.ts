import { type ClassInput, type ClassProvider, classx } from '@airlib/headless/utils';
import { $use } from '@airlib/react';

export function $cls(input: ClassInput | ClassProvider) {
  return $use(() => classx(input));
}
