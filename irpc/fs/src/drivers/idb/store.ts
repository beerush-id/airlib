import type { FSEntry } from '../../index.js';

export interface IDBStoreOptions {
  dbName?: string;
  metaStore?: string;
  blobStore?: string;
  version?: number;
}

export class IDBStore {
  readonly dbName: string;
  readonly metaStoreName: string;
  readonly blobStoreName: string;
  readonly version: number;
  private db?: Promise<IDBDatabase>;

  constructor(options?: IDBStoreOptions) {
    this.dbName = options?.dbName || 'irpc-fs';
    this.metaStoreName = options?.metaStore || 'meta';
    this.blobStoreName = options?.blobStore || 'blobs';
    this.version = options?.version || 2;
  }

  private getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    if (typeof indexedDB === 'undefined') {
      return Promise.reject(new Error('IndexedDB not available'));
    }

    this.db = new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(this.dbName, this.version);
      req.onupgradeneeded = (e) => {
        const db = req.result;
        if (!db.objectStoreNames.contains(this.metaStoreName)) {
          const store = db.createObjectStore(this.metaStoreName, { keyPath: 'path' });
          store.createIndex('userId', 'userId', { unique: false });
          store.createIndex('organizationId', 'organizationId', { unique: false });
          store.createIndex('projectId', 'projectId', { unique: false });
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('hash', 'hash', { unique: false });
          store.createIndex('sourcePath', 'sourcePath', { unique: false });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('isDirectory', 'isDirectory', { unique: false });
        } else {
          // If the store exists but we're upgrading, ensure new indices exist
          const tx = req.transaction;
          if (tx) {
            const store = tx.objectStore(this.metaStoreName);
            if (!store.indexNames.contains('userId')) store.createIndex('userId', 'userId', { unique: false });
            if (!store.indexNames.contains('organizationId'))
              store.createIndex('organizationId', 'organizationId', { unique: false });
            if (!store.indexNames.contains('projectId')) store.createIndex('projectId', 'projectId', { unique: false });
            if (!store.indexNames.contains('category')) store.createIndex('category', 'category', { unique: false });
            if (!store.indexNames.contains('status')) store.createIndex('status', 'status', { unique: false });
            if (!store.indexNames.contains('hash')) store.createIndex('hash', 'hash', { unique: false });
            if (!store.indexNames.contains('sourcePath'))
              store.createIndex('sourcePath', 'sourcePath', { unique: false });
          }
        }
        if (!db.objectStoreNames.contains(this.blobStoreName)) {
          db.createObjectStore(this.blobStoreName);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    return this.db;
  }

  private async tx<T>(
    storeName: string,
    mode: IDBTransactionMode,
    fn: (store: IDBObjectStore) => Promise<T>
  ): Promise<T> {
    return this.getDB().then(
      (db) =>
        new Promise<T>((resolve, reject) => {
          const tx = db.transaction(storeName, mode);
          const store = tx.objectStore(storeName);
          const result = fn(store);
          tx.oncomplete = () => result.then(resolve, reject);
          tx.onerror = () => reject(tx.error);
        })
    );
  }

  async getMeta(key: string): Promise<FSEntry | null> {
    return this.tx<FSEntry | null>(
      this.metaStoreName,
      'readonly',
      (store) =>
        new Promise((resolve, reject) => {
          const req = store.get(key);
          req.onsuccess = () => resolve(req.result ?? null);
          req.onerror = () => reject(req.error);
        })
    );
  }

  async putMeta(key: string, entry: FSEntry): Promise<void> {
    return this.tx<void>(
      this.metaStoreName,
      'readwrite',
      (store) =>
        new Promise((resolve, reject) => {
          const req = store.put({ ...entry, path: key });
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        })
    );
  }

  async deleteMeta(key: string): Promise<void> {
    return this.tx<void>(
      this.metaStoreName,
      'readwrite',
      (store) =>
        new Promise((resolve, reject) => {
          const req = store.delete(key);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        })
    );
  }

  async listMeta(prefix: string): Promise<FSEntry[]> {
    return this.tx<FSEntry[]>(
      this.metaStoreName,
      'readonly',
      (store) =>
        new Promise((resolve, reject) => {
          const results: FSEntry[] = [];
          const range = IDBKeyRange.bound(prefix, `${prefix}\uffff`);
          const req = store.openCursor(range);
          req.onsuccess = () => {
            const cursor = req.result;
            if (cursor) {
              const key = cursor.key as string;
              if (key.startsWith(prefix)) {
                results.push(cursor.value as FSEntry);
              }
              cursor.continue();
            } else {
              resolve(results);
            }
          };
          req.onerror = () => reject(req.error);
        })
    );
  }

  async getBlob(key: string): Promise<Blob | null> {
    return this.tx<Blob | null>(
      this.blobStoreName,
      'readonly',
      (store) =>
        new Promise((resolve, reject) => {
          const req = store.get(key);
          req.onsuccess = () => resolve(req.result ?? null);
          req.onerror = () => reject(req.error);
        })
    );
  }

  async putBlob(key: string, blob: Blob): Promise<void> {
    return this.tx<void>(
      this.blobStoreName,
      'readwrite',
      (store) =>
        new Promise((resolve, reject) => {
          const req = store.put(blob, key);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        })
    );
  }

  async deleteBlob(key: string): Promise<void> {
    return this.tx<void>(
      this.blobStoreName,
      'readwrite',
      (store) =>
        new Promise((resolve, reject) => {
          const req = store.delete(key);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        })
    );
  }

  async deleteAll(prefix: string): Promise<void> {
    const p = prefix.endsWith('/') ? prefix : `${prefix}/`;
    const metas = await this.listMeta(p);
    await Promise.all(metas.map((m) => Promise.all([this.deleteMeta(m.path), this.deleteBlob(m.path)])));
    await Promise.all([this.deleteMeta(prefix), this.deleteBlob(prefix)]);
  }
}
