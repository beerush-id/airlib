import { IRPCAdapter, type IRPCDriver, type IRPCFile, type IRPCMeta } from '@irpclib/irpc';
import { getFSConfig } from './context.js';
import type { FSEntry, FSMeta, FSPayload, FSReadResult } from './index.js';
import { normalizeType, resolveEntryPath, resolveRequest, resolveWriteAccess, resolveWriteLimit } from './utils.js';

export class FSAdapter extends IRPCAdapter {
  private async executeWithRollback<T>(m: FSMeta, action: () => Promise<T>): Promise<T> {
    m.rollback = new Set();
    try {
      return await action();
    } catch (e) {
      if (m.rollback && m.rollback.size > 0) {
        const rollbacks = Array.from(m.rollback).reverse();
        for (const rb of rollbacks) {
          try {
            await rb();
          } catch (err) {
            console.error('FS Rollback failed:', err);
          }
        }
      }
      throw e;
    }
  }

  async create(meta: IRPCMeta, path: string, entry?: FSPayload): Promise<FSEntry> {
    const config = resolveWriteAccess();
    const { path: p, meta: m } = resolveRequest(config, meta, path, false) as { path: string; meta: FSMeta };
    const { path: finalPath, directory, name } = resolveEntryPath(p, entry?.name);
    m.response = {
      ...entry,
      path: finalPath,
      directory,
      name,
      type: entry?.type || 'unknown',
      isDirectory: false,
      status: entry?.status || 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    return this.executeWithRollback(m, async () => {
      const res = await this.dispatch<FSEntry>('create', m, finalPath, entry);
      return normalizeType(res);
    });
  }

  async read(meta: IRPCMeta, path: string): Promise<FSReadResult> {
    const { path: p, meta: m } = resolveRequest(getFSConfig(), meta, path, false) as { path: string; meta: FSMeta };
    const res = await this.dispatch<FSReadResult>('read', m, p);
    if (res.file) normalizeType(res.file);
    return res;
  }

  async write(meta: IRPCMeta, path: string, file: IRPCFile): Promise<FSEntry> {
    normalizeType(file);
    const config = resolveWriteLimit(file);
    const { path: p, meta: m } = resolveRequest(config, meta, path, false) as { path: string; meta: FSMeta };
    const { path: finalPath, directory, name } = resolveEntryPath(p, file.meta?.name);
    m.response = {
      ...file.meta,
      path: finalPath,
      directory,
      name,
      type: file.meta?.type || 'unknown',
      isDirectory: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    return this.executeWithRollback(m, async () => {
      const res = await this.dispatch<FSEntry>('write', m, finalPath, file);
      return normalizeType(res);
    });
  }

  async update(meta: IRPCMeta, path: string, entry: FSPayload, file?: IRPCFile): Promise<FSEntry> {
    const config = resolveWriteAccess();
    if (file) {
      normalizeType(file);
      resolveWriteLimit(file);
    }
    const { path: p, meta: m } = resolveRequest(config, meta, path, false) as { path: string; meta: FSMeta };
    const { path: finalPath } = resolveEntryPath(p, undefined); // Ignore payload name to prevent silent renames

    return this.executeWithRollback(m, async () => {
      const res = await this.dispatch<FSEntry>('update', m, finalPath, entry, file);
      return normalizeType(res);
    });
  }

  async remove(meta: IRPCMeta, path: string): Promise<boolean> {
    const config = resolveWriteAccess();
    const { path: p, meta: m } = resolveRequest(config, meta, path, false) as { path: string; meta: FSMeta };
    return this.executeWithRollback(m, async () => {
      return this.dispatch<boolean>('remove', m, p);
    });
  }

  async rmdir(meta: IRPCMeta, path: string, recursive?: boolean): Promise<boolean> {
    const config = resolveWriteAccess();
    const { path: p, meta: m } = resolveRequest(config, meta, path, true) as { path: string; meta: FSMeta };
    return this.executeWithRollback(m, async () => {
      return this.dispatch<boolean>('rmdir', m, p, recursive);
    });
  }

  async dir(meta: IRPCMeta, path?: string): Promise<FSEntry[]> {
    const { path: p, meta: m } = resolveRequest(getFSConfig(), meta, path || '/', true) as {
      path: string;
      meta: FSMeta;
    };
    const res = await this.dispatch<FSEntry[]>('dir', m, p);
    return res.map(normalizeType);
  }

  async mkdir(meta: IRPCMeta, path: string, entry?: FSPayload): Promise<FSEntry> {
    const config = resolveWriteAccess();
    const { path: p, meta: m } = resolveRequest(config, meta, path, true) as { path: string; meta: FSMeta };
    const { path: finalPath, directory, name } = resolveEntryPath(p, entry?.name);
    m.response = {
      ...entry,
      path: finalPath,
      directory,
      name,
      type: entry?.type || 'directory',
      isDirectory: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    return this.executeWithRollback(m, async () => {
      const res = await this.dispatch<FSEntry>('mkdir', m, finalPath, entry);
      return normalizeType(res);
    });
  }

  async stat(meta: IRPCMeta, path: string): Promise<FSEntry> {
    const { path: p, meta: m } = resolveRequest(getFSConfig(), meta, path, false) as { path: string; meta: FSMeta };
    const res = await this.dispatch<FSEntry>('stat', m, p);
    return normalizeType(res);
  }

  async move(meta: IRPCMeta, from: string, to: string, entry?: FSPayload): Promise<FSEntry> {
    const config = resolveWriteAccess();
    const src = resolveRequest(config, meta, from, false) as { path: string; meta: FSMeta };
    const dst = resolveRequest(config, meta, to, false) as { path: string; meta: FSMeta };

    const { path: finalPath } = resolveEntryPath(dst.path, entry?.name);

    return this.executeWithRollback(src.meta, async () => {
      const res = await this.dispatch<FSEntry>('move', src.meta, src.path, finalPath, dst.meta, entry);
      return normalizeType(res);
    });
  }

  async copy(meta: IRPCMeta, from: string, to: string, entry?: FSPayload): Promise<FSEntry> {
    const config = getFSConfig();
    const src = resolveRequest(config, meta, from, false) as { path: string; meta: FSMeta };
    const dst = resolveRequest(config, meta, to, false) as { path: string; meta: FSMeta };

    const { path: finalPath } = resolveEntryPath(dst.path, entry?.name);

    return this.executeWithRollback(src.meta, async () => {
      const res = await this.dispatch<FSEntry>('copy', src.meta, src.path, finalPath, dst.meta, entry);
      return normalizeType(res);
    });
  }

  async exists(meta: IRPCMeta, path: string): Promise<boolean> {
    const { path: p, meta: m } = resolveRequest(getFSConfig(), meta, path, false) as { path: string; meta: FSMeta };
    return this.dispatch<boolean>('exists', m, p);
  }
}

export type FSDriver = IRPCDriver<FSAdapter>;
