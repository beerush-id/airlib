import { HandlerError } from '@irpclib/irpc';

/**
 * Standard filesystem error wrapper that provides consistent
 * POSIX-style HandlerError instances across all drivers.
 */
export class FSError extends HandlerError {
  static forbidden(action: string, path?: string) {
    return HandlerError.failed(`Forbidden: permission denied, ${action}${path ? ` '${path}'` : ''}`);
  }

  static notFound(action: string, path?: string) {
    return HandlerError.failed(`NotFound: no such file or directory, ${action}${path ? ` '${path}'` : ''}`);
  }

  static failed(action: string, path?: string) {
    return HandlerError.failed(`Failed: operation failed, ${action}${path ? ` '${path}'` : ''}`);
  }

  static tooLarge(action: string, path?: string) {
    return HandlerError.failed(`TooLarge: file too large, ${action}${path ? ` '${path}'` : ''}`);
  }

  static notEmpty(action: string, path?: string) {
    return HandlerError.failed(`NotEmpty: directory not empty, ${action}${path ? ` '${path}'` : ''}`);
  }

  static notSupported(action: string, path?: string) {
    return HandlerError.failed(`NotSupported: operation not supported, ${action}${path ? ` '${path}'` : ''}`);
  }

  static notPermitted(action: string, path?: string) {
    return HandlerError.failed(`NotPermitted: operation not permitted, ${action}${path ? ` '${path}'` : ''}`);
  }
}
