import { getKeyboard, getLiveMedia, getPointer } from './utils/index.js';

export * from './components/index.js';
export * from './config.js';
export * from './types.js';

export function enableLiveObjects() {
  getPointer();
  getLiveMedia();
  getKeyboard();
}
