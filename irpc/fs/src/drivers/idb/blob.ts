import { IRPCAdapter, type IRPCDriver, type IRPCFile } from '@irpclib/irpc';
import type { FSAdapter } from '../../adapter.js';
import type { FSEntry, FSMeta, FSPayload } from '../../index.js';
import { getMimeType, join } from '../../utils.js';
import { getIDBFSOptions, type IDBFSOptions } from './context.js';
import { IDBStore } from './store.js';

export class IDBBlobDriver implements IRPCDriver<FSAdapter> {
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

  private url(key: string): string {
    const s = this.getStore();
    return `/idb-blob/${s.dbName}/${s.blobStoreName}${key}`;
  }

  async write(meta: FSMeta, path: string, file: IRPCFile): Promise<FSEntry> {
    const store = this.getStore();
    const key = this.key(meta, path);
    const buf = await file.data.arrayBuffer();
    const mime = getMimeType(file.meta.type || path);

    await store.putBlob(key, new Blob([buf], { type: mime }));

    if (meta.response && !Array.isArray(meta.response)) {
      meta.response.url = this.url(key);
      meta.response.size = file.meta.size || buf.byteLength;
    }

    if (meta.rollback) {
      meta.rollback.add(async () => {
        await store.deleteBlob(key);
      });
    }

    throw IRPCAdapter.next();
  }

  async update(meta: FSMeta, path: string, entry: FSPayload, file?: IRPCFile): Promise<FSEntry> {
    if (!file) throw IRPCAdapter.next();

    const store = this.getStore();
    const key = this.key(meta, path);

    // Fetch existing blob to safely restore it if the chain rolls back
    const existingBlob = await store.getBlob(key);

    const buf = await file.data.arrayBuffer();
    const mime = getMimeType(file.meta.type || path);

    await store.putBlob(key, new Blob([buf], { type: mime }));

    // Inject blob metadata into the update payload so the meta driver sees it
    entry.url = this.url(key);
    entry.size = file.meta?.size || buf.byteLength;
    if (file.meta?.type) entry.type = file.meta.type;

    if (meta.rollback) {
      meta.rollback.add(async () => {
        if (existingBlob) {
          await store.putBlob(key, existingBlob);
        } else {
          await store.deleteBlob(key);
        }
      });
    }

    throw IRPCAdapter.next();
  }

  async remove(meta: FSMeta, path: string): Promise<boolean> {
    const store = this.getStore();
    const key = this.key(meta, path);
    await store.deleteBlob(key);
    throw IRPCAdapter.next();
  }

  async copy(meta: FSMeta, from: string, to: string, dstMeta?: FSMeta): Promise<FSEntry> {
    const store = this.getStore();
    const srcKey = this.key(meta, from);
    const dst = dstMeta || meta;
    const dstKey = this.key(dst, to);

    const blob = await store.getBlob(srcKey);
    if (blob) {
      await store.putBlob(dstKey, blob);
      if (dst.rollback) {
        dst.rollback.add(async () => {
          await store.deleteBlob(dstKey);
        });
      }
    }
    throw IRPCAdapter.next();
  }

  async move(meta: FSMeta, from: string, to: string, dstMeta?: FSMeta): Promise<FSEntry> {
    const store = this.getStore();
    const srcKey = this.key(meta, from);
    const dst = dstMeta || meta;
    const dstKey = this.key(dst, to);

    const blob = await store.getBlob(srcKey);
    if (blob) {
      await store.putBlob(dstKey, blob);
      await store.deleteBlob(srcKey);
      if (dst.rollback) {
        dst.rollback.add(async () => {
          // Hard to rollback move perfectly without caching the old one, but we do best effort
          await store.deleteBlob(dstKey);
          await store.putBlob(srcKey, blob);
        });
      }
    }
    throw IRPCAdapter.next();
  }
}
