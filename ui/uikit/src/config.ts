import { onCleanup } from '@anchorlib/core';
import { watchDocument, watchKeyboard, watchMedia, watchPointer } from './utils/index.js';

export const SNAP_BOUND = {
  edge: 'edge',
  center: 'center',
  all: 'all',
} as const;

export type SnapToBound = (typeof SNAP_BOUND)[keyof typeof SNAP_BOUND];

export type OverflowStrategy = 'flip' | 'shift' | 'resize';

export type KitConfigs = {
  autofocus: boolean;
  trapOverflow: boolean;
  dialogPortal: string;

  snapBound: SnapToBound;
  snapThreshold: number;
  resizeThreshold: number;

  windowX?: number;
  windowY?: number;
  windowWidth?: number;
  windowHeight?: number;
  windowZIndex: number;
  windowMinWidth: number;
  windowMaxWidth?: number;
  windowMinHeight: number;
  windowMaxHeight?: number;

  rememberWindows: boolean;

  popoverOffset: number;
  popoverOverflow: OverflowStrategy[];
  popoverPortal: string;
};

export const KIT_CONFIGS: KitConfigs = {
  autofocus: true,
  trapOverflow: true,

  snapBound: SNAP_BOUND.edge,
  snapThreshold: 10,
  resizeThreshold: 10,

  windowZIndex: 50,
  windowMinWidth: 128,
  windowMinHeight: 128,

  dialogPortal: 'body',
  rememberWindows: true,

  popoverOffset: 8,
  popoverOverflow: ['flip', 'shift'],
  popoverPortal: 'body',
};

export function configureKit(config: KitConfigs) {
  Object.assign(KIT_CONFIGS, config);
}

export function enableLiveObjects() {
  const disposeMedia = watchMedia();
  const disposePointer = watchPointer();
  const disposeKeyboard = watchKeyboard();
  const disposeDocument = watchDocument();

  onCleanup(() => {
    disposeMedia();
    disposePointer();
    disposeKeyboard();
    disposeDocument();
  });
}
