import { RuntimeError } from '@jamashita/publikum-error';

export class StatsItemsError extends RuntimeError<'StatsItemsError'> {
  public readonly noun: 'StatsItemsError' = 'StatsItemsError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
