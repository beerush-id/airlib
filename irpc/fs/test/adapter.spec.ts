import { withIsolation } from '@anchorlib/core';
import { IRPCFile } from '@irpclib/irpc';
import { describe, expect, it, vi } from 'vitest';
import { FSAdapter, type FSDriver, NextGenerator } from '../src/adapter.js';
import { adapter } from '../src/constructor.js';
import { FS_CONFIG, setFSConfig } from '../src/context.js';
import type { FSFile, FSMeta } from '../src/index.js';
import { fileSchema, fs, fsModule } from '../src/index.js';
import type { AnyType } from '../src/types.js';

const emptyFile: () => FSFile = () => ({
  path: '',
  url: '',
  size: 0,
  type: '',
  isDirectory: false,
  createdAt: 0,
  updatedAt: 0,
});

describe('File System Adapter', () => {
  it('instantiates correctly as an IRPCAdapter', () => {
    const customAdapter = new FSAdapter(fsModule);
    expect(customAdapter).toBeInstanceOf(FSAdapter);
  });

  const mockMeta = {
    prefix: '/raw',
    thumbnailPrefix: '/thb',
  } as FSMeta;

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

    expect(mockDriver.write).toHaveBeenCalledWith(mockMeta, '/test.txt', file, undefined);
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

  it('dispatches mkdir operations to the driver', async () => {
    const mockDriver = {
      mkdir: vi.fn().mockResolvedValue({ path: '/new_dir', type: 'text/plain' }),
    } as unknown as FSDriver;
    const customAdapter = new FSAdapter(fsModule);
    customAdapter.use(mockDriver);

    const result = await customAdapter.mkdir(mockMeta, '/new_dir');
    expect(mockDriver.mkdir).toHaveBeenCalledWith(mockMeta, '/new_dir/');
    expect(result.path).toBe('/new_dir');
    expect(result.type).toBe('txt'); // normalizeType applied
  });

  it('dispatches stat operations to the driver', async () => {
    const mockDriver = {
      stat: vi.fn().mockResolvedValue({ path: '/file.txt', type: 'text/plain' }),
    } as unknown as FSDriver;
    const customAdapter = new FSAdapter(fsModule);
    customAdapter.use(mockDriver);

    const result = await customAdapter.stat(mockMeta, '/file.txt');
    expect(mockDriver.stat).toHaveBeenCalledWith(mockMeta, '/file.txt');
    expect(result.path).toBe('/file.txt');
    expect(result.type).toBe('txt'); // normalizeType applied
  });

  it('dispatches move operations to the driver with source and destination resolved', async () => {
    const mockDriver = {
      move: vi.fn().mockResolvedValue({ path: '/dest.txt', type: 'text/plain' }),
    } as unknown as FSDriver;
    const customAdapter = new FSAdapter(fsModule);
    customAdapter.use(mockDriver);

    const result = await customAdapter.move(mockMeta, '/src.txt', '/dest.txt');
    expect(mockDriver.move).toHaveBeenCalledWith(mockMeta, '/src.txt', '/dest.txt', mockMeta);
    expect(result.path).toBe('/dest.txt');
    expect(result.type).toBe('txt');
  });

  it('dispatches copy operations to the driver with source and destination resolved', async () => {
    const mockDriver = {
      copy: vi.fn().mockResolvedValue({ path: '/dest.txt', type: 'text/plain' }),
    } as unknown as FSDriver;
    const customAdapter = new FSAdapter(fsModule);
    customAdapter.use(mockDriver);

    const result = await customAdapter.copy(mockMeta, '/src.txt', '/dest.txt');
    expect(mockDriver.copy).toHaveBeenCalledWith(mockMeta, '/src.txt', '/dest.txt', mockMeta);
    expect(result.path).toBe('/dest.txt');
    expect(result.type).toBe('txt');
  });

  it('dispatches exists operations to the driver', async () => {
    const mockDriver = {
      exists: vi.fn().mockResolvedValue(true),
    } as unknown as FSDriver;
    const customAdapter = new FSAdapter(fsModule);
    customAdapter.use(mockDriver);

    const result = await customAdapter.exists(mockMeta, '/test.txt');
    expect(mockDriver.exists).toHaveBeenCalledWith(mockMeta, '/test.txt');
    expect(result).toBe(true);
  });
});

