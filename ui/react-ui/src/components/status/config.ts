export const STATUS_VARIANTS: Record<string, string> = {
  default: 'air-status-surface',
  error: 'air-status-error',
  primary: 'air-status-primary',
  secondary: 'air-status-secondary',
  surface: 'air-status-surface',
  tertiary: 'air-status-tertiary',
  success: 'air-status-success',
  warning: 'air-status-warning',
  info: 'air-status-info',
};

export const STATUS_SIZES: Record<string, string> = {
  default: 'air-status-md',
  sm: 'air-status-sm',
  md: 'air-status-md',
  lg: 'air-status-lg',
};

export const STATUS_CONFIGS = {
  statusClass: 'air-status',
  dotClass: 'air-status-dot',
  variant: STATUS_VARIANTS,
  size: STATUS_SIZES,
};
