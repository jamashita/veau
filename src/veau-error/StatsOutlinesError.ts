import { RuntimeError } from '../veau-general/RuntimeError';

export class StatsOutlinesError extends RuntimeError {
  public readonly name: 'StatsOutlinesError' = 'StatsOutlinesError';

  public constructor(message: string) {
    super(message);
  }
}
