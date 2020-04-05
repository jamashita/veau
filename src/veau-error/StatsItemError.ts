import { RuntimeError } from '../veau-general/RuntimeError';

export class StatsItemError extends RuntimeError {
  public readonly name: 'StatsItemError' = 'StatsItemError';

  public constructor(message: string) {
    super(message);
  }
}
