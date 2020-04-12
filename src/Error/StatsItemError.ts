import { RuntimeError } from '../General/RuntimeError';

export class StatsItemError extends RuntimeError {
  public readonly name: 'StatsItemError' = 'StatsItemError';

  // TODO
  public constructor(message: string) {
    super(message);
  }
}
