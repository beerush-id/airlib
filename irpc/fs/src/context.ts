import { getContext, setContext } from '@irpclib/irpc';

/**
 * Configuration options for the filesystem.
 */
export interface FSConfig {
  rootPath?: string;
  pathPrefix?: string;
  thumbnailPrefix?: string;
  readOnly?: boolean;
  maxFileSize?: number;
  allowedTypes?: string[];
}

/**
 * Symbol used to extract the filesystem environment configuration from the IRPC context.
 */
export const FS_CONFIG = Symbol('FS_CONFIG');

export const DEFAULT_FS_CONFIG: FSConfig = {
  rootPath: '',
  pathPrefix: 'raw',
  thumbnailPrefix: 'thb',
  readOnly: false,
};

/**
 * Retrieves the filesystem configuration from the current IRPC context.
 */
export function getFSConfig(): FSConfig {
  return getContext<FSConfig>(FS_CONFIG) || DEFAULT_FS_CONFIG;
}

/**
 * Injects filesystem configuration into the current IRPC context.
 */
export function setFSConfig(config: Partial<FSConfig>) {
  setContext(FS_CONFIG, { ...DEFAULT_FS_CONFIG, ...config });
}
