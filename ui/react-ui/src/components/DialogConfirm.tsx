import type { AnyType } from '@airlib/uikit';
import { createDialog, type DialogState } from '@airlib/uikit/components';
import { captureStack, isBrowser } from '@anchorlib/core';
import { mutable, template } from '@anchorlib/react';
import { UI_CONFIGS } from '../config.js';
import { ErrorIcon } from '../icons/Error.js';
import { HelpIcon } from '../icons/Help.js';
import { InfoIcon } from '../icons/Info.js';
import { WarningIcon } from '../icons/Warning.js';
import {
  DialogCancel,
  dialogComponent,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogHero,
  DialogSubmit,
  DialogTitle,
} from './Dialog.js';

export type DialogConfirmData = {
  type?: 'info' | 'help' | 'warning' | 'error';
  title: string;
  message: string;
  warning?: boolean;
  warningMessage?: string;
  rejectLabel?: string;
  acceptLabel?: string;
};

const CONFIRM_TYPE_COLORS: {
  [key: string]: string;
} = {
  warning: 'text-error',
  error: 'text-error',
};
const CONFIRM_TYPE_ICONS = {
  info: InfoIcon,
  help: HelpIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

const DIALOG_CONFIRM_LIST: Set<DialogState<AnyType, AnyType>> = isBrowser() ? mutable(new Set()) : new Set();

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
  DIALOG_CONFIRM_LIST.add(dialog);

  try {
    return await dialog.show(data);
  } finally {
    setTimeout(() => {
      DIALOG_CONFIRM_LIST.delete(dialog);
    }, UI_CONFIGS.dialog.disposalDelay);
  }
}

const DialogConfirm = dialogComponent<DialogConfirmData, boolean>((dialog) => {
  const Icon = CONFIRM_TYPE_ICONS[dialog.data.type ?? 'info'];
  return (
    <>
      {dialog.data.type && (
        <DialogHero>
          <Icon
            className={
              UI_CONFIGS.dialog[`${dialog.data.type}Color` as never] ?? CONFIRM_TYPE_COLORS[dialog.data.type] ?? ''
            }
          />
        </DialogHero>
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

export const DialogConfirmHost = template(() => {
  if (!DIALOG_CONFIRM_LIST.size) return null;
  return Array.from(DIALOG_CONFIRM_LIST).map((dialog, index) => {
    return <DialogConfirm className={UI_CONFIGS.dialog.confirmClass} key={index} dialog={dialog} />;
  });
}, 'DialogConfirmHost');
