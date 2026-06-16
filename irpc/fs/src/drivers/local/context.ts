import { getContext, setContext } from '@irpclib/irpc';

export interface LocalFSOptions {
  baseDir: string;
  publicUrl: string;
}

export const LOCAL_FS_OPTIONS = Symbol('LOCAL_FS_OPTIONS');

export function setLocalFSOptions(options: LocalFSOptions) {
  setContext(LOCAL_FS_OPTIONS, options);
}

export function getLocalFSOptions(): LocalFSOptions | undefined {
  return getContext(LOCAL_FS_OPTIONS);
}

export function localfs(options: LocalFSOptions) {
  return () => setLocalFSOptions(options);
}
