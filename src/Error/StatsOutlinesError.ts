import { RuntimeError } from 'publikum';

export class StatsOutlinesError extends RuntimeError {
  public readonly name: 'StatsOutlinesError' = 'StatsOutlinesError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
