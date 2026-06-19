import { HandlerError } from '@irpclib/irpc';

export class FSError extends HandlerError {
  static forbidden(action: string, path?: string) {
    return new FSError('forbidden', 'Permission denied', { action, path });
  }

  static notFound(action: string, path?: string) {
    return new FSError('not_found', 'File or directory not found', { action, path });
  }

  static failed(action: string, path?: string) {
    return new FSError('failed', 'Operation failed', { action, path });
  }

  static tooLarge(action: string, path?: string) {
    return new FSError('too_large', 'File is too large', { action, path });
  }

  static notEmpty(action: string, path?: string) {
    return new FSError('not_empty', 'Directory is not empty', { action, path });
  }

  static notSupported(action: string, path?: string) {
    return new FSError('not_supported', 'Operation not supported', { action, path });
  }

  static notPermitted(action: string, path?: string) {
    return new FSError('not_permitted', 'Operation not permitted', { action, path });
  }

  public action: string;
  public path?: string;

  private constructor(code: string, message: string, ctx: { action: string; path?: string }) {
    super(code, message);
    this.action = ctx.action;
    this.path = ctx.path;
  }
}
