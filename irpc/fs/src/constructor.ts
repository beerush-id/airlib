import { FSAdapter } from './adapter.js';
import { fs, fsModule } from './index.js';

export { type FSConfig, getFSConfig, setFSConfig } from './context.ts';

/**
 * The default, pre-configured instance of the IRPC filesystem adapter.
 * It is automatically attached to the filesystem stubs.
 */
export const adapter = new FSAdapter(fsModule);
adapter.attach(fs);
