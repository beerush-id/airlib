import { createDialog } from '@airlib/uikit/components';
import { captureStack, isBrowser } from '@anchorlib/core';
import { UI_CONFIGS } from '../../config.js';
import { WarningIcon } from '../../icons/Warning.js';
import { DialogCancel } from './Cancel.js';
import { DialogContent } from './Content.js';
import { CONFIRM_DIALOG_LIST, CONFIRM_TYPE_COLORS, CONFIRM_TYPE_ICONS } from './constant.js';
import { dialogComponent } from './Dialog.js';
import { DialogFooter } from './Footer.js';
import { DialogHeader } from './Header.js';
import { DialogToolbar } from './Toolbar.js';
import { DialogSubmit } from './Submit.js';
import { DialogTitle } from './Title.js';

export type DialogConfirmData = {
  type?: 'info' | 'help' | 'warning' | 'error';
  title: string;
  message: string;
  warning?: boolean;
  warningMessage?: string;
  rejectLabel?: string;
  acceptLabel?: string;
};

export async function dialogConfirm(data: DialogConfirmData) {
  if (!isBrowser()) {
    const error = new Error('Unsafe confirmation dialog detected!');
    captureStack.violation.general(
      'Unsafe confirmation dialog detected!',
      'Attempted to call confirmation dialog in a server environment.',
      error,
      [
        'Dialog confirmation is intended for user interaction.',
        '- Ensure it is called within an interaction event, such as a click handler.',
        '- Never request confirmation during server-side rendering.',
      ],
      dialogConfirm
    );
    return Promise.resolve();
  }

  const dialog = createDialog<DialogConfirmData, boolean>({});
  CONFIRM_DIALOG_LIST.add(dialog);

  try {
    return await dialog.show(data);
  } finally {
    setTimeout(() => {
      CONFIRM_DIALOG_LIST.delete(dialog);
    }, UI_CONFIGS.dialog.disposalDelay);
  }
}

export const ConfirmDialog = dialogComponent<DialogConfirmData, boolean>((dialog) => {
  const Icon = CONFIRM_TYPE_ICONS[dialog.data.type ?? 'info'];

  return (
    <>
      {dialog.data.type && (
        <DialogToolbar>
          <Icon
            className={
              UI_CONFIGS.dialog[`${dialog.data.type}Color` as never] ?? CONFIRM_TYPE_COLORS[dialog.data.type] ?? ''
            }
          />
        </DialogToolbar>
      )}
      <DialogHeader data-header>
        <DialogTitle>{dialog.data.title ?? 'Are you sure?'}</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <p className={UI_CONFIGS.dialog.messageClass}>
          {dialog.data.message ?? 'Are you sure you want to perform this action?'}
        </p>
        {dialog.data.warningMessage && (
          <div className={UI_CONFIGS.dialog.warningClass}>
            <WarningIcon />
            <p className={UI_CONFIGS.dialog.warningMessageClass}>{dialog.data.warningMessage}</p>
          </div>
        )}
      </DialogContent>
      <DialogFooter>
        <DialogCancel value={false}>{dialog.data.rejectLabel ?? 'Cancel'}</DialogCancel>
        <DialogSubmit value={true}>{dialog.data.acceptLabel ?? 'Confirm'}</DialogSubmit>
      </DialogFooter>
    </>
  );
}, 'Confirm');
