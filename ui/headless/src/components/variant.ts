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

  info: 'info',
  error: 'error',
  success: 'success',
  warning: 'warning',
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
  color?: ColorVariant;
};

export type DecorationConfig = {
  base?: string;
  size?: SizeClassifier;
  variant?: VariantClassifier;
  color?: ColorClassifier;
};

export function decorationClass(init: DecorationInput, config?: DecorationConfig) {
  const sizeConfig = { ...config?.size };
  const variantConfig = { ...config?.variant };
  const colorConfig = { ...config?.color };

  return derived(() => {
    const { variant = 'default', color } = init;
    const baseClass = config?.base;
    const variantClass = variantConfig[variant];
    const colorClass = color ? colorConfig[color] : undefined;
    const sizeClass = sizeConfig[init.size!];

    return classx([baseClass, variantClass, colorClass, sizeClass]);
  });
}
