import { RuntimeError } from '@jamashita/publikum-error';

export class StatsOutlineError extends RuntimeError<'StatsOutlineError'> {
  public readonly noun: 'StatsOutlineError' = 'StatsOutlineError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
