import { template } from '@anchorlib/react';
import { DIALOG_CONFIGS } from './config.js';
import { ConfirmDialog } from './Confirm.js';
import { CONFIRM_DIALOG_LIST } from './supporting.js';

export const ConfirmDialogHost = template(() => {
  if (!CONFIRM_DIALOG_LIST.size) return null;
  return Array.from(CONFIRM_DIALOG_LIST).map((dialog, index) => {
    return <ConfirmDialog className={DIALOG_CONFIGS.confirm.class} key={index} dialog={dialog} />;
  });
}, 'ConfirmDialogHost');
