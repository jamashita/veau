import { RuntimeError } from '@jamashita/publikum-error';

export class TermIDError extends RuntimeError {
  public readonly name: 'TermIDError' = 'TermIDError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
