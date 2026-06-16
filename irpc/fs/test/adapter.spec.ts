import { withIsolation } from '@anchorlib/core';
import { IRPCFile, type IRPCMeta } from '@irpclib/irpc';
import { describe, expect, it, vi } from 'vitest';
import { FSAdapter, type FSDriver } from '../src/adapter.js';
import { adapter } from '../src/constructor.js';
import { FS_CONFIG, setFSConfig } from '../src/context.js';
import { fileSchema, fs, fsModule } from '../src/index.js';

describe('File System Adapter', () => {
  it('instantiates correctly as an IRPCAdapter', () => {
    const customAdapter = new FSAdapter(fsModule);
    expect(customAdapter).toBeInstanceOf(FSAdapter);
  });
  const mockMeta = {} as IRPCMeta;

  it('dispatches read operations to the driver', async () => {
    const mockDriver = {
      read: vi.fn().mockResolvedValue({ path: '/test.txt' }),
    } as unknown as FSDriver;

    const customAdapter = new FSAdapter(fsModule);
    customAdapter.use(mockDriver);

    const result = await customAdapter.read(mockMeta, '/test.txt');
    expect(mockDriver.read).toHaveBeenCalledWith(mockMeta, '/test.txt');
    expect(result.path).toBe('/test.txt');
  });

  it('dispatches write operations to the driver', async () => {
    const mockDriver = {
      write: vi.fn().mockResolvedValue({ path: '/test.txt', size: 10 }),
    } as unknown as FSDriver;

    const customAdapter = new FSAdapter(fsModule);
    customAdapter.use(mockDriver);

    const file = new IRPCFile({ name: 'test.txt', size: 10, type: 'txt' }, new Blob([new ArrayBuffer(10)]));
    const result = await customAdapter.write(mockMeta, '/test.txt', file);

    expect(mockDriver.write).toHaveBeenCalledWith(mockMeta, '/test.txt', file);
    expect(result.size).toBe(10);
  });

  it('dispatches remove operations to the driver', async () => {
    const mockDriver = {
      remove: vi.fn().mockResolvedValue(true),
    } as unknown as FSDriver;
    const customAdapter = new FSAdapter(fsModule);
    customAdapter.use(mockDriver);

    const result = await customAdapter.remove(mockMeta, '/test.txt');
    expect(mockDriver.remove).toHaveBeenCalledWith(mockMeta, '/test.txt');
    expect(result).toBe(true);
  });

  it('dispatches rmdir operations to the driver', async () => {
    const mockDriver = {
      rmdir: vi.fn().mockResolvedValue(true),
    } as unknown as FSDriver;
    const customAdapter = new FSAdapter(fsModule);
    customAdapter.use(mockDriver);

    const result = await customAdapter.rmdir(mockMeta, '/dir/', true);
    expect(mockDriver.rmdir).toHaveBeenCalledWith(mockMeta, '/dir/', true);
    expect(result).toBe(true);
  });

  it('dispatches dir operations to the driver', async () => {
    const mockDriver = {
      dir: vi.fn().mockResolvedValue([]),
    } as unknown as FSDriver;
    const customAdapter = new FSAdapter(fsModule);
    customAdapter.use(mockDriver);

    const result = await customAdapter.dir(mockMeta, '/dir/');
    expect(mockDriver.dir).toHaveBeenCalledWith(mockMeta, '/dir/');
    expect(result).toEqual([]);
  });

  it('delegates dir operation without path', async () => {
    const mockDriver = {
      dir: vi.fn().mockResolvedValue([]),
    } as unknown as FSDriver;
    const customAdapter = new FSAdapter(fsModule);
    customAdapter.use(mockDriver);

    const result = await customAdapter.dir(mockMeta);
    expect(mockDriver.dir).toHaveBeenCalledWith(mockMeta, '/');
    expect(result).toEqual([]);
  });
});

describe('FS_CONFIG Context Symbol', () => {
  it('is a symbol', () => {
    expect(typeof FS_CONFIG).toBe('symbol');
  });
});

describe('fileSchema', () => {
  it('validates IRPCFile instances', () => {
    const file = new IRPCFile({ name: 'file.txt', type: 'txt', size: 0 }, new Blob([]));
    expect(fileSchema.parse(file)).toBe(file);
  });

  it('rejects non-IRPCFile objects', () => {
    expect(() => fileSchema.parse({})).toThrowError(/Must be an IRPCFile/);
  });
});

describe('Default Adapter Constructor', () => {
  it('exports a pre-configured singleton adapter attached to the fs stubs', () => {
    expect(adapter).toBeInstanceOf(FSAdapter);
  });
});

