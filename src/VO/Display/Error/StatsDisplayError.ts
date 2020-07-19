import { RuntimeError } from '@jamashita/publikum-error';

export class StatsDisplayError extends RuntimeError<'StatsDisplayError'> {
  public readonly noun: 'StatsDisplayError' = 'StatsDisplayError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