describe('Thumbnail Generation', () => {
  const mockMeta = { prefix: '/raw', thumbnailPrefix: '/thb' } as FSMeta;

  it('registers and executes thumbnail generators during write when thumbnailPrefix is present', async () => {
    const mockDriver = { write: vi.fn().mockResolvedValue({ path: '/test.txt' }) } as unknown as FSDriver;
    const customAdapter = new FSAdapter(fsModule);
    customAdapter.use(mockDriver);

    const generatedThumb = new IRPCFile({ name: 'thumb.jpg', size: 10, type: 'image/jpeg' } as AnyType, new Blob([]));
    const gen = vi.fn().mockResolvedValue(generatedThumb);
    customAdapter.useThumbnail(gen);

    const file = new IRPCFile({ name: 'test.jpg', size: 100, type: 'image/jpeg' } as AnyType, new Blob([]));
    await customAdapter.write(mockMeta, '/test.jpg', file);

    expect(gen).toHaveBeenCalledWith(file);
    expect(mockDriver.write).toHaveBeenCalledWith(mockMeta, '/test.jpg', file, generatedThumb);
    expect(generatedThumb.meta.type).toBe('jpg'); // normalizeType is applied
  });

  it('carries over the original file type to the generated thumbnail if missing', async () => {
    const mockDriver = { write: vi.fn().mockResolvedValue({ path: '/test.txt' }) } as unknown as FSDriver;
    const customAdapter = new FSAdapter(fsModule);
    customAdapter.use(mockDriver);

    // Generated thumb has no type explicitly set
    const generatedThumb = new IRPCFile({ name: 'thumb.jpg', size: 10 } as AnyType, new Blob([]));
    const gen = vi.fn().mockResolvedValue(generatedThumb);
    customAdapter.useThumbnail(gen);

    const file = new IRPCFile({ name: 'test.jpg', size: 100, type: 'jpg' } as AnyType, new Blob([]));
    await customAdapter.write(mockMeta, '/test.jpg', file);

    expect(generatedThumb.meta.type).toBe('jpg');
  });

  it('throws FSError if a generator returns a non-IRPCFile object', async () => {
    const mockDriver = { write: vi.fn() } as unknown as FSDriver;
    const customAdapter = new FSAdapter(fsModule);
    customAdapter.use(mockDriver);

    const gen = vi.fn().mockResolvedValue({ not: 'an IRPCFile' });
    customAdapter.useThumbnail(gen);

    const file = new IRPCFile({ name: 'test.txt', size: 10, type: 'txt' } as AnyType, new Blob([]));
    await expect(customAdapter.write(mockMeta, '/test.txt', file)).rejects.toThrowError(/failed/i);
  });

  it('skips generators that throw NextGenerator and proceeds to the next one', async () => {
    const mockDriver = { write: vi.fn().mockResolvedValue({ path: '/test.txt' }) } as unknown as FSDriver;
    const customAdapter = new FSAdapter(fsModule);
    customAdapter.use(mockDriver);

    const gen1 = vi.fn().mockRejectedValue(new NextGenerator());
    const generatedThumb = new IRPCFile({ name: 'thumb.jpg', size: 10, type: 'jpg' } as AnyType, new Blob([]));
    const gen2 = vi.fn().mockResolvedValue(generatedThumb);

    customAdapter.useThumbnail(gen1).useThumbnail(gen2);

    const file = new IRPCFile({ name: 'test.jpg', size: 100, type: 'jpg' } as AnyType, new Blob([]));
    await customAdapter.write(mockMeta, '/test.jpg', file);

    expect(gen1).toHaveBeenCalled();
    expect(gen2).toHaveBeenCalled();
    expect(mockDriver.write).toHaveBeenCalledWith(mockMeta, '/test.jpg', file, generatedThumb);
  });

  it('throws immediately if a generator throws a standard error', async () => {
    const mockDriver = { write: vi.fn() } as unknown as FSDriver;
    const customAdapter = new FSAdapter(fsModule);
    customAdapter.use(mockDriver);

    const gen = vi.fn().mockRejectedValue(new Error('Fatal Image Error'));
    customAdapter.useThumbnail(gen);

    const file = new IRPCFile({ name: 'test.jpg', size: 100, type: 'jpg' } as AnyType, new Blob([]));
    await expect(customAdapter.write(mockMeta, '/test.jpg', file)).rejects.toThrowError(/Fatal Image Error/);
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
    expect(readReader.state.data).toEqual(emptyFile());

    const writeReader = fs.write.later();
    expect(writeReader.state.data).toEqual(emptyFile());

    const removeReader = fs.remove.later();
    expect(removeReader.state.data).toBe(false);

    const rmdirReader = fs.rmdir.later();
    expect(rmdirReader.state.data).toBe(false);

    const dirReader = fs.dir.later();
    expect(dirReader.state.data).toEqual([]);
  });
});

