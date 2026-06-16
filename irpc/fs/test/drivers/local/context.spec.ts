import { describe, expect, it } from 'vitest';
import { getLocalFSOptions, localfs, setLocalFSOptions } from '../../../src/drivers/local/context.js';

describe('Local FS Context', () => {
  it('sets and gets local FS options', () => {
    const options = { baseDir: '/tmp', publicUrl: 'http://localhost' };
    setLocalFSOptions(options);
    expect(getLocalFSOptions()).toEqual(options);
  });

  it('localfs returns a setter function', () => {
    const options = { baseDir: '/tmp2', publicUrl: 'http://localhost2' };
    const setter = localfs(options);
    setter();
    expect(getLocalFSOptions()).toEqual(options);
  });
});
