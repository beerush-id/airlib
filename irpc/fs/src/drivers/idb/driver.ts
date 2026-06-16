import { HandlerError, type IRPCDriver, type IRPCFile, type IRPCMeta } from '@irpclib/irpc';
import type { FSAdapter } from '../../adapter.js';
import { FSError } from '../../error.js';
import type { FSEntry, FSFile } from '../../index.js';
import { getFileExt, getFileType, normalizePath } from '../../utils.js';
import { getIDBFSOptions, type IDBFSOptions } from './context.js';

export interface IDBRecord {
  path: string;
  parent: string;
  name: string;
  type: string;
  size: number;
  isDirectory: boolean;
  data?: ArrayBuffer;
}

export class IDBFSDriver implements IRPCDriver<FSAdapter> {
  private db?: Promise<IDBDatabase>;
  private currentDbName?: string;

  constructor(public readonly options?: Partial<IDBFSOptions>) {}

  getOptions(): IDBFSOptions {
    const ctxOptions = getIDBFSOptions();
    const dbName = ctxOptions?.dbName || this.options?.dbName || 'irpc-fs';
    const storeName = ctxOptions?.storeName || this.options?.storeName || 'files';

    return { dbName, storeName };
  }

  private getDB(): Promise<IDBDatabase> {
    const { dbName, storeName } = this.getOptions();

    if (this.db && this.currentDbName === dbName) {
      return this.db;
    }

    if (typeof indexedDB === 'undefined') {
      return Promise.reject(FSError.failed('init', 'Storage not available'));
    }

    this.currentDbName = dbName;

    this.db = new Promise((resolve, reject) => {
      try {
        const req = indexedDB.open(dbName, 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: 'path' });
            store.createIndex('parent', 'parent', { unique: false });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(FSError.failed('init', 'Failed to initialize storage'));
      } catch (err) {
        reject(FSError.failed('init', 'Failed to initialize storage'));
      }
    });

