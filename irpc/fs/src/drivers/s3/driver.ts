import { HandlerError, type IRPCDriver, type IRPCFile } from '@irpclib/irpc';
import type { FSAdapter } from '../../adapter.js';
import { FSError } from '../../error.js';
import type { FSMeta, FSFile } from '../../index.js';
import { getFileExt, getMimeType, join, withExt } from '../../utils.js';
import { getS3Credentials } from './context.js';
import { signS3Request, signS3Url, type AwsCredentials } from './signer.js';

const DEFAULT_MAX_KEYS = 100;
const DEFAULT_DELETE_CHUNK_SIZE = 10;

export interface S3DriverOptions {
  maxKeys?: number;
  deleteChunkSize?: number;
}

function extractXmlElements(xml: string, tag: string): string[] {
  const results: string[] = [];
  const open = `<${tag}>`;
  const close = `</${tag}>`;
  let pos = 0;
  while (pos < xml.length) {
    const start = xml.indexOf(open, pos);
    if (start === -1) break;
    const valStart = start + open.length;
    const end = xml.indexOf(close, valStart);
    if (end === -1) break;
    results.push(xml.substring(valStart, end));
    pos = end + close.length;
  }
  return results;
}

function extractXmlElement(xml: string, tag: string): string | null {
  const open = `<${tag}>`;
  const close = `</${tag}>`;
  const start = xml.indexOf(open);
  if (start === -1) return null;
  const valStart = start + open.length;
  const end = xml.indexOf(close, valStart);
  if (end === -1) return null;
  return xml.substring(valStart, end);
}

export class S3Driver implements IRPCDriver<FSAdapter> {
  constructor(public options: S3DriverOptions = {}) {}

  private getCredentials(): AwsCredentials {
    const credentials = getS3Credentials();
    if (!credentials?.endpoint || !credentials?.accessKeyId || !credentials?.secretAccessKey) {
      throw FSError.forbidden('access');
    }
    return credentials;
  }

