import { RuntimeError } from 'publikum';

export class StatsListItemsError extends RuntimeError {
  public readonly name: 'StatsListItemsError' = 'StatsListItemsError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