describe('fs stubs seeds', () => {
  it('evaluates seed functions correctly', () => {
    const readReader = fs.read.later();
    expect(readReader.state.data).toEqual({ path: '', url: '', size: 0, type: '' });

    const writeReader = fs.write.later();
    expect(writeReader.state.data).toEqual({ path: '', url: '', size: 0, type: '' });

    const removeReader = fs.remove.later();
    expect(removeReader.state.data).toBe(false);

    const rmdirReader = fs.rmdir.later();
    expect(rmdirReader.state.data).toBe(false);

    const dirReader = fs.dir.later();
    expect(dirReader.state.data).toEqual([]);
  });
});

describe('FSConfig Enforcement', () => {
  const customAdapter = new FSAdapter(fsModule);
  const mockMeta = {} as IRPCMeta;
  const mockDriver = {
    read: vi.fn().mockImplementation(async (meta, path) => ({
      path,
      url: `https://driver${path}`,
      size: 10,
      type: 'txt',
    })),
    write: vi.fn().mockImplementation(async (meta, path, file) => ({
      path,
      url: `https://driver${path}`,
      size: file.meta.size,
      type: file.meta.type,
    })),
    remove: vi.fn().mockResolvedValue(true),
    rmdir: vi.fn().mockResolvedValue(true),
    dir: vi.fn().mockImplementation(async (meta, path) => [
      {
        path: `${path === '/' ? '' : path}/test.txt`,
        size: 10,
        type: 'txt',
      },
    ]),
  } as unknown as FSDriver;

  customAdapter.use(mockDriver);

  it('enforces rootPath resolution and stripping', async () => {
    await withIsolation(async () => {
      setFSConfig({ rootPath: '/uploads' });
      const file = await customAdapter.read(mockMeta, '/test.txt');
      expect(mockDriver.read).toHaveBeenCalledWith(mockMeta, '/uploads/test.txt');
      expect(file.path).toBe('/test.txt'); // Stripped back for consumer
    });
  });

  it('strips exact rootPath down to root slash', async () => {
    await withIsolation(async () => {
      setFSConfig({ rootPath: '/uploads' });
      const files = await customAdapter.dir(mockMeta);
      expect(files[0].path).toBe('/test.txt');
    });
  });

  it('strips root directory path itself down to root slash', async () => {
    await withIsolation(async () => {
      setFSConfig({ rootPath: '/uploads' });
      const file = await customAdapter.read(mockMeta, '/');
      expect(file.path).toBe('/');
    });
  });

  it('enforces readOnly on remove', async () => {
    await withIsolation(async () => {
      setFSConfig({ readOnly: true });
      await expect(customAdapter.remove(mockMeta, '/test.txt')).rejects.toThrowError(/read-only filesystem/);
    });
  });

  it('enforces readOnly on rmdir', async () => {
    await withIsolation(async () => {
      setFSConfig({ readOnly: true });
      await expect(customAdapter.rmdir(mockMeta, '/test')).rejects.toThrowError(/read-only filesystem/);
    });
  });

  it('enforces readOnly on write', async () => {
    await withIsolation(async () => {
      setFSConfig({ readOnly: true });
      const file = new IRPCFile({ name: 'a.txt', size: 1, type: 'txt' }, new Blob([]));
      await expect(customAdapter.write(mockMeta, '/test.txt', file)).rejects.toThrowError(/read-only filesystem/);
    });
  });

  it('enforces maxFileSize on write', async () => {
    await withIsolation(async () => {
      setFSConfig({ maxFileSize: 5 });
      const file = new IRPCFile({ name: 'a.txt', size: 10, type: 'txt' }, new Blob([]));
      await expect(customAdapter.write(mockMeta, '/test.txt', file)).rejects.toThrowError(/file too large/);
    });
  });

  it('enforces allowedTypes on write', async () => {
    await withIsolation(async () => {
      setFSConfig({ allowedTypes: ['png'] });
      const file = new IRPCFile({ name: 'a.txt', size: 10, type: 'txt' }, new Blob([]));
      await expect(customAdapter.write(mockMeta, '/test.txt', file)).rejects.toThrowError(
        /file type txt is not allowed/
      );
    });
  });

  it('allows write when type is allowed', async () => {
    await withIsolation(async () => {
      setFSConfig({ allowedTypes: ['png'] });
      const file = new IRPCFile({ name: 'a.png', size: 10, type: 'png' }, new Blob([]));
      const res = await customAdapter.write(mockMeta, '/a.png', file);
      expect(res.path).toBe('/a.png');
    });
  });
});
