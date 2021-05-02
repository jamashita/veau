import { RuntimeError } from '@jamashita/anden-error';

export class NumericalValueError extends RuntimeError<'NumericalValueError'> {
  public readonly noun: 'NumericalValueError' = 'NumericalValueError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
