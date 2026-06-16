import { getContext, setContext } from '@irpclib/irpc';

/**
 * Configuration options for the filesystem.
 */
export interface FSConfig {
  /** The root directory for relative path resolution to sandbox operations (e.g. '/uploads') */
  rootPath?: string;
  /** Whether to prevent write, remove, and rmdir operations */
  readOnly?: boolean;
  /** The maximum allowed file size in bytes for write operations */
  maxFileSize?: number;
  /** A list of allowed MIME types for write operations */
  allowedTypes?: string[];
}

/**
 * Symbol used to extract the filesystem environment configuration from the IRPC context.
 */
export const FS_CONFIG = Symbol('FS_CONFIG');

export const DEFAULT_FS_CONFIG: FSConfig = {
  rootPath: '',
  readOnly: false,
  maxFileSize: 0,
  allowedTypes: [],
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
