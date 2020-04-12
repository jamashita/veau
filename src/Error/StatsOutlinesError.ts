import { RuntimeError } from '../General/RuntimeError';

export class StatsOutlinesError extends RuntimeError {
  public readonly name: 'StatsOutlinesError' = 'StatsOutlinesError';

  // todo
  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
