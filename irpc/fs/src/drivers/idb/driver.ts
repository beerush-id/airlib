import { type IRPCDriver, type IRPCFile } from '@irpclib/irpc';
import type { FSAdapter } from '../../adapter.js';
import type { FSMeta, FSFile } from '../../index.js';
import { FSError } from '../../error.js';
import { getMimeType, join, withExt } from '../../utils.js';
import { getIDBFSOptions, type IDBFSOptions } from './context.js';
import { IDBStore, type MetaEntry } from './store.js';

export class IDBFSDriver implements IRPCDriver<FSAdapter> {
  private store?: IDBStore;

  constructor(public readonly options?: Partial<IDBFSOptions>) {}

  private getStore(): IDBStore {
    if (this.store) return this.store;
    const ctx = getIDBFSOptions();
    return (this.store = new IDBStore({
      dbName: ctx?.dbName || this.options?.dbName || 'irpc-fs',
      metaStore: 'meta',
      blobStore: ctx?.storeName || this.options?.storeName || 'blobs',
    }));
  }

  private key(meta: FSMeta, path: string): string {
    return join(meta.prefix, path);
  }

  private thumbKey(meta: FSMeta, path: string): string | null {
    return meta.thumbnailPrefix ? join(meta.thumbnailPrefix, path) : null;
  }

  private url(key: string): string {
    const s = this.getStore();
    return `/idb-blob/${s.dbName}/${s.blobStoreName}${key}`;
  }

  private async ensureParents(key: string): Promise<void> {
    const store = this.getStore();
    const parts = key.split('/').filter(Boolean);
    parts.pop();
    let current = '';
    for (const part of parts) {
      current += `/${part}`;
      const existing = await store.getMeta(current);
      if (!existing) {
        const now = Date.now();
        await store.putMeta(current, {
          path: current,
          size: 0,
          type: 'directory',
          mime: '',
          isDirectory: true,
          createdAt: now,
          updatedAt: now,
        });
      }
    }
  }

  private toFSFile(entry: MetaEntry, meta: FSMeta): FSFile {
    const key = entry.path;
    return {
      path: entry.path.replace(meta.prefix, '') || '/',
      url: entry.isDirectory ? '' : this.url(key),
      size: entry.size,
      type: entry.isDirectory ? 'directory' : entry.type,
      isDirectory: entry.isDirectory,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    };
  }

  async read(meta: FSMeta, path: string): Promise<FSFile> {
    const key = this.key(meta, path);
    const entry = await this.getStore().getMeta(key);
    if (!entry) throw FSError.notFound('read', path);
    if (entry.isDirectory) throw FSError.notPermitted('read (is a directory)');
    return this.toFSFile(entry, meta);
  }

  async write(meta: FSMeta, path: string, file: IRPCFile, thumbnail?: IRPCFile): Promise<FSFile> {
    const store = this.getStore();
    const key = this.key(meta, path);
    const tKey = this.thumbKey(meta, path);

    await this.ensureParents(key);
    const now = Date.now();

    if (thumbnail && tKey) {
      const thumbBuf = await thumbnail.data.arrayBuffer();
      const thumbExt = thumbnail.meta.type;
      const thumbKey = withExt(tKey, thumbExt);
      await store.putBlob(thumbKey, new Blob([thumbBuf], { type: getMimeType(thumbnail.meta.type) }));
    }

    try {
      const buf = await file.data.arrayBuffer();
      const mime = getMimeType(file.meta.type || path);
      await store.putBlob(key, new Blob([buf], { type: mime }));

      const entry: MetaEntry = {
        path: key,
        size: file.meta.size || buf.byteLength,
        type: file.meta.type,
        mime,
        isDirectory: false,
        createdAt: now,
        updatedAt: now,
      };
      await store.putMeta(key, entry);

      const result = this.toFSFile(entry, meta);
      if (thumbnail && tKey) {
        const thumbExt = thumbnail.meta.type;
        result.thumbnailUrl = this.url(withExt(tKey, thumbExt));
      }
      return result;
    } catch (e) {
      if (thumbnail && tKey) await store.deleteBlob(tKey);
      throw FSError.failed('write', path);
    }
  }

