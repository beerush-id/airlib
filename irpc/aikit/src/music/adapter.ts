import { IRPCAdapter, type IRPCDriver, type IRPCMeta } from '@irpclib/irpc';
import { MUSIC_MODELS } from './constant.js';
import type { MusicOptions } from './index.js';

export type MusicMeta = IRPCMeta & {
  model: string;
  version: string;
};

export class MusicAdapter extends IRPCAdapter {
  public create(meta: MusicMeta, prompt: string, options?: MusicOptions) {
    const { model = MUSIC_MODELS.suno.v5 } = options ?? {};
    const [modelName, modelVersion] = model.split('@');

    meta.model = modelName;
    meta.version = modelVersion;

    return this.dispatch('create', meta, prompt, options);
  }
}

export type MusicDriver = IRPCDriver<MusicAdapter>;
