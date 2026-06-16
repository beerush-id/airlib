import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { IRPCFile } from '@irpclib/irpc';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LocalFSDriver } from '../../../src/drivers/local/index.js';
import { setLocalFSOptions } from '../../../src/drivers/local/context.js';
import { FSError } from '../../../src/error.js';

describe('Local File System Driver', () => {
  const tmpDir = path.join(os.tmpdir(), 'irpc-fs-test-' + Date.now());
  const publicUrl = 'http://localhost:3000/assets';

  const mockMeta: any = {};

  let driver: LocalFSDriver;

  beforeEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
    await fs.mkdir(tmpDir, { recursive: true });
    driver = new LocalFSDriver({ baseDir: tmpDir, publicUrl });
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('throws initialization error if publicUrl or baseDir is missing', () => {
    const badDriver = new LocalFSDriver();
    expect(() => badDriver.getOptions()).toThrowError(/File system not available/);
  });

  it('resolves local paths correctly and prevents traversal', async () => {
    await expect(driver.read(mockMeta, '../../etc/passwd')).rejects.toThrowError(/permission denied/);
  });

  describe('read', () => {
    it('throws notFound if file does not exist', async () => {
      await expect(driver.read(mockMeta, 'missing.txt')).rejects.toThrowError(/no such file or directory/);
    });

    it('throws notPermitted if target is a directory', async () => {
      await expect(driver.read(mockMeta, '')).rejects.toThrowError(/not permitted.*is a directory/);
    });

    it('returns valid FSFile for existing file', async () => {
      await fs.writeFile(path.join(tmpDir, 'test.txt'), 'hello world');
      const file = await driver.read(mockMeta, 'test.txt');

      expect(file.path).toBe('test.txt');
      expect(file.url).toBe('http://localhost:3000/assets/test.txt');
      expect(file.size).toBe(11);
      expect(file.type).toBe('txt');
      expect(file.isDirectory).toBe(false);
    });
  });

  describe('write', () => {
    it('writes buffer and creates directories', async () => {
      const data = new Blob(['hello fs']);
      const irpcFile = new IRPCFile({ name: 'file.txt', size: 8, type: 'txt' } as any, data);

      const file = await driver.write(mockMeta, 'nested/file.txt', irpcFile);

      expect(file.path).toBe('nested/file.txt');
      expect(file.url).toBe('http://localhost:3000/assets/nested/file.txt');
      expect(file.size).toBe(8);

      const content = await fs.readFile(path.join(tmpDir, 'nested/file.txt'), 'utf8');
      expect(content).toBe('hello fs');
    });

    it('throws HandlerError if fs write fails (e.g., directory exists as file)', async () => {
      await fs.writeFile(path.join(tmpDir, 'bad_dir'), 'content');

      const irpcFile = new IRPCFile({ name: 'file.txt', size: 0 } as any, new Blob());
      await expect(driver.write(mockMeta, 'bad_dir/file.txt', irpcFile)).rejects.toThrowError(/operation failed/);
    });
  });

  describe('remove', () => {
    it('removes an existing file', async () => {
      await fs.writeFile(path.join(tmpDir, 'to_remove.txt'), 'x');
      const result = await driver.remove(mockMeta, 'to_remove.txt');
      expect(result).toBe(true);

      await expect(fs.stat(path.join(tmpDir, 'to_remove.txt'))).rejects.toThrow();
    });

    it('throws notFound if file does not exist', async () => {
      await expect(driver.remove(mockMeta, 'missing.txt')).rejects.toThrowError(/no such file or directory/);
    });
  });

  describe('rmdir', () => {
    it('throws notPermitted if target is a file', async () => {
      await fs.writeFile(path.join(tmpDir, 'file.txt'), 'x');
      await expect(driver.rmdir(mockMeta, 'file.txt')).rejects.toThrowError(/not permitted.*not a directory/);
    });

    it('removes an empty directory', async () => {
      await fs.mkdir(path.join(tmpDir, 'empty_dir'));
      const result = await driver.rmdir(mockMeta, 'empty_dir');
      expect(result).toBe(true);
      await expect(fs.stat(path.join(tmpDir, 'empty_dir'))).rejects.toThrow();
    });

    it('throws notEmpty if directory has files and recursive is false', async () => {
      await fs.mkdir(path.join(tmpDir, 'full_dir'));
      await fs.writeFile(path.join(tmpDir, 'full_dir/file.txt'), 'x');
      await expect(driver.rmdir(mockMeta, 'full_dir')).rejects.toThrowError(/directory not empty/);
    });

    it('removes non-empty directory if recursive is true', async () => {
      await fs.mkdir(path.join(tmpDir, 'full_dir'));
      await fs.writeFile(path.join(tmpDir, 'full_dir/file.txt'), 'x');
      const result = await driver.rmdir(mockMeta, 'full_dir', true);
      expect(result).toBe(true);
      await expect(fs.stat(path.join(tmpDir, 'full_dir'))).rejects.toThrow();
    });
  });

  describe('dir', () => {
    it('throws notPermitted if target is a file', async () => {
      await fs.writeFile(path.join(tmpDir, 'file.txt'), 'x');
      await expect(driver.dir(mockMeta, 'file.txt')).rejects.toThrowError(/not permitted.*not a directory/);
    });

    it('throws notFound if directory does not exist', async () => {
      await expect(driver.dir(mockMeta, 'missing_dir')).rejects.toThrowError(/no such file or directory/);
    });

    it('lists directory contents with sizes', async () => {
      await fs.mkdir(path.join(tmpDir, 'sub_dir'));
      await fs.writeFile(path.join(tmpDir, 'file1.txt'), 'hello');

      const files = await driver.dir(mockMeta);

      expect(files.length).toBe(2);

      const d = files.find((f) => f.isDirectory);
      expect(d?.path).toBe('/sub_dir/');
      expect(d?.size).toBe(0);
      expect(d?.type).toBe('directory');

      const f = files.find((f) => !f.isDirectory);
      expect(f?.path).toBe('/file1.txt');
      expect(f?.size).toBe(5);
      expect(f?.type).toBe('txt');
    });
  });

  describe('system errors and missing branches', () => {
    it('throws FSError.forbidden on EACCES', async () => {
      const restrictedDir = path.join(tmpDir, 'restricted');
      await fs.mkdir(restrictedDir);
      await fs.chmod(restrictedDir, 0o000);

      try {
        await expect(driver.read(mockMeta, 'restricted/file.txt')).rejects.toThrowError(/permission denied/);

        const irpcFile = new IRPCFile({ name: 'file.txt', size: 0 } as any, new Blob());
        await expect(driver.write(mockMeta, 'restricted/file.txt', irpcFile)).rejects.toThrowError(/permission denied/);

        await expect(driver.remove(mockMeta, 'restricted/file.txt')).rejects.toThrowError(/permission denied/);

        await expect(driver.rmdir(mockMeta, 'restricted')).rejects.toThrowError(/permission denied/);

        await expect(driver.dir(mockMeta, 'restricted')).rejects.toThrowError(/permission denied/);
      } finally {
        // Restore permissions so afterEach can clean up
        await fs.chmod(restrictedDir, 0o777);
      }
    });

    it('throws FSError.failed on generic system error (e.g. ENOTDIR)', async () => {
      await fs.writeFile(path.join(tmpDir, 'not_a_dir'), 'file content');

      await expect(driver.read(mockMeta, 'not_a_dir/file.txt')).rejects.toThrowError(/operation failed/);
      await expect(driver.remove(mockMeta, 'not_a_dir/file.txt')).rejects.toThrowError(/operation failed/);
      await expect(driver.rmdir(mockMeta, 'not_a_dir/dir')).rejects.toThrowError(/operation failed/);
      await expect(driver.dir(mockMeta, 'not_a_dir/dir')).rejects.toThrowError(/operation failed/);
    });

    it('ignores individual item stat failures in dir', async () => {
      const dirPath = path.join(tmpDir, 'symlink_dir');
      await fs.mkdir(dirPath);
      // Create a broken symlink inside the directory
      await fs.symlink(path.join(tmpDir, 'does_not_exist'), path.join(dirPath, 'broken_link'));

      const files = await driver.dir(mockMeta, 'symlink_dir');
      expect(files.length).toBe(1);
      expect(files[0].path).toBe('/symlink_dir/broken_link');
      expect(files[0].size).toBe(0);
    });

    it('getOptions branch: uses context options', () => {
      setLocalFSOptions({ baseDir: '/ctx', publicUrl: 'http://ctx' });
      const ctxDriver = new LocalFSDriver();
      const opts = ctxDriver.getOptions();
      expect(opts.baseDir).toBe('/ctx');
      expect(opts.publicUrl).toBe('http://ctx');
      setLocalFSOptions(undefined as any);
    });

    it('getUrl branch: publicUrl with trailing slash', async () => {
      const slashDriver = new LocalFSDriver({ baseDir: tmpDir, publicUrl: 'http://localhost/assets/' });
      await fs.writeFile(path.join(tmpDir, 'slash.txt'), 'x');
      const file = await slashDriver.read(mockMeta, 'slash.txt');
      expect(file.url).toBe('http://localhost/assets/slash.txt');
    });

    it('write branch: fallback for missing file.meta.size and file.meta.type', async () => {
      const data = new Blob(['1234']);
      // File without size and type
      const irpcFile = new IRPCFile({ name: 'file2.txt' } as any, data);
      const file = await driver.write(mockMeta, 'file2.txt', irpcFile);
      expect(file.size).toBe(4); // buffer.length
      expect(file.type).toBe('txt'); // getFileType fallback
    });

    it('rmdir branch: throws notFound if directory does not exist', async () => {
      await expect(driver.rmdir(mockMeta, 'missing_dir')).rejects.toThrowError(/no such file or directory/);
    });
  });
});
