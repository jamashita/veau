import { RuntimeError } from '@jamashita/publikum-error';

export class StatsDisplayItemError extends RuntimeError<'StatsDisplayItemError'> {
  public readonly noun: 'StatsDisplayItemError' = 'StatsDisplayItemError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
