import '@irpclib/irpc/server';
import { withIsolation } from '@anchorlib/core';
import { IRPCFile, type IRPCMeta } from '@irpclib/irpc';
import { beforeAll, describe, expect, it } from 'vitest';
import { setS3Credentials } from '../../../src/drivers/s3/context.js';
import { S3Driver } from '../../../src/drivers/s3/driver.js';

// Node/Bun automatically inject variables from .env into process.env
const endpoint = process.env.S3_ENDPOINT || '';
const accessKeyId = process.env.S3_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || '';
const region = process.env.S3_REGION || 'auto';

const isReady = !!endpoint && !!accessKeyId && !!secretAccessKey;

describe.skipIf(!isReady)('S3Driver Integration Test (Real S3/R2)', () => {
  let driver: S3Driver;
  const mockMeta = {} as IRPCMeta;
  const TEST_DIR = 'air-test-integration';

  beforeAll(() => {
    driver = new S3Driver();
  });

  const runWithContext = <T>(fn: () => Promise<T>) => {
    return withIsolation(async () => {
      setS3Credentials({ endpoint, accessKeyId, secretAccessKey, region });
      return await fn();
    });
  };

  it('writes a file', async () => {
    await runWithContext(async () => {
      const buffer = new TextEncoder().encode('integration test data').buffer;
      const file = new IRPCFile({ name: 'test.txt', type: 'txt', size: buffer.byteLength }, new Blob([buffer]));

      const writeResult = await driver.write(mockMeta, `${TEST_DIR}/test.txt`, file);
      expect(writeResult.path).toBe(`${TEST_DIR}/test.txt`);

      // A user expects the returned URL to be fully qualified, signed, and immediately usable for reading.
      expect(writeResult.url.startsWith('http')).toBe(true);
      expect(writeResult.url).toContain(endpoint);
      expect(writeResult.url).toContain('X-Amz-Signature=');

      const fetchRes = await fetch(writeResult.url);
      expect(fetchRes.ok).toBe(true);
      expect(await fetchRes.text()).toBe('integration test data');
    });
  });

  it('reads the file and generates a valid signed URL', async () => {
    await runWithContext(async () => {
      const readResult = await driver.read(mockMeta, `${TEST_DIR}/test.txt`);
      expect(readResult.path).toBe(`${TEST_DIR}/test.txt`);

      expect(readResult.url.startsWith('http')).toBe(true);
      expect(readResult.url).toContain(endpoint);
      expect(readResult.url).toContain('X-Amz-Signature=');

      const fetchRes = await fetch(readResult.url);
      expect(fetchRes.ok).toBe(true);
      const text = await fetchRes.text();
      expect(text).toBe('integration test data');
    });
  });

  it('writes a second file in a subdirectory', async () => {
    await runWithContext(async () => {
      const file2 = new IRPCFile({ name: 'sub.txt', type: 'txt', size: 3 }, new Blob(['sub']));
      await driver.write(mockMeta, `${TEST_DIR}/sub/sub.txt`, file2);
    });
  });

  it('lists the directory contents', async () => {
    await runWithContext(async () => {
      const dirResult = await driver.dir(mockMeta, `${TEST_DIR}/`);
      expect(dirResult.length).toBeGreaterThanOrEqual(2);

      const hasSubDir = dirResult.some((f) => f.isDirectory && f.path === `${TEST_DIR}/sub/`);
      const testFile = dirResult.find((f) => !f.isDirectory && f.path === `${TEST_DIR}/test.txt`);

      expect(hasSubDir).toBe(true);
      expect(testFile).toBeDefined();
    });
  });

  it('removes a specific file', async () => {
    await runWithContext(async () => {
      const rmResult = await driver.remove(mockMeta, `${TEST_DIR}/test.txt`);
      expect(rmResult).toBe(true);
    });
  });

  it('removes the directory recursively', async () => {
    await runWithContext(async () => {
      const rmdirResult = await driver.rmdir(mockMeta, `${TEST_DIR}/`, true);
      expect(rmdirResult).toBe(true);
    });
  });

  it('verifies the directory is empty', async () => {
    await runWithContext(async () => {
      const emptyDirResult = await driver.dir(mockMeta, `${TEST_DIR}/`);
      expect(emptyDirResult.length).toBe(0);
    });
  });
});
