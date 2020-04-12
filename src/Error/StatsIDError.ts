import { RuntimeError } from '../General/RuntimeError';
import { UUIDError } from '../General/UUID/UUIDError';

export class StatsIDError extends RuntimeError {
  public readonly name: 'StatsIDError' = 'StatsIDError';

  public constructor(err: UUIDError) {
    super(err.message);
    this.stack = err.stack;
  }
}
