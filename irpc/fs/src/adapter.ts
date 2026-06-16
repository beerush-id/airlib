import { IRPCAdapter, type IRPCDriver, type IRPCFile, type IRPCMeta } from '@irpclib/irpc';
import { getFSConfig } from './context.js';
import type { FSEntry, FSFile } from './index.js';
import { enforceReadOnly, mapFile, resolvePath, validateWrite } from './utils.js';

/**
 * Base adapter for the IRPC filesystem.
 * Dispatches filesystem operations to the underlying driver implementation.
 */
export class FSAdapter extends IRPCAdapter {
  /**
   * Dispatches a read operation to the configured driver.
   *
   * @param meta - IRPC metadata for the request.
   * @param path - The file path to read.
   * @returns A promise resolving to the file representation.
   */
  async read(meta: IRPCMeta, path: string): Promise<FSFile> {
    const config = getFSConfig();
    const resolved = resolvePath(config, path);
    const result = await this.dispatch<FSFile>('read', meta, resolved);
    return mapFile(config, result);
  }

  /**
   * Dispatches a write operation to the configured driver.
   *
   * @param meta - IRPC metadata for the request.
   * @param path - The file path to write to.
   * @param file - The file data to write.
   * @returns A promise resolving to the updated file representation.
   */
  async write(meta: IRPCMeta, path: string, file: IRPCFile): Promise<FSFile> {
    const config = getFSConfig();
    validateWrite(config, file);
    const resolved = resolvePath(config, path);
    const result = await this.dispatch<FSFile>('write', meta, resolved, file);
    return mapFile(config, result);
  }

  /**
   * Dispatches a remove operation to the configured driver.
   *
   * @param meta - IRPC metadata for the request.
   * @param path - The file path to remove.
   * @returns A promise resolving to true if successful.
   */
  async remove(meta: IRPCMeta, path: string): Promise<boolean> {
    const config = getFSConfig();
    enforceReadOnly(config);
    const resolved = resolvePath(config, path);
    return this.dispatch<boolean>('remove', meta, resolved);
  }

  /**
   * Dispatches a remove directory operation to the configured driver.
   *
   * @param meta - IRPC metadata for the request.
   * @param path - The directory path to remove.
   * @param recursive - Whether to recursively remove all contents.
   * @returns A promise resolving to true if successful.
   */
  async rmdir(meta: IRPCMeta, path: string, recursive?: boolean): Promise<boolean> {
    const config = getFSConfig();
    enforceReadOnly(config);
    const resolved = resolvePath(config, path);
    return this.dispatch<boolean>('rmdir', meta, resolved, recursive);
  }

  /**
   * Dispatches a directory listing operation to the configured driver.
   *
   * @param meta - IRPC metadata for the request.
   * @param path - The directory path to list (optional).
   * @returns A promise resolving to an array of entries in the directory.
   */
  async dir(meta: IRPCMeta, path?: string): Promise<FSEntry[]> {
    const config = getFSConfig();
    const resolved = resolvePath(config, path || '');
    const results = await this.dispatch<FSEntry[]>('dir', meta, resolved);
    return results.map((f) => mapFile(config, f));
  }
}

/**
 * Type representing a driver implementation for the FSAdapter.
 */
export type FSDriver = IRPCDriver<FSAdapter>;
