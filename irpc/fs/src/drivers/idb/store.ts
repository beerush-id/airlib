export interface MetaEntry {
  path: string;
  size: number;
  type: string;
  mime: string;
  isDirectory: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface IDBStoreOptions {
  dbName?: string;
  metaStore?: string;
  blobStore?: string;
}

export class IDBStore {
  readonly dbName: string;
  readonly metaStoreName: string;
  readonly blobStoreName: string;
  private db?: Promise<IDBDatabase>;

  constructor(options?: IDBStoreOptions) {
    this.dbName = options?.dbName || 'irpc-fs';
    this.metaStoreName = options?.metaStore || 'meta';
    this.blobStoreName = options?.blobStore || 'blobs';
  }

  private getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    if (typeof indexedDB === 'undefined') {
      return Promise.reject(new Error('IndexedDB not available'));
    }

    this.db = new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(this.dbName, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(this.metaStoreName)) {
          db.createObjectStore(this.metaStoreName, { keyPath: 'path' });
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

  async getMeta(key: string): Promise<MetaEntry | null> {
    return this.tx<MetaEntry | null>(
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

  async putMeta(key: string, entry: MetaEntry): Promise<void> {
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

  async listMeta(prefix: string): Promise<MetaEntry[]> {
    return this.tx<MetaEntry[]>(
      this.metaStoreName,
      'readonly',
      (store) =>
        new Promise((resolve, reject) => {
          const results: MetaEntry[] = [];
          const range = IDBKeyRange.bound(prefix, `${prefix}\uffff`);
          const req = store.openCursor(range);
          req.onsuccess = () => {
            const cursor = req.result;
            if (cursor) {
              const key = cursor.key as string;
              if (key.startsWith(prefix)) {
                results.push(cursor.value as MetaEntry);
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
