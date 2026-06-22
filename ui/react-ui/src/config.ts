import type { AnyType } from '@airlib/uikit';

export const UI_CONFIGS = {
  dialog: {
    class: 'air-dialog',
    portal: 'body',
    bodyClass: 'air-dialog-body',

    toolbarClass: 'air-dialog-toolbar',
    titleClass: 'air-dialog-title',
    headerClass: 'air-dialog-header',
    footerClass: 'air-dialog-footer',
    contentClass: 'air-dialog-content',

    overlayClass: 'air-dialog-overlay',

    closeClass: 'air-dialog-close',
    closeIconClass: 'air-dialog-close-icon',
    submitClass: 'air-dialog-submit',
    cancelClass: 'air-dialog-cancel',

    confirmClass: 'air-dialog-confirm',
    messageClass: 'air-dialog-message',
    warningClass: 'air-dialog-warning',
    warningMessageClass: 'air-dialog-warning-message',
    disposalDelay: 500,
  },

  iconSize: 24,
  iconFill: 'currentColor',
  iconClass: 'air-icon',
};

export function configureUI(config: Partial<typeof UI_CONFIGS> = {}) {
  for (const [key, value] of Object.entries(config)) {
    if (typeof value === 'object' && value !== null) {
      Object.assign((UI_CONFIGS as AnyType)[key], value);
    } else {
      (UI_CONFIGS as AnyType)[key] = value;
    }
  }
}
