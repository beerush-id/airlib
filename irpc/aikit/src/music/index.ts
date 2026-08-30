import { createPackage } from '@irpclib/irpc';
import { z } from 'zod/v4';
import { MUSIC_MODELS } from './constant.js';

export const musicPkg = createPackage({
  name: 'music',
  version: '1.0.0',
});

export const musicPrompt = z.string();
export const musicOptions = z
  .object({
    model: z.string().optional().default(MUSIC_MODELS.suno.v5),
    style: z.string().optional(),
    persona: z
      .object({
        id: z.string(),
        model: z.union([z.literal('style_persona'), z.literal('voice_persona')]).optional(),
      })
      .optional(),
    styleWeight: z.number().optional(),
    audioWeight: z.number().optional(),
    weirdness: z.number().optional(),
    instrumental: z.boolean().optional(),
  })
  .optional();

export const musicOutput = z.object({
  audioUrl: z.string(),
});

export type MusicOutput = z.infer<typeof musicOutput>;
export type MusicOptions = z.infer<typeof musicOptions>;

export type CreateMusicFn = (prompt: string, options?: MusicOptions) => Promise<MusicOutput>;

const create = musicPkg.declare<CreateMusicFn>('create', {
  seed: () => ({ audioUrl: '' }),
  schema: {
    input: [musicPrompt, musicOptions],
    output: musicOutput,
  },
});

export const music = { create };
