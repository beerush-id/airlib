import { type ClassInput, type ClassProvider, classx } from '@airlib/uikit/utils';
import { $use } from '@anchorlib/react';

export function $cls(input: ClassInput | ClassProvider) {
  return $use(() => classx(input));
}
