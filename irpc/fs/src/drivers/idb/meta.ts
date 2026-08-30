import { IRPCBlob, type IRPCDriver, type IRPCFile } from '@irpclib/irpc';
import type { FSAdapter } from '../../adapter.js';
import { FSError } from '../../error.js';
import type { FSBlob, FSEntry, FSMeta, FSPayload, FSReadResult } from '../../index.js';
import type { AnyType } from '../../types.js';
import { join } from '../../utils.js';
import { getIDBFSOptions, type IDBFSOptions } from './context.js';
import { IDBStore } from './store.js';

export class IDBMetaDriver implements IRPCDriver<FSAdapter> {
  private store?: IDBStore;

  constructor(public readonly options?: Partial<IDBFSOptions>) {}

  private getStore(): IDBStore {
    if (this.store) return this.store;
    const ctx = getIDBFSOptions();
    return (this.store = new IDBStore({
      dbName: ctx?.dbName || this.options?.dbName || 'irpc-fs',
      metaStore: 'meta',
      blobStore: ctx?.storeName || this.options?.storeName || 'blobs',
      version: ctx?.version || this.options?.version || 2,
    }));
  }

  private key(meta: FSMeta, path: string): string {
    return join(meta.prefix, path);
  }

  private async ensureParents(key: string): Promise<void> {
    const store = this.getStore();
    const parts = key.split('/').filter(Boolean);
    parts.pop();
    let current = '';
    for (const part of parts) {
      const directory = current || '/';
      current += `/${part}`;
      const existing = await store.getMeta(current);
      if (!existing) {
        const now = Date.now();
        await store.putMeta(current, {
          path: current,
          directory,
          name: part,
          type: 'directory',
          isDirectory: true,
          createdAt: now,
          updatedAt: now,
        });
      }
    }
  }

  async create(meta: FSMeta, path: string, entry?: FSPayload): Promise<FSEntry> {
    const store = this.getStore();
    const key = this.key(meta, path);
    await this.ensureParents(key);

    const file = meta.response as FSEntry;
    if (file) {
      file.path = key; // Save physical key in db, we remap it to virtual path when reading
      await store.putMeta(key, file);

      // Return virtual path
      return { ...file, path };
    }
    throw FSError.failed('create', path);
  }

  async read(meta: FSMeta, path: string): Promise<FSReadResult> {
    const key = this.key(meta, path);
    const entry = await this.getStore().getMeta(key);
    if (!entry) throw FSError.notFound('read', path);
    if (entry.isDirectory) throw FSError.notPermitted('read (is a directory)');

    // Remap physical key back to virtual path
    entry.path = entry.path.replace(meta.prefix, '') || '/';
    return {
      data: new IRPCBlob(entry.url || '', entry) as FSBlob,
      file: entry,
    };
  }

  async write(meta: FSMeta, path: string, file: IRPCFile): Promise<FSEntry> {
    const store = this.getStore();
    const key = this.key(meta, path);
    await this.ensureParents(key);

    const responseFile = meta.response as FSEntry;
    if (responseFile) {
      responseFile.path = key;
      await store.putMeta(key, responseFile);
      return { ...responseFile, path };
    }
    throw FSError.failed('write', path);
  }

  async update(meta: FSMeta, path: string, entry: FSPayload, file?: IRPCFile): Promise<FSEntry> {
    const store = this.getStore();
    const key = this.key(meta, path);
    const existing = await store.getMeta(key);
    if (!existing) throw FSError.notFound('update', path);

    // Merge the safe payload over the existing record
    const newEntry = { ...existing, ...entry };
    newEntry.path = key; // Lock the physical path

    await store.putMeta(key, newEntry);

    if (meta.rollback) {
      meta.rollback.add(async () => {
        await store.putMeta(key, existing);
      });
    }

    return { ...newEntry, path };
  }

