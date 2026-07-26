import { For, template } from '@anchorlib/react';
import { ConfirmDialog } from './Confirm.js';
import { DIALOG_CONFIGS } from './config.js';
import { CONFIRM_DIALOG_LIST } from './supporting.js';

export const ConfirmDialogHost = template(
  () => (
    <For each={() => Array.from(CONFIRM_DIALOG_LIST)}>
      {(dialog) => <ConfirmDialog className={DIALOG_CONFIGS.confirm.class} dialog={dialog} />}
    </For>
  ),
  'ConfirmDialogHost'
);
