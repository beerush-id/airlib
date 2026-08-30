export * from './adapter.js';
export * from './drivers/index.js';
export * from './error.js';
export * from './music/constructor.js';
export * from './types.js';

import { KIE_DRIVER } from './drivers/index.js';
import { SUNO_MUSIC_DRIVER } from './music/suno/index.js';

SUNO_MUSIC_DRIVER.use(KIE_DRIVER);
