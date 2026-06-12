import { type StyleInput, type StyleProvider, stylex } from '@airlib/uikit/utils';
import { $use } from '@anchorlib/react';

export function $css(input: StyleInput | StyleProvider) {
  return $use(() => stylex(input));
}
