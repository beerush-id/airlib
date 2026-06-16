import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { HandlerError, type IRPCDriver, type IRPCFile, type IRPCMeta } from '@irpclib/irpc';
import type { FSAdapter } from '../../adapter.js';
import { FSError } from '../../error.js';
import type { FSEntry, FSFile } from '../../index.js';
import { getFileExt, getFileType, normalizePath } from '../../utils.js';
import { getLocalFSOptions, type LocalFSOptions } from './context.js';

export class LocalFSDriver implements IRPCDriver<FSAdapter> {
  constructor(public readonly options?: Partial<LocalFSOptions>) {}

  getOptions(): LocalFSOptions {
    const ctxOptions = getLocalFSOptions();
    const baseDir = ctxOptions?.baseDir || this.options?.baseDir;
    const publicUrl = ctxOptions?.publicUrl || this.options?.publicUrl;

    if (!baseDir || !publicUrl) throw FSError.failed('init', 'File system not available');

    return { baseDir, publicUrl };
  }

  private resolveLocalPath(options: LocalFSOptions, reqPath: string): string {
    const normalizedReq = normalizePath(reqPath, reqPath.endsWith('/'));

    // Create absolute paths for security checks
    const absoluteBase = path.resolve(options.baseDir);
    // Join removes leading slashes from reqPath naturally
    const localPath = path.resolve(absoluteBase, normalizedReq.replace(/^\/+/, ''));

    // Prevent Path Traversal
    if (!localPath.startsWith(absoluteBase)) {
      throw FSError.forbidden('access', reqPath);
    }

    return localPath;
  }

  private getUrl(options: LocalFSOptions, reqPath: string): string {
    const normalizedReq = normalizePath(reqPath, reqPath.endsWith('/'));
    const urlBase = options.publicUrl.endsWith('/') ? options.publicUrl.slice(0, -1) : options.publicUrl;
    return `${urlBase}${normalizedReq}`;
  }

  async read(_meta: IRPCMeta, reqPath: string): Promise<FSFile> {
    const options = this.getOptions();
    const localPath = this.resolveLocalPath(options, reqPath);

    try {
      const stat = await fs.stat(localPath);
      if (stat.isDirectory()) throw FSError.notPermitted('read (is a directory)');

      return {
        path: reqPath,
        url: this.getUrl(options, reqPath),
        size: stat.size,
        type: getFileType('', getFileExt(reqPath)),
        isDirectory: false,
      };
    } catch (err: any) {
      if (err instanceof HandlerError) throw err;
      if (err.code === 'ENOENT') throw FSError.notFound('read', reqPath);
      if (err.code === 'EACCES') throw FSError.forbidden('read', reqPath);
      throw FSError.failed('read', reqPath);
    }
  }

  async write(_meta: IRPCMeta, reqPath: string, file: IRPCFile): Promise<FSFile> {
    const options = this.getOptions();
    const localPath = this.resolveLocalPath(options, reqPath);

    try {
      const dir = path.dirname(localPath);
      await fs.mkdir(dir, { recursive: true });

      const buffer = Buffer.from(await file.data.arrayBuffer());
      await fs.writeFile(localPath, buffer);

      return {
        path: reqPath,
        url: this.getUrl(options, reqPath),
        size: file.meta.size || buffer.length,
        type: file.meta.type || getFileType('', getFileExt(reqPath)),
        isDirectory: false,
      };
    } catch (err: any) {
      if (err.code === 'EACCES') throw FSError.forbidden('write', reqPath);
      throw FSError.failed('write', reqPath);
    }
  }

  async remove(_meta: IRPCMeta, reqPath: string): Promise<boolean> {
    const options = this.getOptions();
    const localPath = this.resolveLocalPath(options, reqPath);

    try {
      await fs.unlink(localPath);
      return true;
    } catch (err: any) {
      if (err.code === 'ENOENT') throw FSError.notFound('remove', reqPath);
      if (err.code === 'EACCES') throw FSError.forbidden('remove', reqPath);
      throw FSError.failed('remove', reqPath);
    }
  }

  async rmdir(_meta: IRPCMeta, reqPath: string, recursive?: boolean): Promise<boolean> {
    const options = this.getOptions();
    const localPath = this.resolveLocalPath(options, reqPath);

    try {
      const stat = await fs.stat(localPath);
      if (!stat.isDirectory()) throw FSError.notPermitted('rmdir (not a directory)');

      if (!recursive) {
        const items = await fs.readdir(localPath);
        if (items.length > 0) throw FSError.notEmpty('rmdir', reqPath);
      }

      if (recursive) {
        await fs.rm(localPath, { recursive: true, force: true });
      } else {
        await fs.rmdir(localPath);
      }

      return true;
    } catch (err: any) {
      if (err instanceof HandlerError) throw err;
      if (err.code === 'ENOENT') throw FSError.notFound('rmdir', reqPath);
      if (err.code === 'EACCES') throw FSError.forbidden('rmdir', reqPath);
      throw FSError.failed('rmdir', reqPath);
    }
  }

  async dir(_meta: IRPCMeta, reqPath?: string): Promise<FSEntry[]> {
    const options = this.getOptions();
    const p = reqPath || '/';
    const localPath = this.resolveLocalPath(options, p);

    try {
      const stat = await fs.stat(localPath);
      if (!stat.isDirectory()) throw FSError.notPermitted('dir (not a directory)');

      const entries = await fs.readdir(localPath, { withFileTypes: true });
      const results: FSEntry[] = [];

      const basePrefix = p.endsWith('/') ? p : `${p}/`;

      for (const entry of entries) {
        const suffix = entry.isDirectory() ? '/' : '';
        const itemPath = normalizePath(`${basePrefix}${entry.name}${suffix}`, entry.isDirectory());

        let itemSize = 0;
        if (!entry.isDirectory()) {
          try {
            const itemStat = await fs.stat(path.join(localPath, entry.name));
            itemSize = itemStat.size;
          } catch (e) {
            // Ignore stat failures for individual items in directory listing
          }
        }

        results.push({
          path: itemPath,
          size: itemSize,
          type: entry.isDirectory() ? 'directory' : getFileType('', getFileExt(entry.name)),
          isDirectory: entry.isDirectory(),
        });
      }

      return results;
    } catch (err: any) {
      if (err instanceof HandlerError) throw err;
      if (err.code === 'ENOENT') throw FSError.notFound('dir', p);
      if (err.code === 'EACCES') throw FSError.forbidden('dir', p);
      throw FSError.failed('dir', p);
    }
  }
}
