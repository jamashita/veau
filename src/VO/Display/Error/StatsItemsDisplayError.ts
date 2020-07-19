import { RuntimeError } from '@jamashita/publikum-error';

export class StatsDisplayItemsError extends RuntimeError<'StatsDisplayItemsError'> {
  public readonly noun: 'StatsDisplayItemsError' = 'StatsDisplayItemsError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
