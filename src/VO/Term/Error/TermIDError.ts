import { RuntimeError } from '@jamashita/publikum-error';

export class TermIDError extends RuntimeError<'TermIDError'> {
  public readonly noun: 'TermIDError' = 'TermIDError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
