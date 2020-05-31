import { RuntimeError } from '@jamashita/publikum-error';

export class StatsValuesError extends RuntimeError {
  public readonly name: 'StatsValuesError' = 'StatsValuesError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
