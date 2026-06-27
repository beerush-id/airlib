import { onCleanup } from '@anchorlib/core';
import { watchDocument, watchKeyboard, watchMedia, watchPointer } from './utils/index.js';

export type SnapToBound = 'edge' | 'center' | 'all';

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

/**
 * Updates global UIKit runtime configuration options.
 *
 * @param config - Partial or complete configuration overrides to merge into KIT_CONFIGS.
 */
export function configureKit(config: Partial<KitConfigs>) {
  Object.assign(KIT_CONFIGS, config);
}

/**
 * Initializes global reactive hardware and browser trackers (media queries, pointer coordinates,
 * keyboard modifiers, and active document focus). Automatically binds cleanup to the active state scope.
 */
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

export const SNAP_BOUND = {
  edge: 'edge',
  center: 'center',
  all: 'all',
} as const;

export const KIT_CONFIGS: KitConfigs = {
  autofocus: true,
  trapOverflow: true,

  snapBound: SNAP_BOUND.edge,
  snapThreshold: 10,
  resizeThreshold: 10,

  windowZIndex: 45,
  windowMinWidth: 128,
  windowMinHeight: 128,

  dialogPortal: 'body',
  rememberWindows: true,

  popoverOffset: 8,
  popoverOverflow: ['flip', 'shift'],
  popoverPortal: 'body',
};
