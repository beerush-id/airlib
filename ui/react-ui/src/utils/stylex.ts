import { stylex as _stylex } from '@airlib/uikit/utils';
import { $use, type Linked } from '@anchorlib/react';
import type { CSSProperties } from 'react';

export type CSSInput = CSSProperties & {
  [key: `--${string}`]: string | number | boolean | null | undefined;
};
export type CSSProvider = () => CSSInput;

export function $css(input: CSSInput | CSSProvider) {
  return $use(() => _stylex(input as never)) as Linked<CSSProperties>;
}

export const stylex = _stylex as never as (input: CSSInput | CSSProvider) => CSSProperties;
