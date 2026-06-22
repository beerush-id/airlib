import type { AnyType } from '@airlib/uikit';
import type { DialogState } from '@airlib/uikit/components';
import { impure } from '@airlib/uikit/utils';
import { ErrorIcon, HelpIcon, InfoIcon, WarningIcon } from '../../icons/index.js';

export const CONFIRM_TYPE_COLORS: {
  [key: string]: string;
} = {
  warning: 'text-error',
  error: 'text-error',
};
export const CONFIRM_TYPE_ICONS = {
  info: InfoIcon,
  help: HelpIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};
export const CONFIRM_DIALOG_LIST: Set<DialogState<AnyType, AnyType>> = impure(new Set());