  async remove(meta: FSMeta, path: string): Promise<boolean> {
    const store = this.getStore();
    const key = this.key(meta, path);
    const entry = await store.getMeta(key);
    if (!entry) throw FSError.notFound('remove', path);
    if (entry.isDirectory) throw FSError.notPermitted('remove (is a directory)');

    await store.deleteMeta(key);
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

    await store.deleteAll(key); // This also calls deleteBlob internally inside IDBStore
    return true;
  }

  async dir(meta: FSMeta, path?: string): Promise<FSEntry[]> {
    const store = this.getStore();
    const key = path ? this.key(meta, path) : meta.prefix;
    const prefix = key.endsWith('/') ? key : `${key}/`;
    const entries = await store.listMeta(prefix);

    return entries
      .filter((e) => {
        const rel = e.path.substring(prefix.length);
        return !rel.includes('/') || (rel.endsWith('/') && rel.indexOf('/') === rel.length - 1);
      })
      .map((e) => ({ ...e, path: e.path.replace(meta.prefix, '') || '/' }));
  }

  async mkdir(meta: FSMeta, path: string, entry?: FSPayload): Promise<FSEntry> {
    const store = this.getStore();
    const key = this.key(meta, path);
    const existing = await store.getMeta(key);
    if (existing) return { ...existing, path };

    await this.ensureParents(key);
    const responseFile = meta.response as FSEntry;
    if (responseFile) {
      responseFile.path = key;
      await store.putMeta(key, responseFile);
      return { ...responseFile, path };
    }
    throw FSError.failed('mkdir', path);
  }

  async stat(meta: FSMeta, path: string): Promise<FSEntry> {
    const key = this.key(meta, path);
    const entry = await this.getStore().getMeta(key);
    if (!entry) throw FSError.notFound('stat', path);
    return { ...entry, path: entry.path.replace(meta.prefix, '') || '/' };
  }

  async move(meta: FSMeta, from: string, to: string, dstMeta?: FSMeta, entry?: FSPayload): Promise<FSEntry> {
    const store = this.getStore();
    const srcKey = this.key(meta, from);
    const dst = dstMeta || meta;
    const dstKey = this.key(dst, to);

    const existing = await store.getMeta(srcKey);
    if (!existing) throw FSError.notFound('move', from);

    await this.ensureParents(dstKey);

    const directory = dstKey.substring(0, dstKey.lastIndexOf('/')) || '/';
    const name = dstKey.substring(dstKey.lastIndexOf('/') + 1);

    const newEntry = { ...existing, path: dstKey, directory, name, updatedAt: Date.now() };
    if (entry) {
      Object.assign(newEntry, entry);
    }

    await store.putMeta(dstKey, newEntry);
    await store.deleteMeta(srcKey);

    if (dst.rollback) {
      dst.rollback.add(async () => {
        await store.putMeta(srcKey, existing);
        await store.deleteMeta(dstKey);
      });
    }

    return { ...newEntry, path: to };
  }

  async copy(meta: FSMeta, from: string, to: string, dstMeta?: FSMeta, entry?: FSPayload): Promise<FSEntry> {
    const store = this.getStore();
    const srcKey = this.key(meta, from);
    const dst = dstMeta || meta;
    const dstKey = this.key(dst, to);

    const existing = await store.getMeta(srcKey);
    if (!existing) throw FSError.notFound('copy', from);

    await this.ensureParents(dstKey);

    const directory = dstKey.substring(0, dstKey.lastIndexOf('/')) || '/';
    const name = dstKey.substring(dstKey.lastIndexOf('/') + 1);

    const newEntry = { ...existing, path: dstKey, directory, name, updatedAt: Date.now(), createdAt: Date.now() };
    if (entry) {
      Object.assign(newEntry, entry);
    }

    await store.putMeta(dstKey, newEntry);

    if (dst.rollback) {
      dst.rollback.add(async () => {
        await store.deleteMeta(dstKey);
      });
    }

    return { ...newEntry, path: to };
  }

  async exists(meta: FSMeta, path: string): Promise<boolean> {
    const entry = await this.getStore().getMeta(this.key(meta, path));
    return !!entry;
  }
}
