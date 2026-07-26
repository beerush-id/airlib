import type { SizeClassifier, VariantClassifier } from '@airlib/headless/components';

const BUTTON_VARIANTS: VariantClassifier = {
  default: 'air-button-filled',
  text: 'air-button-text',
  tonal: 'air-button-tonal',
  filled: 'air-button-filled',
  elevated: 'air-button-elevated',
  outlined: 'air-button-outlined',
};

const BUTTON_COLORS: Record<string, string> = {
  primary: '',
  secondary: 'air-button-secondary',
  tertiary: 'air-button-tertiary',
  info: 'air-button-info',
  error: 'air-button-error',
  warning: 'air-button-warning',
  success: 'air-button-success',
};

const BUTTON_SIZES: SizeClassifier = {
  xs: 'air-button-xs',
  sm: 'air-button-sm',
  md: 'air-button-md',
  lg: 'air-button-lg',
  xl: 'air-button-xl',
  xxl: 'air-button-xxl',
};

const ICON_BUTTON_VARIANTS: VariantClassifier = {
  default: '',
  tonal: 'air-icon-button-tonal',
  filled: 'air-icon-button-filled',
  outlined: 'air-icon-button-outlined',
};

const ICON_BUTTON_COLORS: Record<string, string> = {
  primary: '',
  secondary: 'air-icon-button-secondary',
  tertiary: 'air-icon-button-tertiary',
  info: 'air-icon-button-info',
  error: 'air-icon-button-error',
  warning: 'air-icon-button-warning',
  success: 'air-icon-button-success',
};

const ICON_BUTTON_SIZES: SizeClassifier = {
  xs: 'air-icon-button-xs',
  sm: 'air-icon-button-sm',
  md: 'air-icon-button-md',
  lg: 'air-icon-button-lg',
  xl: 'air-icon-button-xl',
  xxl: 'air-icon-button-xxl',
};

export const BUTTON_CONFIGS = {
  base: 'air-button',
  size: BUTTON_SIZES,
  variant: BUTTON_VARIANTS,
  color: BUTTON_COLORS,
  icon: {
    base: 'air-icon-button',
    variant: ICON_BUTTON_VARIANTS,
    size: ICON_BUTTON_SIZES,
    color: ICON_BUTTON_COLORS,
  },
  groupClass: 'air-button-group',
};

export const FAB_VARIANTS = {
  primary: 'air-fab',
  surface: 'air-fab-surface',
  secondary: 'air-fab-secondary',
  tertiary: 'air-fab-tertiary',
  extended: 'air-fab-extended',
};

export const FAB_SIZES = {
  sm: 'air-fab-sm',
  md: 'air-fab-md',
  lg: 'air-fab-lg',
};
