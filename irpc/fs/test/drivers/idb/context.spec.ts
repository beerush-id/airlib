import { describe, expect, it } from 'vitest';
import { getIDBFSOptions, idbfs, setIDBFSOptions } from '../../../src/drivers/idb/context.js';

describe('IDB FS Context', () => {
  it('sets and gets IDB FS options', () => {
    const options = { dbName: 'db1', storeName: 's1' };
    setIDBFSOptions(options);
    expect(getIDBFSOptions()).toEqual(options);
  });

  it('idbfs returns a setter function', () => {
    const options = { dbName: 'db2', storeName: 's2' };
    const setter = idbfs(options);
    setter();
    expect(getIDBFSOptions()).toEqual(options);
  });
});
