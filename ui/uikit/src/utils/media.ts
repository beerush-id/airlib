import { anchor, isBrowser, mutable, onCleanup, type StateUnsubscribe } from '@anchorlib/core';

export const MEDIA_SELECTORS = {
  dark: '(prefers-color-scheme: dark)',
  light: '(prefers-color-scheme: light)',
  mobile: '(max-width: 639px)',
  tablet: '(min-width: 640px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  landscape: '(orientation: landscape)',
  portrait: '(orientation: portrait)',
  touch: '(pointer: coarse)',
  hover: '(hover: hover)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  highContrast: '(prefers-contrast: more)',
  retina: '(resolution >= 2dppx)',
};
export type ViewportSelectors = typeof MEDIA_SELECTORS;

export type MediaType = {
  [K in keyof ViewportSelectors]: boolean;
};

export class LiveMedia implements MediaType {
  public dark = false;
  public light = false;
  public width = 0;
  public height = 0;
  public mobile = false;
  public tablet = false;
  public desktop = false;
  public landscape = false;
  public portrait = false;
  public touch = false;
  public hover = false;
  public reducedMotion = false;
  public highContrast = false;
  public retina = false;

  constructor() {
    if (!isBrowser() || typeof window.matchMedia === 'undefined') return;

    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }
}

const currentMedia = isBrowser() ? mutable(new LiveMedia()) : new LiveMedia();

let disposeMedia: StateUnsubscribe | undefined;

export function watchMedia() {
  if (disposeMedia) return disposeMedia;

  const CLEANUP_HANDLERS = new Set<() => void>();

  const handleResize = () => {
    anchor.assign(currentMedia, { width: window.innerWidth, height: window.innerHeight });
  };

  window.addEventListener('resize', handleResize);
  CLEANUP_HANDLERS.add(() => window.removeEventListener('resize', handleResize));

  for (const [key, value] of Object.entries(MEDIA_SELECTORS) as [keyof MediaType, string][]) {
    const mediaQuery = window.matchMedia(value);
    currentMedia[key] = mediaQuery.matches;

    const handleMediaChange = () => {
      currentMedia[key] = mediaQuery.matches;
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    CLEANUP_HANDLERS.add(() => mediaQuery.removeEventListener('change', handleMediaChange));
  }

  disposeMedia = () => {
    for (const cleanup of CLEANUP_HANDLERS) {
      cleanup();
    }

    disposeMedia = undefined;
  };

  return disposeMedia;
}

export function getLiveMedia() {
  if (!disposeMedia && isBrowser()) {
    onCleanup(watchMedia());
  }

  return currentMedia;
}
