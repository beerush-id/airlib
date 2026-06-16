import { IRPCFile } from '@irpclib/irpc';
import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IDBFSDriver } from '../../../src/drivers/idb/index.js';

describe('IDB File System Driver', () => {
  const mockMeta: any = {};
  let driver: IDBFSDriver;

  let dbCount = 0;

  beforeEach(async () => {
    const dbName = `test-db-${dbCount++}`;
    driver = new IDBFSDriver({ dbName, storeName: 'test-store' });
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
  });

  afterEach(async () => {
    vi.restoreAllMocks();
  });

  it('handles indexedDB init failure', async () => {
    const originalOpen = indexedDB.open;
    indexedDB.open = () => {
      throw new Error('mock error');
    };
    try {
      await expect(driver.read(mockMeta, 'missing.txt')).rejects.toThrowError(/Failed to initialize storage/);
    } finally {
      indexedDB.open = originalOpen;
    }
  });

  describe('read', () => {
    it('throws notFound if file does not exist', async () => {
      await expect(driver.read(mockMeta, 'missing.txt')).rejects.toThrowError(/no such file or directory/);
    });

    it('throws notPermitted if target is a directory', async () => {
      await driver.write(mockMeta, 'a/test.txt', new IRPCFile({ name: 'test.txt' } as any, new Blob(['1'])));
      await expect(driver.read(mockMeta, 'a')).rejects.toThrowError(/not permitted.*is a directory/);
    });

    it('returns valid FSFile for existing file', async () => {
      await driver.write(
        mockMeta,
        'test.txt',
        new IRPCFile({ name: 'test.txt', size: 11, type: 'txt' } as any, new Blob(['hello world']))
      );
      const file = await driver.read(mockMeta, 'test.txt');

      expect(file.path).toBe('/test.txt');
      expect(file.url).toBe('blob:test');
      expect(file.size).toBe(11);
      expect(file.type).toBe('txt');
      expect(file.isDirectory).toBe(false);
    });
  });

  describe('write', () => {
    it('writes buffer and creates parent directories', async () => {
      const irpcFile = new IRPCFile({ name: 'file.txt', size: 8, type: 'txt' } as any, new Blob(['hello fs']));
      const file = await driver.write(mockMeta, 'nested/file.txt', irpcFile);

      expect(file.path).toBe('/nested/file.txt');
      expect(file.url).toBe('blob:test');
      expect(file.size).toBe(8);

      const listed = await driver.dir(mockMeta, 'nested');
      expect(listed.length).toBe(1);
      expect(listed[0].path).toBe('/nested/file.txt');
    });
  });

  describe('remove', () => {
    it('removes an existing file', async () => {
      await driver.write(mockMeta, 'to_remove.txt', new IRPCFile({ name: 'to_remove.txt' } as any, new Blob(['1'])));
      const result = await driver.remove(mockMeta, 'to_remove.txt');
      expect(result).toBe(true);
      await expect(driver.read(mockMeta, 'to_remove.txt')).rejects.toThrowError(/no such file or directory/);
    });

    it('throws notFound if file does not exist', async () => {
      await expect(driver.remove(mockMeta, 'missing.txt')).rejects.toThrowError(/no such file or directory/);
    });
  });

  describe('rmdir', () => {
    it('throws notFound if directory does not exist', async () => {
      await expect(driver.rmdir(mockMeta, 'missing_dir')).rejects.toThrowError(/no such file or directory/);
    });

    it('throws notPermitted if target is a file', async () => {
      await driver.write(mockMeta, 'file.txt', new IRPCFile({ name: 'file.txt' } as any, new Blob(['1'])));
      await expect(driver.rmdir(mockMeta, 'file.txt')).rejects.toThrowError(/not permitted.*not a directory/);
    });

    it('removes an empty directory', async () => {
      await driver.write(mockMeta, 'empty_dir/temp.txt', new IRPCFile({ name: 'temp.txt' } as any, new Blob(['1'])));
      await driver.remove(mockMeta, 'empty_dir/temp.txt'); // directory marker 'empty_dir/' remains

      const result = await driver.rmdir(mockMeta, 'empty_dir');
      expect(result).toBe(true);
      await expect(driver.dir(mockMeta, 'empty_dir')).rejects.toThrowError(/no such file or directory/);
    });

    it('throws notEmpty if directory has files and recursive is false', async () => {
      await driver.write(mockMeta, 'full_dir/file.txt', new IRPCFile({ name: 'file.txt' } as any, new Blob(['1'])));
      await expect(driver.rmdir(mockMeta, 'full_dir')).rejects.toThrowError(/directory not empty/);
    });

    it('removes non-empty directory if recursive is true', async () => {
      await driver.write(mockMeta, 'full_dir/file.txt', new IRPCFile({ name: 'file.txt' } as any, new Blob(['1'])));
      await driver.write(
        mockMeta,
        'full_dir/sub/file2.txt',
        new IRPCFile({ name: 'file2.txt' } as any, new Blob(['2']))
      );

      const result = await driver.rmdir(mockMeta, 'full_dir', true);
      expect(result).toBe(true);
      await expect(driver.dir(mockMeta, 'full_dir')).rejects.toThrowError(/no such file or directory/);
      await expect(driver.read(mockMeta, 'full_dir/file.txt')).rejects.toThrowError(/no such file or directory/);
    });
  });

  describe('dir', () => {
    it('throws notPermitted if target is a file', async () => {
      await driver.write(mockMeta, 'file.txt', new IRPCFile({ name: 'file.txt' } as any, new Blob(['1'])));
      await expect(driver.dir(mockMeta, 'file.txt')).rejects.toThrowError(/not permitted.*not a directory/);
    });

    it('lists directory contents', async () => {
      await driver.write(
        mockMeta,
        'sub_dir/file1.txt',
        new IRPCFile({ name: 'file1.txt', size: 5, type: 'txt' } as any, new Blob(['12345']))
      );
      await driver.write(
        mockMeta,
        'sub_dir/inner/file2.txt',
        new IRPCFile({ name: 'file2.txt' } as any, new Blob(['1']))
      );

      const files = await driver.dir(mockMeta, 'sub_dir');

      expect(files.length).toBe(2);
      expect(files.find((f) => f.isDirectory)?.path).toBe('/sub_dir/inner/');
      expect(files.find((f) => !f.isDirectory)?.path).toBe('/sub_dir/file1.txt');
    });
  });

  describe('coverage cases', () => {
    it('handles missing indexedDB completely', async () => {
      const originalIDB = globalThis.indexedDB;
      Object.defineProperty(globalThis, 'indexedDB', { value: undefined, configurable: true });
      const drv = new IDBFSDriver({ dbName: 'test', storeName: 'test' });
      await expect(drv.read(mockMeta, 'a')).rejects.toThrowError(/Storage not available/);
      Object.defineProperty(globalThis, 'indexedDB', { value: originalIDB, configurable: true });
    });

    it('handles db.transaction error', async () => {
      const originalGetDB = (driver as any).getDB;
      (driver as any).getDB = async () => {
        return {
          transaction: () => {
            throw new Error('transaction error');
          },
        };
      };
      try {
        await expect(driver.read(mockMeta, 'a')).rejects.toThrowError(/Failed: operation failed, read 'a'/);
      } finally {
        (driver as any).getDB = originalGetDB;
      }
    });

    it('throws notFound when reading root', async () => {
      await expect(driver.read(mockMeta, '/')).rejects.toThrowError(/no such file or directory/);
    });

    it('wraps generic errors in read', async () => {
      vi.spyOn(driver as any, 'getRecord').mockRejectedValueOnce(new Error('generic'));
      await expect(driver.read(mockMeta, 'a')).rejects.toThrowError(/Failed: operation failed, read 'a'/);
    });

    it('wraps generic errors in write', async () => {
      vi.spyOn(driver as any, 'ensureParents').mockRejectedValueOnce(new Error('generic'));
      await expect(driver.write(mockMeta, 'a', new IRPCFile({} as any, new Blob()))).rejects.toThrowError(
        /Failed: operation failed, write 'a'/
      );
    });

    it('wraps generic errors in remove', async () => {
      vi.spyOn(driver as any, 'getRecord').mockRejectedValueOnce(new Error('generic'));
      await expect(driver.remove(mockMeta, 'a')).rejects.toThrowError(/Failed: operation failed, remove 'a'/);
    });

    it('handles missing IDBKeyRange in recursive rmdir', async () => {
      await driver.write(mockMeta, 'dir/a', new IRPCFile({} as any, new Blob(['1'])));
      const originalKeyRange = globalThis.IDBKeyRange;
      Object.defineProperty(globalThis, 'IDBKeyRange', { value: undefined, configurable: true });
      try {
        await expect(driver.rmdir(mockMeta, 'dir', true)).rejects.toThrowError(/Failed: operation failed, rmdir 'dir'/);
      } finally {
        Object.defineProperty(globalThis, 'IDBKeyRange', { value: originalKeyRange, configurable: true });
      }
    });

    it('skips non-matching keys in cursor during recursive rmdir', async () => {
      await driver.write(mockMeta, 'dir1/a', new IRPCFile({} as any, new Blob(['1'])));
      await driver.write(mockMeta, 'dir2/b', new IRPCFile({} as any, new Blob(['1'])));

      const res = await driver.rmdir(mockMeta, 'dir1', true);
      expect(res).toBe(true);

      const files = await driver.dir(mockMeta, 'dir2');
      expect(files.length).toBe(1);
    });

    it('wraps generic errors in rmdir', async () => {
      vi.spyOn(driver as any, 'getRecord').mockRejectedValueOnce(new Error('generic'));
      await expect(driver.rmdir(mockMeta, 'a')).rejects.toThrowError(/Failed: operation failed, rmdir 'a'/);
    });

    it('wraps generic errors in dir', async () => {
      vi.spyOn(driver as any, 'getRecord').mockRejectedValueOnce(new Error('generic'));
      await expect(driver.dir(mockMeta, 'a')).rejects.toThrowError(/Failed: operation failed, dir 'a'/);
    });

    it('throws notPermitted when removing a directory', async () => {
      await driver.write(mockMeta, 'dir/a', new IRPCFile({} as any, new Blob(['1'])));
      await expect(driver.remove(mockMeta, 'dir')).rejects.toThrowError(/not permitted.*is a directory/);
    });

    it('handles empty config fallbacks', () => {
      const drv = new IDBFSDriver();
      expect(drv.getOptions()).toEqual({ dbName: 'irpc-fs', storeName: 'files' });
    });

    it('handles writing to root with empty path', async () => {
      const file = new IRPCFile({ name: 'root.txt' } as any, new Blob(['1']));
      const res = await driver.write(mockMeta, '', file);
      expect(res.path).toBe('/'); // normalizePath turns '' into '/'
    });

    it('uses context options over instance options', async () => {
      const { setIDBFSOptions } = await import('../../../src/drivers/idb/context.js');
      setIDBFSOptions({ dbName: 'ctx-db', storeName: 'ctx-store' });
      const drv = new IDBFSDriver({ dbName: 'inst-db', storeName: 'inst-store' });
      expect(drv.getOptions()).toEqual({ dbName: 'ctx-db', storeName: 'ctx-store' });
      setIDBFSOptions(undefined as any);
    });

    it('wraps generic errors in dir for root', async () => {
      vi.spyOn(driver as any, 'withStore').mockRejectedValueOnce(new Error('generic'));
      await expect(driver.dir(mockMeta)).rejects.toThrowError(/Failed: operation failed, dir '\/'/);
    });

    describe('onerror function branches', () => {
      it('handles idb request onerror', async () => {
        const originalOpen = indexedDB.open;
        indexedDB.open = () => {
          const req: any = { error: new Error('init err') };
          setTimeout(() => req.onerror?.(), 5);
          return req;
        };
        const drv = new IDBFSDriver({ dbName: 'err', storeName: 'err' });
        await expect(drv.read(mockMeta, 'a')).rejects.toThrowError(/Failed to initialize storage/);
        indexedDB.open = originalOpen;
      });

      it('handles transaction onerror', async () => {
        const originalTransaction = globalThis.IDBDatabase.prototype.transaction;
        const spy = vi.spyOn(globalThis.IDBDatabase.prototype, 'transaction').mockImplementation(function (
          this: IDBDatabase,
          storeNames,
          mode
        ) {
          const tx = originalTransaction.call(this, storeNames, mode);
          setTimeout(() => {
            Object.defineProperty(tx, 'error', { value: new Error('tx err'), configurable: true });
            tx.onerror?.(new Event('error'));
          }, 5);
          return tx;
        });

        const getSpy = vi
          .spyOn(globalThis.IDBObjectStore.prototype, 'get')
          .mockImplementation(() => ({}) as IDBRequest);
        await expect(driver.read(mockMeta, 'a')).rejects.toThrowError(/Failed: operation failed, read 'a'/);
        spy.mockRestore();
        getSpy.mockRestore();
      });

      it('handles transaction oncomplete', async () => {
        const originalTransaction = globalThis.IDBDatabase.prototype.transaction;
        const spy = vi.spyOn(globalThis.IDBDatabase.prototype, 'transaction').mockImplementation(function (
          this: IDBDatabase,
          storeNames,
          mode
        ) {
          const tx = originalTransaction.call(this, storeNames, mode);
          const originalObjectStore = tx.objectStore.bind(tx);
          tx.objectStore = (name) => {
            const store = originalObjectStore(name);
            const originalGet = store.get.bind(store);
            store.get = (key) => {
              const req = originalGet(key);
              const oldOnSuccess = req.onsuccess;
              Object.defineProperty(req, 'onsuccess', {
                set(fn) {
                  req.addEventListener('success', () => {
                    fn({ target: req } as any);
                    tx.oncomplete?.({} as any);
                  });
                },
              });
              return req;
            };
            return store;
          };
          return tx;
        });

        await driver.write(mockMeta, 'a', new IRPCFile({} as any, new Blob(['1'])));
        await driver.read(mockMeta, 'a');
        spy.mockRestore();
      });

      it('handles store.get onerror', async () => {
        const spy = vi.spyOn(globalThis.IDBObjectStore.prototype, 'get').mockImplementation(() => {
          const req: any = { error: new Error('get err') };
          setTimeout(() => req.onerror?.(), 5);
          return req as IDBRequest;
        });

        await expect(driver.read(mockMeta, 'a')).rejects.toThrowError(/Failed: operation failed, read 'a'/);
        spy.mockRestore();
      });

      it('handles store.get fallback onerror', async () => {
        const originalGet = globalThis.IDBObjectStore.prototype.get;
        const spy = vi.spyOn(globalThis.IDBObjectStore.prototype, 'get').mockImplementation(function (
          this: IDBObjectStore,
          key
        ) {
          if (key === '/a') {
            const req: any = { result: undefined };
            setTimeout(() => req.onsuccess?.(), 5);
            return req;
          } else {
            const req: any = { error: new Error('get2 err') };
            setTimeout(() => req.onerror?.(), 5);
            return req;
          }
        });

        await expect(driver.read(mockMeta, 'a')).rejects.toThrowError(/Failed: operation failed, read 'a'/);
        spy.mockRestore();
      });

      it('handles store.put onerror', async () => {
        const spy = vi.spyOn(globalThis.IDBObjectStore.prototype, 'put').mockImplementation(() => {
          const req: any = { error: new Error('put err') };
          setTimeout(() => req.onerror?.(), 5);
          return req as IDBRequest;
        });

        await expect(driver.write(mockMeta, 'a', new IRPCFile({} as any, new Blob()))).rejects.toThrowError(
          /Failed: operation failed, write 'a'/
        );
        spy.mockRestore();
      });

      it('handles store.delete onerror', async () => {
        await driver.write(mockMeta, 'a', new IRPCFile({} as any, new Blob(['1'])));

        const spy = vi.spyOn(globalThis.IDBObjectStore.prototype, 'delete').mockImplementation(() => {
          const req: any = { error: new Error('del err') };
          setTimeout(() => req.onerror?.(), 5);
          return req as IDBRequest;
        });

        await expect(driver.remove(mockMeta, 'a')).rejects.toThrowError(/Failed: operation failed, remove 'a'/);
        spy.mockRestore();
      });

      it('handles idx.getAll onerror', async () => {
        const spy = vi.spyOn(globalThis.IDBIndex.prototype, 'getAll').mockImplementation(() => {
          const req: any = { error: new Error('getall err') };
          setTimeout(() => req.onerror?.(), 5);
          return req as IDBRequest;
        });

        await expect(driver.dir(mockMeta, '/')).rejects.toThrowError(/Failed: operation failed, dir '\/'/);
        spy.mockRestore();
      });

      it('handles openCursor onerror', async () => {
        await driver.write(mockMeta, 'dir/a', new IRPCFile({} as any, new Blob(['1'])));
        const spy = vi.spyOn(globalThis.IDBObjectStore.prototype, 'openCursor').mockImplementation(() => {
          const req: any = { error: new Error('cursor err') };
          setTimeout(() => req.onerror?.(), 5);
          return req as IDBRequest;
        });

        await expect(driver.rmdir(mockMeta, 'dir', true)).rejects.toThrowError(/Failed: operation failed, rmdir 'dir'/);
        spy.mockRestore();
      });
      it('handles ensureParents put onerror', async () => {
        const spy = vi.spyOn(globalThis.IDBObjectStore.prototype, 'put').mockImplementation(() => {
          const req: any = { error: new Error('ensure put err') };
          setTimeout(() => req.onerror?.(), 5);
          return req as IDBRequest;
        });

        await expect(driver.write(mockMeta, 'a/b', new IRPCFile({} as any, new Blob()))).rejects.toThrowError(
          /Failed: operation failed, write 'a\/b'/
        );
        spy.mockRestore();
      });

      it('handles rmdir delete onerror', async () => {
        await driver.write(mockMeta, 'a/b', new IRPCFile({} as any, new Blob(['1'])));
        await driver.remove(mockMeta, 'a/b'); // Creates an empty directory 'a'

        const spy = vi.spyOn(globalThis.IDBObjectStore.prototype, 'delete').mockImplementation(() => {
          const req: any = { error: new Error('rmdir del err') };
          setTimeout(() => req.onerror?.(), 5);
          return req as IDBRequest;
        });

        await expect(driver.rmdir(mockMeta, 'a')).rejects.toThrowError(/Failed: operation failed, rmdir 'a'/);
        spy.mockRestore();
      });

      it('handles rmdir idx.getAll onerror', async () => {
        await driver.write(mockMeta, 'a/b', new IRPCFile({} as any, new Blob(['1'])));

        const spy = vi.spyOn(globalThis.IDBIndex.prototype, 'getAll').mockImplementation(() => {
          const req: any = { error: new Error('rmdir getall err') };
          setTimeout(() => req.onerror?.(), 5);
          return req as IDBRequest;
        });

        await expect(driver.rmdir(mockMeta, 'a')).rejects.toThrowError(/Failed: operation failed, rmdir 'a'/);
        spy.mockRestore();
      });
    });
  });
});
