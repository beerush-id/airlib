import { createPackage, type IRPCFile } from '@irpclib/irpc';

export const speechPkg = createPackage({
  name: 'speech',
  version: '1.0.0',
});

export type SpeakOutput = {
  audioUrl: string;
};
export type TranscribeOutput = {
  text: string;
};

export type SpeakFn = (text: string) => Promise<SpeakOutput>;
export type TranscribeFn = (audio: IRPCFile) => Promise<TranscribeOutput>;

export const speech = {
  speak: speechPkg.declare<SpeakFn>('speak', () => ({ audioUrl: '' })),
  transcribe: speechPkg.declare<TranscribeFn>('transcribe', () => ({ text: '' })),
};
