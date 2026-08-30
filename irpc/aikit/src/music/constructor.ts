export * from './adapter.js';
export * from './constant.js';
export * from './suno/index.js';

import { MusicAdapter } from './adapter.js';
import { music, musicPkg } from './index.js';
import { SUNO_MUSIC_DRIVER } from './suno/index.js';

export const musicAdapter = new MusicAdapter(musicPkg);
musicAdapter.attach(music);

musicAdapter.use(SUNO_MUSIC_DRIVER);
