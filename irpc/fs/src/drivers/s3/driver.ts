import { HandlerError, type IRPCDriver, type IRPCFile, type IRPCMeta } from '@irpclib/irpc';
import type { FSAdapter } from '../../adapter.js';
import { FSError } from '../../error.js';
import type { FSEntry, FSFile } from '../../index.js';
import { getFileExt, getFileType, getMimeType } from '../../utils.js';
import { getS3Credentials } from './context.js';
import { signS3Request, signS3Url } from './signer.js';

const DEFAULT_MAX_KEYS = 100;
const DEFAULT_DELETE_CHUNK_SIZE = 10;

export interface S3DriverOptions {
  /** Maximum number of keys to fetch per list request (default: 100) */
  maxKeys?: number;
  /** Number of concurrent delete requests during recursive rmdir (default: 10) */
  deleteChunkSize?: number;
}

/**
 * AWS S3 driver implementation for the IRPC filesystem adapter.
 * Uses AWS Signature Version 4 for direct REST API communication without external SDKs.
 */
export class S3Driver implements IRPCDriver<FSAdapter> {
  constructor(public options: S3DriverOptions = {}) {}

  private getCredentials() {
    const credentials = getS3Credentials();
    if (!credentials?.endpoint || !credentials?.accessKeyId || !credentials?.secretAccessKey) {
      throw FSError.forbidden('authenticate');
    }
    return credentials;
  }

  /**
   * Reads a file from S3 and returns its actual metadata along with a downloadable signed URL.
   *
   * @param _meta - IRPC request metadata.
   * @param path - The S3 object key to read.
   * @returns A promise resolving to the FSFile representation.
   */
  async read(_meta: IRPCMeta, path: string): Promise<FSFile> {
    const credentials = this.getCredentials();

    const headReq = await signS3Request(credentials, 'HEAD', path);
    const headRes = await fetch(headReq);

    if (!headRes.ok) {
      if (headRes.status === 401 || headRes.status === 403) throw FSError.forbidden('read', path);
      if (headRes.status === 404) throw FSError.notFound('read', path);
      throw FSError.failed('read', path);
    }

    const size = parseInt(headRes.headers.get('content-length') || '0', 10);
    const mimeType = headRes.headers.get('content-type') || '';
    const type = getFileType(mimeType, getFileExt(path));

    const url = await signS3Url(credentials, 'GET', path);

    return {
      path,
      url,
      size,
      type,
      isDirectory: false,
    };
  }

  /**
   * Writes a file to S3 using a streaming PUT request.
   *
   * @param _meta - IRPC request metadata.
   * @param path - The destination S3 object key.
   * @param file - The file data to write.
   * @returns A promise resolving to the updated FSFile.
   */
  async write(_meta: IRPCMeta, path: string, file: IRPCFile): Promise<FSFile> {
    const credentials = this.getCredentials();
    const url = await signS3Url(credentials, 'PUT', path);
    const buffer = await file.data.arrayBuffer();

    const fileType = file.meta.type || getFileExt(path);
    const mimeType = getMimeType(fileType);

    const response = await fetch(url, {
      method: 'PUT',
      body: buffer,
      headers: {
        'Content-Type': mimeType,
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) throw FSError.forbidden('write', path);
      if (response.status === 404) throw FSError.notFound('write', path);
      throw FSError.failed('write', path);
    }

    const readUrl = await signS3Url(credentials, 'GET', path);

    return {
      path,
      url: readUrl,
      size: file.meta.size,
      type: fileType,
      isDirectory: false,
    };
  }

  /**
   * Removes a specific object from S3.
   *
   * @param _meta - IRPC request metadata.
   * @param path - The S3 object key to remove.
   * @param _credentials - Optional pre-resolved credentials (used internally).
   * @returns A promise resolving to true on success.
   */
  async remove(_meta: IRPCMeta, path: string, _credentials?: any): Promise<boolean> {
    const credentials = _credentials || this.getCredentials();
    const req = await signS3Request(credentials, 'DELETE', path);
    const response = await fetch(req);

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) throw FSError.forbidden('remove', path);
      if (response.status === 404) throw FSError.notFound('remove', path);
      throw FSError.failed('remove', path);
    }