describe('Config Enforcement', () => {
  const customAdapter = new FSAdapter(fsModule);
  const mockMeta = {
    prefix: '/raw',
    thumbnailPrefix: '/thb',
  } as FSMeta;
  const mockDriver = {
    read: vi.fn().mockImplementation(async (_meta, path) => ({
      path,
      url: `https://driver${path}`,
      size: 10,
      type: 'txt',
    })),
    write: vi.fn().mockImplementation(async (_meta, path, file) => ({
      path,
      url: `https://driver${path}`,
      size: file.meta.size,
      type: file.meta.type,
    })),
    remove: vi.fn().mockResolvedValue(true),
    rmdir: vi.fn().mockResolvedValue(true),
    dir: vi.fn().mockImplementation(async (_meta, path) => [
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
      const mockMeta = {
        prefix: '/uploads/raw',
        thumbnailPrefix: '/uploads/thb',
      } as FSMeta;
      const file = await customAdapter.read(mockMeta, '/test.txt');
      expect(mockDriver.read).toHaveBeenCalledWith(mockMeta, '/test.txt');
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
      await expect(customAdapter.remove(mockMeta, '/test.txt')).rejects.toThrowError(/not permitted/i);
    });
  });

  it('enforces readOnly on rmdir', async () => {
    await withIsolation(async () => {
      setFSConfig({ readOnly: true });
      await expect(customAdapter.rmdir(mockMeta, '/test')).rejects.toThrowError(/not permitted/i);
    });
  });

  it('enforces readOnly on write', async () => {
    await withIsolation(async () => {
      setFSConfig({ readOnly: true });
      const file = new IRPCFile({ name: 'a.txt', size: 1, type: 'txt' }, new Blob([]));
      await expect(customAdapter.write(mockMeta, '/test.txt', file)).rejects.toThrowError(/not permitted/i);
    });
  });

  it('enforces maxFileSize on write', async () => {
    await withIsolation(async () => {
      setFSConfig({ maxFileSize: 5 });
      const file = new IRPCFile({ name: 'a.txt', size: 10, type: 'txt' }, new Blob([]));
      await expect(customAdapter.write(mockMeta, '/test.txt', file)).rejects.toThrowError(/too large/i);
    });
  });

  it('enforces allowedTypes on write', async () => {
    await withIsolation(async () => {
      setFSConfig({ allowedTypes: ['png'] });
      const file = new IRPCFile({ name: 'a.txt', size: 10, type: 'txt' }, new Blob([]));
      await expect(customAdapter.write(mockMeta, '/test.txt', file)).rejects.toThrowError(/not permitted/i);
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
