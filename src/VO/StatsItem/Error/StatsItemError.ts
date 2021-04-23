import { RuntimeError } from '@jamashita/anden-error';

export class StatsItemError extends RuntimeError<'StatsItemError'> {
  public readonly noun: 'StatsItemError' = 'StatsItemError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
