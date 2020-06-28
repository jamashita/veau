import { RuntimeError } from '@jamashita/publikum-error';

export class StatsListItemsError extends RuntimeError<'StatsListItemsError'> {
  public readonly noun: 'StatsListItemsError' = 'StatsListItemsError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