  private s3Key(meta: FSMeta, path: string): string {
    return join(meta.prefix, path).replace(/^\//, '');
  }

  private stripPrefix(key: string, meta: FSMeta): string {
    const prefix = meta.prefix.replace(/^\//, '');
    return key.startsWith(prefix) ? `/${key.substring(prefix.length)}` : `/${key}`;
  }

  async read(meta: FSMeta, path: string): Promise<FSFile> {
    const credentials = this.getCredentials();
    const key = this.s3Key(meta, path);

    const headRes = await fetch(await signS3Request(credentials, 'HEAD', key));
    if (!headRes.ok) {
      if (headRes.status === 401 || headRes.status === 403) throw FSError.forbidden('read', path);
      if (headRes.status === 404) throw FSError.notFound('read', path);
      throw FSError.failed('read', path);
    }

    const mime = headRes.headers.get('content-type') || '';
    return {
      path,
      url: await signS3Url(credentials, 'GET', key),
      size: parseInt(headRes.headers.get('content-length') || '0', 10),
      type: mime,
      isDirectory: false,
      createdAt: 0,
      updatedAt: 0,
    };
  }

  async write(meta: FSMeta, path: string, file: IRPCFile, thumbnail?: IRPCFile): Promise<FSFile> {
    const credentials = this.getCredentials();
    const key = this.s3Key(meta, path);
    const mime = getMimeType(file.meta.type || path);

    if (thumbnail && meta.thumbnailPrefix) {
      const thumbExt = thumbnail.meta.type;
      const thumbKey = withExt(this.s3Key({ ...meta, prefix: meta.thumbnailPrefix }, path), thumbExt);
      await fetch(await signS3Url(credentials, 'PUT', thumbKey), {
        method: 'PUT',
        body: await thumbnail.data.arrayBuffer(),
        headers: { 'Content-Type': getMimeType(thumbnail.meta.type) },
      });
    }

    try {
      const buf = await file.data.arrayBuffer();
      const res = await fetch(await signS3Url(credentials, 'PUT', key), {
        method: 'PUT',
        body: buf,
        headers: { 'Content-Type': mime },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) throw FSError.forbidden('write', path);
        if (res.status === 404) throw FSError.notFound('write', path);
        throw FSError.failed('write', path);
      }

      const result: FSFile = {
        path,
        url: await signS3Url(credentials, 'GET', key),
        size: file.meta.size || buf.byteLength,
        type: file.meta.type,
        isDirectory: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      if (thumbnail && meta.thumbnailPrefix) {
        const thumbExt = thumbnail.meta.type;
        const thumbKey = withExt(this.s3Key({ ...meta, prefix: meta.thumbnailPrefix }, path), thumbExt);
        result.thumbnailUrl = await signS3Url(credentials, 'GET', thumbKey);
      }

      return result;
    } catch (e) {
      if (e instanceof HandlerError) throw e;
      throw FSError.failed('write', path);
    }
  }

  async remove(meta: FSMeta, path: string): Promise<boolean> {
    const credentials = this.getCredentials();
    const res = await fetch(await signS3Request(credentials, 'DELETE', this.s3Key(meta, path)));
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) throw FSError.forbidden('remove', path);
      if (res.status === 404) throw FSError.notFound('remove', path);
      throw FSError.failed('remove', path);
    }
    return true;
  }

  async rmdir(meta: FSMeta, path: string, recursive?: boolean): Promise<boolean> {
    const credentials = this.getCredentials();
    const prefix = this.s3Key(meta, path);
    const dirPrefix = prefix.endsWith('/') ? prefix : `${prefix}/`;

    if (!recursive) {
      const res = await fetch(
        await signS3Request(credentials, 'GET', `?list-type=2&max-keys=2&prefix=${encodeURIComponent(dirPrefix)}`)
      );
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) throw FSError.forbidden('rmdir', path);
        throw FSError.failed('rmdir', path);
      }
      const keys = extractXmlElements(await res.text(), 'Key');
      if (keys.length > 1 || (keys.length === 1 && keys[0] !== dirPrefix)) {
        throw FSError.notEmpty('rmdir', path);
      }
      if (keys.length === 1 && keys[0] === dirPrefix) {
        await fetch(await signS3Request(credentials, 'DELETE', dirPrefix));
      }
      return true;
    }

