import { RuntimeError } from '@jamashita/publikum-error';

export class StatsOutlinesError extends RuntimeError {
  public readonly name: 'StatsOutlinesError' = 'StatsOutlinesError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
