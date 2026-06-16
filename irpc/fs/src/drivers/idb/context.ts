import { getContext, setContext } from '@irpclib/irpc';

export interface IDBFSOptions {
  dbName: string;
  storeName: string;
}

export const IDB_FS_OPTIONS = Symbol('IDB_FS_OPTIONS');

export function setIDBFSOptions(options: IDBFSOptions) {
  setContext(IDB_FS_OPTIONS, options);
}

export function getIDBFSOptions(): IDBFSOptions | undefined {
  return getContext(IDB_FS_OPTIONS);
}

export function idbfs(options: IDBFSOptions) {
  return () => setIDBFSOptions(options);
}
