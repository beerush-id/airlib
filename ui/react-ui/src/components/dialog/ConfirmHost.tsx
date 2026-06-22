import { template } from '@anchorlib/react';
import { UI_CONFIGS } from '../../config.js';
import { ConfirmDialog } from './Confirm.js';
import { CONFIRM_DIALOG_LIST } from './constant.js';

export const ConfirmDialogHost = template(() => {
  if (!CONFIRM_DIALOG_LIST.size) return null;
  return Array.from(CONFIRM_DIALOG_LIST).map((dialog, index) => {
    return <ConfirmDialog className={UI_CONFIGS.dialog.confirmClass} key={index} dialog={dialog} />;
  });
}, 'ConfirmDialogHost');
