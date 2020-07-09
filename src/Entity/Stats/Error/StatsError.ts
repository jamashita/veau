import { RuntimeError } from '@jamashita/publikum-error';

export class StatsError extends RuntimeError {
  public readonly noun: 'StatsError' = 'StatsError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
