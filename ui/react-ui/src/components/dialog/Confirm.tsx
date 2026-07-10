import { createDialog } from '@airlib/headless/components';
import { captureStack, isBrowser } from '@anchorlib/core';
import { DIALOG_CONFIGS } from './config.js';
import { WarningIcon } from '../../icons/Warning.js';
import { DialogCancel } from './Cancel.js';
import { DialogContent } from './Content.js';
import { CONFIRM_DIALOG_LIST } from './supporting.js';
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
    }, DIALOG_CONFIGS.disposalDelay);
  }
}

export const ConfirmDialog = dialogComponent<DialogConfirmData, boolean>((dialog) => {
  const Icon = DIALOG_CONFIGS.confirm.icons[dialog.data.type ?? 'info'];

  return (
    <>
      {dialog.data.type && (
        <DialogToolbar>
          <Icon className={DIALOG_CONFIGS.confirm.colors[dialog.data.type ?? 'info']} />
        </DialogToolbar>
      )}
      <DialogHeader data-header>
        <DialogTitle>{dialog.data.title ?? 'Are you sure?'}</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <p className={DIALOG_CONFIGS.message.class}>
          {dialog.data.message ?? 'Are you sure you want to perform this action?'}
        </p>
        {dialog.data.warningMessage && (
          <div className={DIALOG_CONFIGS.warning.class}>
            <WarningIcon />
            <p className={DIALOG_CONFIGS.warningMessage.class}>{dialog.data.warningMessage}</p>
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
