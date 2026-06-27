// biome-ignore lint/suspicious/noExplicitAny: Expect any;
export type AnyType = any;

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
