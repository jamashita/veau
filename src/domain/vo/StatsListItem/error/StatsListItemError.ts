import { RuntimeError } from '@jamashita/anden-error';

export class StatsListItemError extends RuntimeError<'StatsListItemError'> {
  public readonly noun: 'StatsListItemError' = 'StatsListItemError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
