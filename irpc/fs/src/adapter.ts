import { IRPCAdapter, type IRPCDriver, IRPCFile, type IRPCMeta } from '@irpclib/irpc';
import { getFSConfig } from './context.js';
import { FSError } from './error.js';
import type { FSFile } from './index.js';
import { normalizeType, resolveRequest, resolveWriteAccess, resolveWriteLimit } from './utils.js';

export type ThumbnailGenerator = (file: IRPCFile) => Promise<IRPCFile>;
export class NextGenerator extends Error {}

export class FSAdapter extends IRPCAdapter {
  private thumbnailGenerators = new Set<ThumbnailGenerator>();

  useThumbnail(gen: ThumbnailGenerator): this {
    this.thumbnailGenerators.add(gen);
    return this;
  }

  async read(meta: IRPCMeta, path: string): Promise<FSFile> {
    const { path: p, meta: m } = resolveRequest(getFSConfig(), meta, path, false);
    return normalizeType(await this.dispatch<FSFile>('read', m, p));
  }

  async write(meta: IRPCMeta, path: string, file: IRPCFile): Promise<FSFile> {
    normalizeType(file);
    const config = resolveWriteLimit(file);
    const { path: p, meta: m } = resolveRequest(config, meta, path, false);

    let thumbnail: IRPCFile | undefined;
    if (this.thumbnailGenerators.size > 0 && m.thumbnailPrefix) {
      for (const gen of this.thumbnailGenerators) {
        try {
          const generated = await gen(file);
          if (!(generated instanceof IRPCFile)) {
            throw FSError.failed('write', path);
          }
          normalizeType(generated);
          if (!generated.meta.type && file.meta.type) {
            generated.meta.type = file.meta.type;
          }
          thumbnail = generated;
          break;
        } catch (e) {
          if (e instanceof NextGenerator) continue;
          throw e;
        }
      }
    }

    return normalizeType(await this.dispatch<FSFile>('write', m, p, file, thumbnail));
  }

  async remove(meta: IRPCMeta, path: string): Promise<boolean> {
    const config = resolveWriteAccess();
    const { path: p, meta: m } = resolveRequest(config, meta, path, false);
    return this.dispatch<boolean>('remove', m, p);
  }

  async rmdir(meta: IRPCMeta, path: string, recursive?: boolean): Promise<boolean> {
    const config = resolveWriteAccess();
    const { path: p, meta: m } = resolveRequest(config, meta, path, true);
    return this.dispatch<boolean>('rmdir', m, p, recursive);
  }

  async dir(meta: IRPCMeta, path?: string): Promise<FSFile[]> {
    const { path: p, meta: m } = resolveRequest(getFSConfig(), meta, path || '/', true);
    return (await this.dispatch<FSFile[]>('dir', m, p)).map(normalizeType);
  }

  async mkdir(meta: IRPCMeta, path: string): Promise<FSFile> {
    const config = resolveWriteAccess();
    const { path: p, meta: m } = resolveRequest(config, meta, path, true);
    return normalizeType(await this.dispatch<FSFile>('mkdir', m, p));
  }

  async stat(meta: IRPCMeta, path: string): Promise<FSFile> {
    const { path: p, meta: m } = resolveRequest(getFSConfig(), meta, path, false);
    return normalizeType(await this.dispatch<FSFile>('stat', m, p));
  }

  async move(meta: IRPCMeta, from: string, to: string): Promise<FSFile> {
    const config = resolveWriteAccess();
    const src = resolveRequest(config, meta, from, false);
    const dst = resolveRequest(config, meta, to, false);
    return normalizeType(await this.dispatch<FSFile>('move', src.meta, src.path, dst.path, dst.meta));
  }

  async copy(meta: IRPCMeta, from: string, to: string): Promise<FSFile> {
    const config = getFSConfig();
    const src = resolveRequest(config, meta, from, false);
    const dst = resolveRequest(config, meta, to, false);
    return normalizeType(await this.dispatch<FSFile>('copy', src.meta, src.path, dst.path, dst.meta));
  }

  async exists(meta: IRPCMeta, path: string): Promise<boolean> {
    const { path: p, meta: m } = resolveRequest(getFSConfig(), meta, path, false);
    return this.dispatch<boolean>('exists', m, p);
  }
}

export type FSDriver = IRPCDriver<FSAdapter>;
