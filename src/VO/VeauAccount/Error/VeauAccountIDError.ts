import { RuntimeError } from '@jamashita/publikum-error';

export class VeauAccountIDError extends RuntimeError<'VeauAccountIDError'> {
  public readonly noun: 'VeauAccountIDError' = 'VeauAccountIDError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