    return this.db;
  }

  private async withStore<T>(
    mode: IDBTransactionMode,
    fn: (store: IDBObjectStore, resolve: (val: T) => void, reject: (err: any) => void) => void
  ): Promise<T> {
    const db = await this.getDB();
    const { storeName } = this.getOptions();
    return new Promise((resolve, reject) => {
      let tx: IDBTransaction;
      try {
        tx = db.transaction(storeName, mode);
      } catch (err) {
        return reject(err);
      }

      const store = tx.objectStore(storeName);

      tx.oncomplete = () => {};
      tx.onerror = () => reject(tx.error);

      fn(store, resolve, reject);
    });
  }

  private async ensureParents(reqPath: string): Promise<void> {
    if (reqPath === '/' || reqPath === '') return;

    const parts = reqPath.split('/').filter(Boolean);
    parts.pop();

    let current = '/';
    const missing: IDBRecord[] = [];

    for (const part of parts) {
      const parent = current;
      current = `${current}${part}/`;

      missing.push({
        path: current,
        parent: parent,
        name: part,
        type: 'directory',
        size: 0,
        isDirectory: true,
      });
    }

    if (missing.length === 0) return;

    await this.withStore('readwrite', (store, resolve, reject) => {
      let pending = missing.length;
      for (const m of missing) {
        const req = store.put(m);
        req.onsuccess = () => {
          pending--;
          if (pending === 0) resolve(undefined);
        };
        req.onerror = () => reject(req.error);
      }
    });
  }

  private async getRecord(reqPath: string, operation: string): Promise<IDBRecord> {
    return this.withStore<IDBRecord>('readonly', (store, resolve, reject) => {
      const p1 = normalizePath(reqPath, false);
      const req = store.get(p1);
      req.onsuccess = () => {
        if (req.result) return resolve(req.result);

        if (p1 !== '/') {
          const p2 = p1 + '/';
          const req2 = store.get(p2);
          req2.onsuccess = () => {
            if (req2.result) return resolve(req2.result);
            reject(FSError.notFound(operation, reqPath));
          };
          req2.onerror = () => reject(req2.error);
        } else {
          reject(FSError.notFound(operation, reqPath));
        }
      };
      req.onerror = () => reject(req.error);
    });
  }

  async read(_meta: IRPCMeta, reqPath: string): Promise<FSFile> {
    try {
      const record = await this.getRecord(reqPath, 'read');

      if (record.isDirectory) throw FSError.notPermitted('read (is a directory)');

      let objectUrl = record.path;
      if (record.data) {
        objectUrl = URL.createObjectURL(new Blob([record.data], { type: record.type }));
      }

      return {
        path: record.path,
        url: objectUrl,
        size: record.size,
        type: record.type,
        isDirectory: false,
      };
    } catch (err: any) {
      if (err instanceof HandlerError) throw err;
      throw FSError.failed('read', reqPath);
    }
  }

  async write(_meta: IRPCMeta, reqPath: string, file: IRPCFile): Promise<FSFile> {
    const p = normalizePath(reqPath, reqPath.endsWith('/'));

    try {
      await this.ensureParents(p);

      const buffer = await file.data.arrayBuffer();
      const parts = p.split('/').filter(Boolean);
      const name = parts.pop() || '';
      const parent = p.substring(0, p.lastIndexOf(name));

      const record: IDBRecord = {
        path: p,
        parent,
        name,
        type: file.meta.type || getFileType('', getFileExt(p)),
        size: file.meta.size || buffer.byteLength,
        isDirectory: false,
        data: buffer,
      };

      await this.withStore('readwrite', (store, resolve, reject) => {
        const req = store.put(record);
        req.onsuccess = () => resolve(undefined);
        req.onerror = () => reject(req.error);
      });

      const objectUrl = URL.createObjectURL(new Blob([buffer], { type: record.type }));

      return {
        path: p,
        url: objectUrl,
        size: record.size,
        type: record.type,
        isDirectory: false,
      };
    } catch (err: any) {
      throw FSError.failed('write', reqPath);
    }
  }

  async remove(_meta: IRPCMeta, reqPath: string): Promise<boolean> {
    try {
      const record = await this.getRecord(reqPath, 'remove');
      if (record.isDirectory) throw FSError.notPermitted('remove (is a directory)');

      await this.withStore('readwrite', (store, resolve, reject) => {
        const req = store.delete(record.path);
        req.onsuccess = () => resolve(undefined);
        req.onerror = () => reject(req.error);
      });

      return true;
    } catch (err: any) {
      if (err instanceof HandlerError) throw err;
      throw FSError.failed('remove', reqPath);
    }
  }

  async rmdir(_meta: IRPCMeta, reqPath: string, recursive?: boolean): Promise<boolean> {
    try {
      const record = await this.getRecord(reqPath, 'rmdir');
      if (!record.isDirectory) throw FSError.notPermitted('rmdir (not a directory)');

      const p = record.path;

      const children = await this.withStore<IDBRecord[]>('readonly', (store, resolve, reject) => {
        const idx = store.index('parent');
        const req = idx.getAll(p);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });

      if (!recursive && children.length > 0) throw FSError.notEmpty('rmdir', reqPath);

      await this.withStore('readwrite', (store, resolve, reject) => {
        const delReq = store.delete(p);
        delReq.onerror = () => reject(delReq.error);

        if (recursive) {
          if (typeof IDBKeyRange === 'undefined') {
            return reject(new Error('IDBKeyRange not available'));
          }
          const req = store.openCursor(IDBKeyRange.lowerBound(p));
          req.onsuccess = (e: any) => {
            const cursor = e.target.result as IDBCursorWithValue;
            if (cursor) {
              if (cursor.key.toString().startsWith(p)) {
                cursor.delete();
                cursor.continue();
              } else {
                resolve(undefined);
              }
            } else {
              resolve(undefined);
            }
          };
          req.onerror = () => reject(req.error);
        } else {
          delReq.onsuccess = () => resolve(undefined);
        }
      });

      return true;
    } catch (err: any) {
      if (err instanceof HandlerError) throw err;
      throw FSError.failed('rmdir', reqPath);
    }
  }

  async dir(_meta: IRPCMeta, reqPath?: string): Promise<FSEntry[]> {
    try {
      let p = '/';
      if (reqPath && reqPath !== '/') {
        const record = await this.getRecord(reqPath, 'dir');
        if (!record.isDirectory) throw FSError.notPermitted('dir (not a directory)');
        p = record.path;
      }

      const children = await this.withStore<IDBRecord[]>('readonly', (store, resolve, reject) => {
        const idx = store.index('parent');
        const req = idx.getAll(p);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });

      return children.map((c) => ({
        path: c.path,
        size: c.size,
        type: c.type,
        isDirectory: c.isDirectory,
      }));
    } catch (err: any) {
      if (err instanceof HandlerError) throw err;
      throw FSError.failed('dir', reqPath || '/');
    }
  }
}
