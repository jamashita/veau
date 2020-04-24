import { RuntimeError } from 'publikum';

export class StatsValuesError extends RuntimeError {
  public readonly name: 'StatsValuesError' = 'StatsValuesError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
