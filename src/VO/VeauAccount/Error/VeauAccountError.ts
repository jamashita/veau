import { RuntimeError } from '@jamashita/publikum-error';

export class VeauAccountError extends RuntimeError<'VeauAccountError'> {
  public readonly noun: 'VeauAccountError' = 'VeauAccountError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
