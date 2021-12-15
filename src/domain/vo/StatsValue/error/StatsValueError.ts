import { RuntimeError } from '@jamashita/anden-error';

export class StatsValueError extends RuntimeError<'StatsValueError'> {
  public readonly noun: 'StatsValueError' = 'StatsValueError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
