import { onCleanup } from '@anchorlib/core';
import { watchKeyboard, watchMedia, watchPointer } from './utils/index.js';

export const KIT_CONFIGS = {
  autofocus: true,
  trapOverflow: true,

  dialogPortal: 'body',
};

export function configureKit(config: Partial<typeof KIT_CONFIGS>) {
  Object.assign(KIT_CONFIGS, config);
}

export function enableLiveObjects() {
  const disposeMedia = watchMedia();
  const disposePointer = watchPointer();
  const disposeKeyboard = watchKeyboard();

  onCleanup(() => {
    disposeMedia();
    disposePointer();
    disposeKeyboard();
  });
}
