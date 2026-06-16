import { withIsolation } from '@anchorlib/core';
import { IRPCFile, type IRPCMeta } from '@irpclib/irpc';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getS3Credentials, setS3Credentials } from '../../../src/drivers/s3/context.js';
import { S3Driver } from '../../../src/drivers/s3/driver.js';
import { s3credentials } from '../../../src/drivers/s3/index.js';

describe('S3Driver', () => {
  let driver: S3Driver;
  const mockMeta = {} as IRPCMeta;

  const mockCreds = {
    endpoint: 'https://s3.example.com',
    accessKeyId: 'test-key',
    secretAccessKey: 'test-secret',
    region: 'us-east-1',
  };

  const runWithContext = <T>(fn: () => Promise<T>) => {
    return withIsolation(async () => {
      setS3Credentials(mockCreds);
      return await fn();
    });
  };

  beforeEach(() => {
    driver = new S3Driver();
    global.fetch = vi.fn();
  });

  describe('read', () => {
    it('returns a valid FSFile with a signed URL', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(new Response(null, { status: 200 }));
      await runWithContext(async () => {
        const file = await driver.read(mockMeta, 'path/to/file.txt');
        expect(file.path).toBe('path/to/file.txt');
        expect(file.type).toBe('txt');
        expect(file.url).toContain('https://s3.example.com/path/to/file.txt');
        expect(file.url).toContain('X-Amz-Signature=');
      });
    });

    it('throws HandlerError when credentials are missing', async () => {
      await withIsolation(async () => {
        await expect(driver.read(mockMeta, 'path/to/file.txt')).rejects.toThrowError(/permission denied/);
      });
    });

    it('throws FSError.forbidden on 401 response', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(new Response(null, { status: 401 }));
      await runWithContext(async () => {
        await expect(driver.read(mockMeta, 'path/to/file.txt')).rejects.toThrowError(/permission denied/);
      });
    });

    it('throws FSError.forbidden on 403 response', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(new Response(null, { status: 403 }));
      await runWithContext(async () => {
        await expect(driver.read(mockMeta, 'path/to/file.txt')).rejects.toThrowError(/permission denied/);
      });
    });

    it('throws FSError.notFound on 404 response', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(new Response(null, { status: 404 }));
      await runWithContext(async () => {
        await expect(driver.read(mockMeta, 'path/to/file.txt')).rejects.toThrowError(/no such file or directory/);
      });
    });

    it('throws FSError.failed on 500 response', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(new Response(null, { status: 500 }));
      await runWithContext(async () => {
        await expect(driver.read(mockMeta, 'path/to/file.txt')).rejects.toThrowError(/operation failed/);
      });
    });

    it('defaults to auto region if not provided in credentials', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(new Response(null, { status: 200 }));
      await runWithContext(async () => {
        setS3Credentials({
          endpoint: 'https://s3.example.com',
          accessKeyId: 'test-key',
          secretAccessKey: 'test-secret',
        });
        const file = await driver.read(mockMeta, 'path/to/file.txt');
        expect(file.url).toContain('%2Fauto%2Fs3%2Faws4_request');
      });
    });
  });

  describe('write', () => {
    it('sends a PUT request with the file data and returns the updated file', async () => {
      const mockResponse = new Response(null, { status: 200 });
      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      await runWithContext(async () => {
        const buffer = new TextEncoder().encode('hello world').buffer;
        const file = new IRPCFile({ name: 'file.txt', type: 'txt', size: 11 }, new Blob([buffer]));

        const result = await driver.write(mockMeta, 'path/to/file.txt', file);

        expect(global.fetch).toHaveBeenCalledTimes(1);
        const callArgs = vi.mocked(global.fetch).mock.calls[0];

        expect(callArgs[0]).toContain('https://s3.example.com/path/to/file.txt');
        expect((callArgs[1] as RequestInit).method).toBe('PUT');
        expect((callArgs[1] as RequestInit).headers).toEqual({ 'Content-Type': 'text/plain' });

        expect(result.path).toBe('path/to/file.txt');
        expect(result.size).toBe(11);
        expect(result.type).toBe('txt');
      });
    });

    it('falls back to application/octet-stream if file type is not provided', async () => {
      const mockResponse = new Response(null, { status: 200 });
      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      await runWithContext(async () => {
        const file = new IRPCFile({ name: 'file.bin', size: 0 } as any, new Blob([]));
        const result = await driver.write(mockMeta, 'file.bin', file);
        expect(result.type).toBe('bin');
      });
    });

    it('throws FSError.forbidden if the upload fails with 401', async () => {
      const mockResponse = new Response(null, { status: 401, statusText: 'Unauthorized' });
      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      await runWithContext(async () => {
        const file = new IRPCFile({ name: 'file.txt', type: 'txt', size: 0 }, new Blob([new ArrayBuffer(0)]));
        await expect(driver.write(mockMeta, 'path/to/file.txt', file)).rejects.toThrowError(/permission denied/);
      });
    });

    it('throws FSError.forbidden if the upload fails with 403', async () => {
      const mockResponse = new Response(null, { status: 403, statusText: 'Forbidden' });
      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      await runWithContext(async () => {
        const file = new IRPCFile({ name: 'file.txt', type: 'txt', size: 0 }, new Blob([new ArrayBuffer(0)]));
        await expect(driver.write(mockMeta, 'path/to/file.txt', file)).rejects.toThrowError(/permission denied/);
      });
    });

    it('throws FSError.notFound if the upload fails with 404', async () => {
      const mockResponse = new Response(null, { status: 404, statusText: 'Not Found' });
      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      await runWithContext(async () => {
        const file = new IRPCFile({ name: 'file.txt', type: 'txt', size: 0 }, new Blob([new ArrayBuffer(0)]));
        await expect(driver.write(mockMeta, 'path/to/file.txt', file)).rejects.toThrowError(
          /no such file or directory/
        );
      });
    });

    it('throws FSError.failed if the upload fails with 500', async () => {
      const mockResponse = new Response(null, { status: 500, statusText: 'Server Error' });
      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      await runWithContext(async () => {
        const file = new IRPCFile({ name: 'file.txt', type: 'txt', size: 0 }, new Blob([new ArrayBuffer(0)]));
        await expect(driver.write(mockMeta, 'path/to/file.txt', file)).rejects.toThrowError(/operation failed/);
      });
    });
  });

  describe('remove', () => {
    it('sends a DELETE request to S3', async () => {
      const mockResponse = new Response(null, { status: 200 });
      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      await runWithContext(async () => {
        const result = await driver.remove(mockMeta, 'path/to/file.txt');
        expect(result).toBe(true);

        expect(global.fetch).toHaveBeenCalledTimes(1);
        const req = vi.mocked(global.fetch).mock.calls[0][0] as Request;
        expect(req.method).toBe('DELETE');
        expect(req.url).toContain('https://s3.example.com/path/to/file.txt');
      });
    });

    it('throws FSError.forbidden if the remove fails with 401', async () => {
      const mockResponse = new Response(null, { status: 401, statusText: 'Unauthorized' });
      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      await runWithContext(async () => {
        await expect(driver.remove(mockMeta, 'path/to/file.txt')).rejects.toThrowError(/permission denied/);
      });
    });

    it('throws FSError.forbidden if the remove fails with 403', async () => {
      const mockResponse = new Response(null, { status: 403, statusText: 'Forbidden' });
      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      await runWithContext(async () => {
        await expect(driver.remove(mockMeta, 'path/to/file.txt')).rejects.toThrowError(/permission denied/);
      });
    });

    it('throws FSError.notFound if the remove fails with 404', async () => {
      const mockResponse = new Response(null, { status: 404, statusText: 'Not Found' });
      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      await runWithContext(async () => {
        await expect(driver.remove(mockMeta, 'path/to/file.txt')).rejects.toThrowError(/no such file or directory/);
      });
    });

    it('throws FSError.failed if the remove fails with 500', async () => {
      const mockResponse = new Response(null, { status: 500, statusText: 'Server Error' });
      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      await runWithContext(async () => {
        await expect(driver.remove(mockMeta, 'path/to/file.txt')).rejects.toThrowError(/operation failed/);
      });
    });
  });

  describe('rmdir', () => {
    it('throws if directory is not empty and recursive is false', async () => {
      const mockListXml = `
        <ListBucketResult>
          <Key>path/to/dir/file1.txt</Key>
          <Key>path/to/dir/file2.txt</Key>
        </ListBucketResult>
      `;
      const mockResponse = new Response(mockListXml, { status: 200 });
      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      await runWithContext(async () => {
        await expect(driver.rmdir(mockMeta, 'path/to/dir')).rejects.toThrowError(/directory not empty/);
      });
    });

    it('throws FSError.forbidden if rmdir check fails with 401', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(new Response(null, { status: 401 }));
      await runWithContext(async () => {
        await expect(driver.rmdir(mockMeta, 'path/to/dir')).rejects.toThrowError(/permission denied/);
      });
    });

    it('throws FSError.forbidden if rmdir check fails with 403', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(new Response(null, { status: 403 }));
      await runWithContext(async () => {
        await expect(driver.rmdir(mockMeta, 'path/to/dir')).rejects.toThrowError(/permission denied/);
      });
    });

    it('throws FSError.notFound if rmdir check fails with 404', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(new Response(null, { status: 404 }));
      await runWithContext(async () => {
        await expect(driver.rmdir(mockMeta, 'path/to/dir')).rejects.toThrowError(/no such file or directory/);
      });
    });

    it('throws HandlerError if rmdir check list request fails', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(
        new Response(null, { status: 500, statusText: 'Internal Server Error' })
      );
      await runWithContext(async () => {
        await expect(driver.rmdir(mockMeta, 'path/to/dir')).rejects.toThrowError(/operation failed/);
      });
    });

    it('recursively deletes all objects when recursive is true', async () => {
      const mockListXml = `
        <ListBucketResult>
          <IsTruncated>false</IsTruncated>
          <Key>path/to/dir/file1.txt</Key>
          <Key>path/to/dir/file2.txt</Key>
        </ListBucketResult>
      `;
      const mockListResponse = new Response(mockListXml, { status: 200 });
      const mockDeleteResponse = new Response(null, { status: 200 });

      vi.mocked(global.fetch)
        .mockResolvedValueOnce(mockListResponse) // For list query
        .mockResolvedValue(mockDeleteResponse); // For subsequent deletes

      await runWithContext(async () => {
        const result = await driver.rmdir(mockMeta, 'path/to/dir', true);
        expect(result).toBe(true);
        // 1 list + 2 deletes
        expect(global.fetch).toHaveBeenCalledTimes(3);
      });
    });

    it('removes exactly one empty directory marker if non-recursive', async () => {
      const mockListXml = `
        <ListBucketResult>
          <Key>path/to/dir/</Key>
        </ListBucketResult>
      `;
      const mockListResponse = new Response(mockListXml, { status: 200 });
      const mockDeleteResponse = new Response(null, { status: 200 });

      vi.mocked(global.fetch).mockResolvedValueOnce(mockListResponse).mockResolvedValue(mockDeleteResponse);

      await runWithContext(async () => {
        const result = await driver.rmdir(mockMeta, 'path/to/dir');
        expect(result).toBe(true);
        expect(global.fetch).toHaveBeenCalledTimes(2); // List + Delete
      });
    });

    it('returns true if directory is already empty in non-recursive mode', async () => {
      const mockListXml = `<ListBucketResult></ListBucketResult>`;
      vi.mocked(global.fetch).mockResolvedValueOnce(new Response(mockListXml, { status: 200 }));

      await runWithContext(async () => {
        const result = await driver.rmdir(mockMeta, 'path/to/dir');
        expect(result).toBe(true);
        expect(global.fetch).toHaveBeenCalledTimes(1); // Only List, no Delete
      });
    });

    it('handles paths that already end with a slash', async () => {
      const mockListXml = `<ListBucketResult></ListBucketResult>`;
      vi.mocked(global.fetch).mockResolvedValueOnce(new Response(mockListXml, { status: 200 }));

      await runWithContext(async () => {
        const result = await driver.rmdir(mockMeta, 'path/to/dir/');
        expect(result).toBe(true);
      });
    });

    it('handles pagination with continuation tokens in recursive mode', async () => {
      const mockPage1Xml = `
        <ListBucketResult>
          <IsTruncated>true</IsTruncated>
          <NextContinuationToken>token-123</NextContinuationToken>
          <Key>path/to/dir/file1.txt</Key>
        </ListBucketResult>
      `;
      const mockPage2Xml = `
        <ListBucketResult>
          <IsTruncated>false</IsTruncated>
          <Key>path/to/dir/file2.txt</Key>
        </ListBucketResult>
      `;

      vi.mocked(global.fetch)
        .mockResolvedValueOnce(new Response(mockPage1Xml, { status: 200 }))
        .mockResolvedValueOnce(new Response(null, { status: 200 }))
        .mockResolvedValueOnce(new Response(mockPage2Xml, { status: 200 }))
        .mockResolvedValue(new Response(null, { status: 200 }));

      await runWithContext(async () => {
        const result = await driver.rmdir(mockMeta, 'path/to/dir', true);
        expect(result).toBe(true);
        expect(global.fetch).toHaveBeenCalledTimes(4); // List 1 + Delete 1 + List 2 + Delete 2
      });
    });

    it('throws FSError.forbidden if rmdir recursive list fails with 401', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(new Response(null, { status: 401 }));
      await runWithContext(async () => {
        await expect(driver.rmdir(mockMeta, 'path/to/dir', true)).rejects.toThrowError(/permission denied/);
      });
    });

    it('throws FSError.forbidden if rmdir recursive list fails with 403', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(new Response(null, { status: 403 }));
      await runWithContext(async () => {
        await expect(driver.rmdir(mockMeta, 'path/to/dir', true)).rejects.toThrowError(/permission denied/);
      });
    });

    it('throws FSError.notFound if rmdir recursive list fails with 404', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(new Response(null, { status: 404 }));
      await runWithContext(async () => {
        await expect(driver.rmdir(mockMeta, 'path/to/dir', true)).rejects.toThrowError(/no such file or directory/);
      });
    });

    it('throws HandlerError if rmdir recursive list request fails', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(
        new Response(null, { status: 500, statusText: 'Internal Server Error' })
      );
      await runWithContext(async () => {
        await expect(driver.rmdir(mockMeta, 'path/to/dir', true)).rejects.toThrowError(/operation failed/);
      });
    });

    it('handles missing IsTruncated tag in recursive mode', async () => {
      const mockListXml = `
        <ListBucketResult>
          <Key>path/to/dir/file.txt</Key>
        </ListBucketResult>
      `;
      vi.mocked(global.fetch)
        .mockResolvedValueOnce(new Response(mockListXml, { status: 200 }))
        .mockResolvedValueOnce(new Response(null, { status: 200 }));

      await runWithContext(async () => {
        const result = await driver.rmdir(mockMeta, 'path/to/dir', true);
        expect(result).toBe(true);
      });
    });

    it('handles missing NextContinuationToken when IsTruncated is true', async () => {
      const mockPage1Xml = `
        <ListBucketResult>
          <IsTruncated>true</IsTruncated>
          <Key>path/to/dir/file1.txt</Key>
        </ListBucketResult>
      `;
      const mockPage2Xml = `<ListBucketResult></ListBucketResult>`;

      vi.mocked(global.fetch)
        .mockResolvedValueOnce(new Response(mockPage1Xml, { status: 200 }))
        .mockResolvedValueOnce(new Response(null, { status: 200 }))
        .mockResolvedValueOnce(new Response(mockPage2Xml, { status: 200 }));

      await runWithContext(async () => {
        const result = await driver.rmdir(mockMeta, 'path/to/dir', true);
        expect(result).toBe(true);
      });
    });
  });

  describe('dir', () => {
    it('parses S3 list-type=2 XML into FSFile array', async () => {
      const mockListXml = `
        <ListBucketResult>
          <CommonPrefixes>
            <Prefix>path/to/dir/subdir/</Prefix>
          </CommonPrefixes>
          <Contents></Contents>
          <Contents>
            <Key>path/to/dir/file1.txt</Key>
            <Size>1234</Size>
          </Contents>
        </ListBucketResult>
      `;
      const mockResponse = new Response(mockListXml, { status: 200 });
      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      await runWithContext(async () => {
        const results = await driver.dir(mockMeta, 'path/to/dir');

        expect(results).toHaveLength(2);

        const dir = results.find((r) => r.isDirectory);
        expect(dir?.path).toBe('path/to/dir/subdir/');

        const file = results.find((r) => !r.isDirectory);
        expect(file?.path).toBe('path/to/dir/file1.txt');
        expect(file?.size).toBe(1234);
        expect(file?.type).toBe('txt');
      });
    });

    it('skips the exact directory prefix key if it is returned in the list', async () => {
      const mockListXml = `
        <ListBucketResult>
          <Contents>
            <Key>path/to/dir/</Key>
          </Contents>
          <Contents>
            <Key>path/to/dir/file1.txt</Key>
          </Contents>
        </ListBucketResult>
      `;
      vi.mocked(global.fetch).mockResolvedValueOnce(new Response(mockListXml, { status: 200 }));

      await runWithContext(async () => {
        const results = await driver.dir(mockMeta, 'path/to/dir/');
        expect(results).toHaveLength(1);
        expect(results[0].path).toBe('path/to/dir/file1.txt');
      });
    });

    it('breaks safely when Prefix tag is missing', async () => {
      const mockListXml = `
        <ListBucketResult>
          <CommonPrefixes>
            badprefix
          </CommonPrefixes>
        </ListBucketResult>
      `;
      vi.mocked(global.fetch).mockResolvedValueOnce(new Response(mockListXml, { status: 200 }));
      await runWithContext(async () => {
        const results = await driver.dir(mockMeta, 'path/to/dir');
        expect(results).toHaveLength(0);
      });
    });

    it('breaks safely when Prefix closing tag is missing', async () => {
      const mockListXml = `
        <ListBucketResult>
          <CommonPrefixes>
            <Prefix>path/to/dir/subdir/
          </CommonPrefixes>
        </ListBucketResult>
      `;
      vi.mocked(global.fetch).mockResolvedValueOnce(new Response(mockListXml, { status: 200 }));
      await runWithContext(async () => {
        const results = await driver.dir(mockMeta, 'path/to/dir');
        expect(results).toHaveLength(0);
      });
    });

    it('breaks safely when Contents closing tag is missing', async () => {
      const mockListXml = `
        <ListBucketResult>
          <Contents>
            <Key>path/to/dir/file1.txt</Key>
        </ListBucketResult>
      `;
      vi.mocked(global.fetch).mockResolvedValueOnce(new Response(mockListXml, { status: 200 }));
      await runWithContext(async () => {
        const results = await driver.dir(mockMeta, 'path/to/dir');
        expect(results).toHaveLength(0);
      });
    });

    it('breaks safely when Key tag is missing', async () => {
      const mockListXml = `
        <ListBucketResult>
          <Contents>
            badkey
          </Contents>
        </ListBucketResult>
      `;
      vi.mocked(global.fetch).mockResolvedValueOnce(new Response(mockListXml, { status: 200 }));
      await runWithContext(async () => {
        const results = await driver.dir(mockMeta, 'path/to/dir');
        expect(results).toHaveLength(0);
      });
    });

    it('breaks safely when Key closing tag is missing', async () => {
      const mockListXml = `
        <ListBucketResult>
          <Contents>
            <Key>path/to/dir/file1.txt
          </Contents>
        </ListBucketResult>
      `;
      vi.mocked(global.fetch).mockResolvedValueOnce(new Response(mockListXml, { status: 200 }));
      await runWithContext(async () => {
        const results = await driver.dir(mockMeta, 'path/to/dir');
        expect(results).toHaveLength(0);
      });
    });

    it('falls back to size 0 when Size is invalid', async () => {
      const mockListXml = `
        <ListBucketResult>
          <Contents>
            <Key>path/to/dir/file2.txt</Key>
            <Size>invalid</Size>
          </Contents>
        </ListBucketResult>
      `;
      vi.mocked(global.fetch).mockResolvedValueOnce(new Response(mockListXml, { status: 200 }));
      await runWithContext(async () => {
        const results = await driver.dir(mockMeta, 'path/to/dir');
        expect(results).toHaveLength(1);
        expect(results[0].size).toBe(0);
      });
    });

    it('throws FSError.forbidden if dir request fails with 401', async () => {
      const mockResponse = new Response(null, { status: 401, statusText: 'Unauthorized' });
      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      await runWithContext(async () => {
        await expect(driver.dir(mockMeta)).rejects.toThrowError(/permission denied/);
      });
    });

    it('throws FSError.forbidden if dir request fails with 403', async () => {
      const mockResponse = new Response(null, { status: 403, statusText: 'Forbidden' });
      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      await runWithContext(async () => {
        await expect(driver.dir(mockMeta, 'path/to/dir')).rejects.toThrowError(/permission denied/);
      });
    });

    it('throws FSError.notFound if dir request fails with 404', async () => {
      const mockResponse = new Response(null, { status: 404, statusText: 'Not Found' });
      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      await runWithContext(async () => {
        await expect(driver.dir(mockMeta)).rejects.toThrowError(/no such file or directory/);
      });
    });

    it('throws FSError.failed if dir request fails with 500', async () => {
      const mockResponse = new Response(null, { status: 500, statusText: 'Server Error' });
      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      await runWithContext(async () => {
        await expect(driver.dir(mockMeta)).rejects.toThrowError(/operation failed/);
      });
    });
  });

  describe('s3credentials hook', () => {
    it('sets S3 credentials in the context', async () => {
      const hookFn = s3credentials(mockCreds);
      await withIsolation(async () => {
        hookFn();
        expect(getS3Credentials()).toEqual(mockCreds);
      });
    });
  });
});
