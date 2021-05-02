import { RuntimeError } from '@jamashita/anden-error';

export class VeauAccountError extends RuntimeError<'VeauAccountError'> {
  public readonly noun: 'VeauAccountError' = 'VeauAccountError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