  async remove(meta: FSMeta, path: string): Promise<boolean> {
    const store = this.getStore();
    const key = this.key(meta, path);
    const entry = await store.getMeta(key);
    if (!entry) throw FSError.notFound('remove', path);
    if (entry.isDirectory) throw FSError.notPermitted('remove (is a directory)');
    await Promise.all([store.deleteMeta(key), store.deleteBlob(key)]);
    return true;
  }

  async rmdir(meta: FSMeta, path: string, recursive?: boolean): Promise<boolean> {
    const store = this.getStore();
    const key = this.key(meta, path);
    const entry = await store.getMeta(key);
    if (!entry) throw FSError.notFound('rmdir', path);
    if (!entry.isDirectory) throw FSError.notPermitted('rmdir (not a directory)');

    const prefix = key.endsWith('/') ? key : `${key}/`;
    const children = await store.listMeta(prefix);

    if (!recursive && children.length > 0) throw FSError.notEmpty('rmdir', path);

    await store.deleteAll(key);
    return true;
  }

  async dir(meta: FSMeta, path?: string): Promise<FSFile[]> {
    const store = this.getStore();
    const key = path ? this.key(meta, path) : meta.prefix;
    const prefix = key.endsWith('/') ? key : `${key}/`;
    const entries = await store.listMeta(prefix);

    return entries
      .filter((e) => {
        const rel = e.path.substring(prefix.length);
        return !rel.includes('/') || (rel.endsWith('/') && rel.indexOf('/') === rel.length - 1);
      })
      .map((e) => this.toFSFile(e, meta));
  }

  async mkdir(meta: FSMeta, path: string): Promise<FSFile> {
    const store = this.getStore();
    const key = this.key(meta, path);
    const existing = await store.getMeta(key);
    if (existing) return this.toFSFile(existing, meta);

    const now = Date.now();
    const entry: MetaEntry = {
      path: key,
      size: 0,
      type: 'directory',
      mime: '',
      isDirectory: true,
      createdAt: now,
      updatedAt: now,
    };
    await this.ensureParents(key);
    await store.putMeta(key, entry);
    return this.toFSFile(entry, meta);
  }

  async stat(meta: FSMeta, path: string): Promise<FSFile> {
    const key = this.key(meta, path);
    const entry = await this.getStore().getMeta(key);
    if (!entry) throw FSError.notFound('stat', path);
    return this.toFSFile(entry, meta);
  }

  async move(meta: FSMeta, from: string, to: string, dstMeta?: FSMeta): Promise<FSFile> {
    const store = this.getStore();
    const srcKey = this.key(meta, from);
    const dst = dstMeta || meta;
    const dstKey = this.key(dst, to);

    const entry = await store.getMeta(srcKey);
    if (!entry) throw FSError.notFound('move', from);

    await this.ensureParents(dstKey);
    const blob = await store.getBlob(srcKey);
    if (blob) await store.putBlob(dstKey, blob);
    await store.putMeta(dstKey, { ...entry, path: dstKey, updatedAt: Date.now() });
    await Promise.all([store.deleteMeta(srcKey), store.deleteBlob(srcKey)]);
    return this.toFSFile({ ...entry, path: dstKey }, dst);
  }

  async copy(meta: FSMeta, from: string, to: string, dstMeta?: FSMeta): Promise<FSFile> {
    const store = this.getStore();
    const srcKey = this.key(meta, from);
    const dst = dstMeta || meta;
    const dstKey = this.key(dst, to);

    const entry = await store.getMeta(srcKey);
    if (!entry) throw FSError.notFound('copy', from);

    await this.ensureParents(dstKey);
    const blob = await store.getBlob(srcKey);
    if (blob) await store.putBlob(dstKey, blob);
    const now = Date.now();
    await store.putMeta(dstKey, { ...entry, path: dstKey, createdAt: now, updatedAt: now });
    return this.toFSFile({ ...entry, path: dstKey, createdAt: now, updatedAt: now }, dst);
  }

  async exists(meta: FSMeta, path: string): Promise<boolean> {
    const entry = await this.getStore().getMeta(this.key(meta, path));
    return !!entry;
  }
}
