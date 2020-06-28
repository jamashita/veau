import { RuntimeError } from '@jamashita/publikum-error';

export class AsOfError extends RuntimeError<'AsOfError'> {
  public readonly noun: 'AsOfError' = 'AsOfError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
