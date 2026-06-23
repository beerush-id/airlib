import { DIALOG_CONFIGS } from './components/dialog/config.js';
import { THEME_CONFIGS } from './components/theme/config.js';
import { WINDOW_CONFIGS } from './components/window/config.js';
import { ICON_CONFIGS } from './icons/config.js';

export const UI_CONFIGS = {
  dialog: DIALOG_CONFIGS,
  icon: ICON_CONFIGS,
  window: WINDOW_CONFIGS,
  theme: THEME_CONFIGS,
};

export function configureUI(config: Partial<typeof UI_CONFIGS>) {
  applyConfig(UI_CONFIGS as Record<string, unknown>, config);
}

function applyConfig(target: Record<string, unknown>, source: unknown) {
  if (!source || typeof source !== 'object') return;

  const src = source as Record<string, unknown>;

  for (const [key, targetValue] of Object.entries(target)) {
    if (src[key] != null) {
      if (typeof targetValue === 'object') {
        applyConfig(targetValue as Record<string, unknown>, src[key]);
      } else {
        target[key] = src[key];
      }
    }
  }
}
