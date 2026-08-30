import { IRPCAdapter } from '@irpclib/irpc';
import { AIAdapter } from '../../adapter.js';
import type { MusicDriver, MusicMeta } from '../adapter.js';
import type { MusicOptions } from '../index.js';
import { SUNO_IDENTIFIER, SUNO_MODELS_MAP } from './constant.js';

export class SunoDriver extends AIAdapter implements MusicDriver {
  public create(meta: MusicMeta, prompt: string, options?: MusicOptions) {
    if (meta.model !== SUNO_IDENTIFIER) throw IRPCAdapter.next();

    return this.submit({
      ...options,
      prompt,
      model: SUNO_MODELS_MAP[`${meta.model}@${meta.version}`],
    });
  }
}

export const SUNO_MUSIC_DRIVER = new SunoDriver();
