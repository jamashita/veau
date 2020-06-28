import { RuntimeError } from '@jamashita/publikum-error';

export class StatsIDError extends RuntimeError<'StatsIDError'> {
  public readonly noun: 'StatsIDError' = 'StatsIDError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
