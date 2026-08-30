import { IRPC_ERROR_TYPE, IRPCError } from '@irpclib/irpc';

export const AI_ERROR_TYPE = {
  NOT_IMPLEMENTED: 'NotImplemented',
};

export class AIError extends IRPCError {
  constructor(code: string, message: string, cause?: Error) {
    super(IRPC_ERROR_TYPE.HANDLER, code, message, cause);
  }

  static notImplemented() {
    return new AIError(AI_ERROR_TYPE.NOT_IMPLEMENTED, 'AI handler not implemented.');
  }
}

export const AI_DRIVER_ERROR_TYPE = {
  NOT_IMPLEMENTED: 'NotImplemented',
};

export class AIDriverError extends IRPCError {
  constructor(code: string, message: string, cause?: Error) {
    super(IRPC_ERROR_TYPE.HANDLER, code, message, cause);
  }

  static notImplemented() {
    return new AIDriverError(AI_DRIVER_ERROR_TYPE.NOT_IMPLEMENTED, 'AI driver handler not implemented.');
  }
}
