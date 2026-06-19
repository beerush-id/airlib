import * as fs from 'node:fs/promises';
import * as nodePath from 'node:path';
import { HandlerError, type IRPCDriver, type IRPCFile } from '@irpclib/irpc';
import type { FSAdapter } from '../../adapter.js';
import { FSError } from '../../error.js';
import type { FSFile, FSMeta } from '../../index.js';
import { errorCode, getFileExt, join, withExt } from '../../utils.js';
import { getLocalFSOptions, type LocalFSOptions } from './context.js';

export class LocalFSDriver implements IRPCDriver<FSAdapter> {
  constructor(public readonly options?: Partial<LocalFSOptions>) {}

  public getOptions(): LocalFSOptions {
    const ctx = getLocalFSOptions();
    const baseDir = ctx?.baseDir || this.options?.baseDir;
    const publicUrl = ctx?.publicUrl || this.options?.publicUrl;
    if (!baseDir || !publicUrl) throw FSError.failed('init');
    return { baseDir, publicUrl };
  }

  async read(meta: FSMeta, path: string): Promise<FSFile> {
    const options = this.getOptions();
    const localPath = this.physical(options, meta, path);
    try {
      const stat = await fs.stat(localPath);
      if (stat.isDirectory()) throw FSError.notPermitted('read (is a directory)');
      return {
        path,
        url: this.url(options.publicUrl, path),
        size: stat.size,
        type: getFileExt(path),
        isDirectory: false,
        createdAt: stat.birthtimeMs,
        updatedAt: stat.mtimeMs,
      };
    } catch (err: unknown) {
      if (err instanceof HandlerError) throw err;
      const code = errorCode(err);
      if (code === 'ENOENT') throw FSError.notFound('read', path);
      if (code === 'EACCES') throw FSError.forbidden('read', path);
      throw FSError.failed('read', path);
    }
  }

  async write(meta: FSMeta, path: string, file: IRPCFile, thumbnail?: IRPCFile): Promise<FSFile> {
    const options = this.getOptions();
    const localPath = this.physical(options, meta, path);
    const now = Date.now();

    if (thumbnail && meta.thumbnailPrefix) {
      const thumbPath = this.physical(options, { ...meta, prefix: meta.thumbnailPrefix }, path);
      const thumbExt = thumbnail.meta.type;
      const thumbFinal = withExt(thumbPath, thumbExt);
      await fs.mkdir(nodePath.dirname(thumbFinal), { recursive: true });
      await fs.writeFile(thumbFinal, Buffer.from(await thumbnail.data.arrayBuffer()));
    }

    try {
      await fs.mkdir(nodePath.dirname(localPath), { recursive: true });
      const buffer = Buffer.from(await file.data.arrayBuffer());
      await fs.writeFile(localPath, buffer);
      const result: FSFile = {
        path,
        url: this.url(options.publicUrl, path),
        size: file.meta.size || buffer.length,
        type: file.meta.type,
        isDirectory: false,
        createdAt: now,
        updatedAt: now,
      };

      if (thumbnail && meta.thumbnailPrefix) {
        const thumbExt = thumbnail.meta.type;
        const thumbPath = withExt(path, thumbExt);
        result.thumbnailUrl = this.url(options.publicUrl, thumbPath);
      }

      return result;
    } catch (err: unknown) {
      if (thumbnail && meta.thumbnailPrefix) {
        try {
          const thumbPath = this.physical(options, { ...meta, prefix: meta.thumbnailPrefix }, path);
          await fs.unlink(thumbPath);
        } catch {}
      }
      const code = errorCode(err);
      if (code === 'EACCES') throw FSError.forbidden('write', path);
      throw FSError.failed('write', path);
    }
  }

  async remove(meta: FSMeta, path: string): Promise<boolean> {
    const localPath = this.physical(this.getOptions(), meta, path);
    try {
      await fs.unlink(localPath);
      return true;
    } catch (err: unknown) {
      const code = errorCode(err);
      if (code === 'ENOENT') throw FSError.notFound('remove', path);
      if (code === 'EACCES') throw FSError.forbidden('remove', path);
      throw FSError.failed('remove', path);
    }
  }

  async rmdir(meta: FSMeta, path: string, recursive?: boolean): Promise<boolean> {
    const localPath = this.physical(this.getOptions(), meta, path);
    try {
      const stat = await fs.stat(localPath);
      if (!stat.isDirectory()) throw FSError.notPermitted('rmdir (not a directory)');
      if (!recursive) {
        const items = await fs.readdir(localPath);
        if (items.length > 0) throw FSError.notEmpty('rmdir', path);
      }
      if (recursive) {
        await fs.rm(localPath, { recursive: true, force: true });
      } else {
        await fs.rmdir(localPath);
      }
      return true;
    } catch (err: unknown) {
      if (err instanceof HandlerError) throw err;
      const code = errorCode(err);
      if (code === 'ENOENT') throw FSError.notFound('rmdir', path);
      if (code === 'EACCES') throw FSError.forbidden('rmdir', path);
      throw FSError.failed('rmdir', path);
    }
  }

