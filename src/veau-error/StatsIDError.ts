import { RuntimeError } from '../veau-general/RuntimeError';
import { UUIDError } from '../veau-general/UUID/UUIDError';

export class StatsIDError extends RuntimeError {
  public readonly name: 'StatsIDError' = 'StatsIDError';

  public constructor(err: UUIDError) {
    super(err.message);
    this.stack = err.stack;
  }
}
