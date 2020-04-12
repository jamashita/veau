import { RuntimeError } from '../General/RuntimeError';

export class StatsItemsError extends RuntimeError {
  public readonly name: 'StatsItemsError' = 'StatsItemsError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
