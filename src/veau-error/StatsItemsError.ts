import { RuntimeError } from '../veau-general/RuntimeError';

export class StatsItemsError extends RuntimeError {
  public readonly name: 'StatsItemsError' = 'StatsItemsError';

  public constructor(message: string) {
    super(message);
  }
}