    return true;
  }

  /**
   * Removes a directory from S3 by prefix.
   * Supports both empty-check validation and forced recursive deletion.
   *
   * @param _meta - IRPC request metadata.
   * @param path - The directory prefix to remove.
   * @param recursive - If true, recursively deletes all objects under the prefix.
   * @returns A promise resolving to true on success.
   * @throws {HandlerError} If the directory is not empty and recursive is false.
   */
  async rmdir(_meta: IRPCMeta, path: string, recursive?: boolean): Promise<boolean> {
    const credentials = this.getCredentials();
    const prefix = path.endsWith('/') ? path : `${path}/`;

    if (!recursive) {
      const query = `?list-type=2&max-keys=2&prefix=${encodeURIComponent(prefix)}`;
      const req = await signS3Request(credentials, 'GET', query);
      const res = await fetch(req);
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) throw FSError.forbidden('rmdir (check)', path);
        if (res.status === 404) throw FSError.notFound('rmdir (check)', path);
        throw FSError.failed('rmdir (check)', path);
      }

      const text = await res.text();
      const keys: string[] = [];
      const keyRegex = /<Key>([^<]+)<\/Key>/g;
      let match: RegExpExecArray | null;
      while ((match = keyRegex.exec(text)) !== null) {
        keys.push(match[1]);
      }

      if (keys.length > 1 || (keys.length === 1 && keys[0] !== prefix)) {
        throw FSError.notEmpty('rmdir', path);
      }

      if (keys.length === 1 && keys[0] === prefix) {
        return this.remove(_meta, prefix, credentials);
      }
      return true;
    }

    let isTruncated = true;
    let continuationToken = '';

    while (isTruncated) {
      const maxKeys = this.options.maxKeys || DEFAULT_MAX_KEYS;
      let query = `?list-type=2&max-keys=${maxKeys}&prefix=${encodeURIComponent(prefix)}`;
      if (continuationToken) {
        query += `&continuation-token=${encodeURIComponent(continuationToken)}`;
      }

      const req = await signS3Request(credentials, 'GET', query);
      const res = await fetch(req);
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) throw FSError.forbidden('rmdir (list)', path);
        if (res.status === 404) throw FSError.notFound('rmdir (list)', path);
        throw FSError.failed('rmdir (list)', path);
      }

      const text = await res.text();
      const keys: string[] = [];
      const keyRegex = /<Key>([^<]+)<\/Key>/g;
      let match: RegExpExecArray | null;

      while ((match = keyRegex.exec(text)) !== null) {
        keys.push(match[1]);
      }

      if (keys.length > 0) {
        const chunkSize = this.options.deleteChunkSize || DEFAULT_DELETE_CHUNK_SIZE;
        for (let i = 0; i < keys.length; i += chunkSize) {
          const chunk = keys.slice(i, i + chunkSize);
          await Promise.all(chunk.map((k) => this.remove(_meta, k, credentials)));
        }
      }

      const truncMatch = /<IsTruncated>(true|false)<\/IsTruncated>/.exec(text);
      isTruncated = truncMatch ? truncMatch[1] === 'true' : false;

      if (isTruncated) {
        const tokenMatch = /<NextContinuationToken>([^<]+)<\/NextContinuationToken>/.exec(text);
        continuationToken = tokenMatch ? tokenMatch[1] : '';
      }
    }

    return true;
  }

  /**
   * Lists files and directories under a specific S3 prefix.
   * Emulates traditional filesystem directory listings using S3 list-type=2.
   *
   * @param _meta - IRPC request metadata.
   * @param path - The directory prefix to list (optional).
   * @returns A promise resolving to an array of FSFiles representing the directory contents.
   */
  async dir(_meta: IRPCMeta, path?: string): Promise<FSEntry[]> {
    const credentials = this.getCredentials();
    const maxKeys = this.options.maxKeys || DEFAULT_MAX_KEYS;
    let query = `?list-type=2&delimiter=/&max-keys=${maxKeys}`;
    if (path) {
      query += `&prefix=${encodeURIComponent(path)}`;
    }

    const req = await signS3Request(credentials, 'GET', query);
    const response = await fetch(req);

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) throw FSError.forbidden('dir', path || '/');
      if (response.status === 404) throw FSError.notFound('dir', path || '/');
      throw FSError.failed('dir', path || '/');
    }

    const text = await response.text();
    const entries: FSEntry[] = [];

    let start = 0;
    while ((start = text.indexOf('<CommonPrefixes>', start)) !== -1) {
      const pStart = text.indexOf('<Prefix>', start);
      if (pStart === -1) break;
      const pEnd = text.indexOf('</Prefix>', pStart);
      if (pEnd === -1) break;

      const dirPath = text.substring(pStart + 8, pEnd);
      entries.push({
        path: dirPath,
        size: 0,
        type: 'directory',
        isDirectory: true,
      });
      start = pEnd;
    }

    start = 0;
    while ((start = text.indexOf('<Contents>', start)) !== -1) {
      const endTag = text.indexOf('</Contents>', start);
      if (endTag === -1) break;

      const kStart = text.indexOf('<Key>', start);
      if (kStart === -1 || kStart > endTag) {
        start = endTag;
        continue;
      }
      const kEnd = text.indexOf('</Key>', kStart);
      if (kEnd === -1) break;

      const filePath = text.substring(kStart + 5, kEnd);
      if (filePath === path) {
        start = endTag;
        continue;
      }

      const sStart = text.indexOf('<Size>', start);
      let size = 0;
      if (sStart !== -1 && sStart < endTag) {
        const sEnd = text.indexOf('</Size>', sStart);
        if (sEnd !== -1) {
          size = parseInt(text.substring(sStart + 6, sEnd), 10) || 0;
        }
      }

      entries.push({
        path: filePath,
        size,
        type: getFileExt(filePath),
        isDirectory: false,
      });

      start = endTag;
    }

    return entries;
  }
}
