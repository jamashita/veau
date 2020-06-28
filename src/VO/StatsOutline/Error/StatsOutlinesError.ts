import { RuntimeError } from '@jamashita/publikum-error';

export class StatsOutlinesError extends RuntimeError<'StatsOutlinesError'> {
  public readonly noun: 'StatsOutlinesError' = 'StatsOutlinesError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
