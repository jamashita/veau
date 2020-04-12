import { RuntimeError } from '../General/RuntimeError';

export class StatsItemError extends RuntimeError {
  public readonly name: 'StatsItemError' = 'StatsItemError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
