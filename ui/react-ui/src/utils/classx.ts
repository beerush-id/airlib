import { type ClassInput, type ClassProvider, classx } from '@airlib/headless/utils';
import { $use } from '@anchorlib/react';

export function $cls(input: ClassInput | ClassProvider) {
  return $use(() => classx(input));
}