    let isTruncated = true;
    let token = '';
    while (isTruncated) {
      let query = `?list-type=2&max-keys=${this.options.maxKeys || DEFAULT_MAX_KEYS}&prefix=${encodeURIComponent(dirPrefix)}`;
      if (token) query += `&continuation-token=${encodeURIComponent(token)}`;

      const res = await fetch(await signS3Request(credentials, 'GET', query));
      if (!res.ok) throw FSError.failed('rmdir (list)', path);
      const text = await res.text();
      const keys = extractXmlElements(text, 'Key');

      if (keys.length > 0) {
        const chunk = this.options.deleteChunkSize || DEFAULT_DELETE_CHUNK_SIZE;
        for (let i = 0; i < keys.length; i += chunk) {
          const reqs = await Promise.all(keys.slice(i, i + chunk).map((k) => signS3Request(credentials, 'DELETE', k)));
          await Promise.all(reqs.map((req) => fetch(req)));
        }
      }

      isTruncated = extractXmlElement(text, 'IsTruncated') === 'true';
      token = extractXmlElement(text, 'NextContinuationToken') || '';
    }
    return true;
  }

  async dir(meta: FSMeta, path?: string): Promise<FSFile[]> {
    const credentials = this.getCredentials();
    const prefix = path ? this.s3Key(meta, path) : this.s3Key(meta, '/');
    const dirPrefix = prefix.endsWith('/') ? prefix : `${prefix}/`;
    let query = `?list-type=2&delimiter=/&max-keys=${this.options.maxKeys || DEFAULT_MAX_KEYS}`;
    if (dirPrefix !== '/') query += `&prefix=${encodeURIComponent(dirPrefix)}`;

    const res = await fetch(await signS3Request(credentials, 'GET', query));
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) throw FSError.forbidden('dir', path || '/');
      throw FSError.failed('dir', path || '/');
    }

    const text = await res.text();
    const entries: FSFile[] = [];

    for (const dirPath of extractXmlElements(text, 'Prefix')) {
      if (dirPath === dirPrefix) continue;
      entries.push({
        path: this.stripPrefix(dirPath, meta),
        url: '',
        size: 0,
        type: 'directory',
        isDirectory: true,
        createdAt: 0,
        updatedAt: 0,
      });
    }

    const contents = extractXmlElements(text, 'Contents');
    for (const content of contents) {
      const key = extractXmlElement(content, 'Key');
      if (!key || key === dirPrefix) continue;
      const size = parseInt(extractXmlElement(content, 'Size') || '0', 10);
      entries.push({
        path: this.stripPrefix(key, meta),
        url: '',
        size,
        type: getFileExt(key),
        isDirectory: false,
        createdAt: 0,
        updatedAt: 0,
      });
    }

    return entries;
  }

  async mkdir(meta: FSMeta, path: string): Promise<FSFile> {
    const credentials = this.getCredentials();
    const key = this.s3Key(meta, path);
    const dirKey = key.endsWith('/') ? key : `${key}/`;
    await fetch(await signS3Url(credentials, 'PUT', dirKey), {
      method: 'PUT',
      headers: { 'Content-Length': '0' },
    });
    return {
      path: path.endsWith('/') ? path : `${path}/`,
      url: '',
      size: 0,
      type: 'directory',
      isDirectory: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  async stat(meta: FSMeta, path: string): Promise<FSFile> {
    const credentials = this.getCredentials();
    const key = this.s3Key(meta, path);
    const headRes = await fetch(await signS3Request(credentials, 'HEAD', key));
    if (headRes.status === 404) throw FSError.notFound('stat', path);
    if (!headRes.ok) throw FSError.failed('stat', path);
    const mime = headRes.headers.get('content-type') || '';
    return {
      path,
      url: '',
      size: parseInt(headRes.headers.get('content-length') || '0', 10),
      type: mime,
      isDirectory: false,
      createdAt: 0,
      updatedAt: 0,
    };
  }

  async move(meta: FSMeta, from: string, to: string, dstMeta?: FSMeta): Promise<FSFile> {
    const credentials = this.getCredentials();
    const srcKey = this.s3Key(meta, from);
    const dst = dstMeta || meta;
    const dstKey = this.s3Key(dst, to);

    const stat = await this.stat(meta, from);

    const res = await fetch(await signS3Url(credentials, 'PUT', dstKey), {
      method: 'PUT',
      headers: { 'x-amz-copy-source': `/${srcKey}` },
    });
    if (!res.ok) throw FSError.failed('move', from);
    await fetch(await signS3Request(credentials, 'DELETE', srcKey));

    return {
      path: to,
      url: await signS3Url(credentials, 'GET', dstKey),
      size: stat.size,
      type: stat.type,
      isDirectory: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  async copy(meta: FSMeta, from: string, to: string, dstMeta?: FSMeta): Promise<FSFile> {
    const credentials = this.getCredentials();
    const srcKey = this.s3Key(meta, from);
    const dst = dstMeta || meta;
    const dstKey = this.s3Key(dst, to);

    const stat = await this.stat(meta, from);

    const res = await fetch(await signS3Url(credentials, 'PUT', dstKey), {
      method: 'PUT',
      headers: { 'x-amz-copy-source': `/${srcKey}` },
    });
    if (!res.ok) throw FSError.failed('copy', from);

    return {
      path: to,
      url: await signS3Url(credentials, 'GET', dstKey),
      size: stat.size,
      type: stat.type,
      isDirectory: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  async exists(meta: FSMeta, path: string): Promise<boolean> {
    const credentials = this.getCredentials();
    const res = await fetch(await signS3Request(credentials, 'HEAD', this.s3Key(meta, path)));
    return res.ok;
  }
}
