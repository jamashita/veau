import { RuntimeError } from 'publikum';

export class StatsValueError extends RuntimeError {
  public readonly name: 'StatsValueError' = 'StatsValueError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
