import { ErrorIcon, HelpIcon, InfoIcon, WarningIcon } from '../../icons/index.js';

export const DIALOG_CONFIGS = {
  class: 'air-dialog',
  portal: 'body',
  disposalDelay: 500,

  overlay: { class: 'air-dialog-overlay' },
  body: { class: 'air-dialog-body' },

  header: { class: 'air-dialog-header' },
  toolbar: { class: 'air-dialog-toolbar' },
  title: { class: 'air-dialog-title' },

  content: { class: 'air-dialog-content' },
  message: { class: 'air-dialog-message' },
  warning: { class: 'air-dialog-warning' },
  warningMessage: { class: 'air-dialog-warning-message' },

  footer: { class: 'air-dialog-footer' },
  submit: { class: 'air-dialog-submit' },
  cancel: { class: 'air-dialog-cancel' },

  close: {
    class: 'air-dialog-close',
    icon: { class: 'air-dialog-close-icon' },
  },

  confirm: {
    class: 'air-dialog-confirm',
    colors: {
      info: '',
      help: '',
      warning: 'text-error',
      error: 'text-error',
    },
    icons: {
      info: InfoIcon,
      help: HelpIcon,
      warning: WarningIcon,
      error: ErrorIcon,
    },
  },
};
