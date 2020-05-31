import { RuntimeError } from '@jamashita/publikum-error';

export class StatsOutlineError extends RuntimeError {
  public readonly name: 'StatsOutlineError' = 'StatsOutlineError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
