import { derived } from '@anchorlib/core';
import { classx } from 'src/utils/classx.ts';
import type { SizeClassifier, Sizing } from './sizing.ts';

export const VARIANTS = {
  text: 'text',
  tonal: 'tonal',
  filled: 'filled',
  elevated: 'elevated',
  outlined: 'outlined',
} as const;

export type Variant = (typeof VARIANTS)[keyof typeof VARIANTS];

export type VariantClassifier = {
  [key in Variant]?: string;
} & {
  default?: string;
};

export const COLOR_VARIANTS = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  error: 'error',
  surface: 'surface',
} as const;

export type ColorVariant = (typeof COLOR_VARIANTS)[keyof typeof COLOR_VARIANTS];

export type ColorClassifier = {
  [key in ColorVariant]?: string;
} & {
  default?: string;
};

export type DecorationInput = {
  size?: Sizing;
  variant?: Variant;
};

export type DecorationConfig = {
  size?: SizeClassifier;
  variant?: VariantClassifier;
};

export function decorationClass(init: DecorationInput, config?: DecorationConfig) {
  const sizeConfig = { ...config?.size };
  const variantConfig = { ...config?.variant };

  return derived(() => {
    const { variant = 'default' } = init;
    const baseClass = variantConfig[variant];
    const sizeClass = sizeConfig[init.size!];

    return classx([baseClass, sizeClass]);
  });
}