  async dir(meta: FSMeta, path?: string): Promise<FSFile[]> {
    const options = this.getOptions();
    const p = path || '/';
    const localPath = this.physical(options, meta, p);
    try {
      const stat = await fs.stat(localPath);
      if (!stat.isDirectory()) throw FSError.notPermitted('dir (not a directory)');
      const entries = await fs.readdir(localPath, { withFileTypes: true });
      const results: FSFile[] = [];
      const basePrefix = p.endsWith('/') ? p : `${p}/`;

      for (const entry of entries) {
        const itemPath = `${basePrefix}${entry.name}`;
        let itemSize = 0;
        let createdAt = 0;
        let updatedAt = 0;
        if (!entry.isDirectory()) {
          try {
            const itemStat = await fs.stat(nodePath.join(localPath, entry.name));
            itemSize = itemStat.size;
            createdAt = itemStat.birthtimeMs;
            updatedAt = itemStat.mtimeMs;
          } catch {}
        }
        results.push({
          path: entry.isDirectory() ? `${itemPath}/` : itemPath,
          url: entry.isDirectory() ? '' : this.url(options.publicUrl, itemPath),
          size: itemSize,
          type: entry.isDirectory() ? 'directory' : getFileExt(itemPath),
          isDirectory: entry.isDirectory(),
          createdAt,
          updatedAt,
        });
      }
      return results;
    } catch (err: unknown) {
      if (err instanceof HandlerError) throw err;
      const code = errorCode(err);
      if (code === 'ENOENT') throw FSError.notFound('dir', p);
      if (code === 'EACCES') throw FSError.forbidden('dir', p);
      throw FSError.failed('dir', p);
    }
  }

  async mkdir(meta: FSMeta, path: string): Promise<FSFile> {
    const options = this.getOptions();
    const localPath = this.physical(options, meta, path);
    try {
      await fs.mkdir(localPath, { recursive: true });
      const stat = await fs.stat(localPath);
      return {
        path: path.endsWith('/') ? path : `${path}/`,
        url: '',
        size: 0,
        type: 'directory',
        isDirectory: true,
        createdAt: stat.birthtimeMs,
        updatedAt: stat.mtimeMs,
      };
    } catch (err: unknown) {
      const code = errorCode(err);
      if (code === 'EACCES') throw FSError.forbidden('mkdir', path);
      throw FSError.failed('mkdir', path);
    }
  }

  async stat(meta: FSMeta, path: string): Promise<FSFile> {
    const options = this.getOptions();
    const localPath = this.physical(options, meta, path);
    try {
      const stat = await fs.stat(localPath);
      return {
        path: stat.isDirectory() ? (path.endsWith('/') ? path : `${path}/`) : path,
        url: stat.isDirectory() ? '' : this.url(options.publicUrl, path),
        size: stat.size,
        type: stat.isDirectory() ? 'directory' : getFileExt(path),
        isDirectory: stat.isDirectory(),
        createdAt: stat.birthtimeMs,
        updatedAt: stat.mtimeMs,
      };
    } catch (err: unknown) {
      const code = errorCode(err);
      if (code === 'ENOENT') throw FSError.notFound('stat', path);
      if (code === 'EACCES') throw FSError.forbidden('stat', path);
      throw FSError.failed('stat', path);
    }
  }

  async move(meta: FSMeta, from: string, to: string, dstMeta?: FSMeta): Promise<FSFile> {
    const options = this.getOptions();
    const srcPath = this.physical(options, meta, from);
    const dst = dstMeta || meta;
    const dstPath = this.physical(options, dst, to);
    try {
      await fs.mkdir(nodePath.dirname(dstPath), { recursive: true });
      await fs.rename(srcPath, dstPath);
      const stat = await fs.stat(dstPath);
      return {
        path: to,
        url: this.url(options.publicUrl, to),
        size: stat.size,
        type: stat.isDirectory() ? 'directory' : getFileExt(to),
        isDirectory: stat.isDirectory(),
        createdAt: stat.birthtimeMs,
        updatedAt: stat.mtimeMs,
      };
    } catch (err: unknown) {
      const code = errorCode(err);
      if (code === 'ENOENT') throw FSError.notFound('move', from);
      if (code === 'EACCES') throw FSError.forbidden('move', from);
      throw FSError.failed('move', from);
    }
  }

  async copy(meta: FSMeta, from: string, to: string, dstMeta?: FSMeta): Promise<FSFile> {
    const options = this.getOptions();
    const srcPath = this.physical(options, meta, from);
    const dst = dstMeta || meta;
    const dstPath = this.physical(options, dst, to);
    try {
      await fs.mkdir(nodePath.dirname(dstPath), { recursive: true });
      await fs.copyFile(srcPath, dstPath);
      const stat = await fs.stat(dstPath);
      return {
        path: to,
        url: this.url(options.publicUrl, to),
        size: stat.size,
        type: getFileExt(to),
        isDirectory: false,
        createdAt: stat.birthtimeMs,
        updatedAt: stat.mtimeMs,
      };
    } catch (err: unknown) {
      const code = errorCode(err);
      if (code === 'ENOENT') throw FSError.notFound('copy', from);
      if (code === 'EACCES') throw FSError.forbidden('copy', from);
      throw FSError.failed('copy', from);
    }
  }

  async exists(meta: FSMeta, path: string): Promise<boolean> {
    try {
      await fs.stat(this.physical(this.getOptions(), meta, path));
      return true;
    } catch {
      return false;
    }
  }

  private physical(options: LocalFSOptions, meta: FSMeta, path: string): string {
    const resolved = nodePath.resolve(options.baseDir, join(meta.prefix, path).replace(/^\/+/, ''));
    const absoluteBase = nodePath.resolve(options.baseDir);
    if (!resolved.startsWith(absoluteBase)) throw FSError.forbidden('access', path);
    return resolved;
  }

  private url(publicUrl: string, path: string): string {
    const base = publicUrl.endsWith('/') ? publicUrl.slice(0, -1) : publicUrl;
    return `${base}${path}`;
  }
}
