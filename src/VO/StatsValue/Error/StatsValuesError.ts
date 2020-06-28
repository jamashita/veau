import { RuntimeError } from '@jamashita/publikum-error';

export class StatsValuesError extends RuntimeError<'StatsValuesError'> {
  public readonly noun: 'StatsValuesError' = 'StatsValuesError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
