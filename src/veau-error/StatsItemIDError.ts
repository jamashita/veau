import { RuntimeError } from '../veau-general/RuntimeError';
import { UUIDError } from '../veau-general/UUID/UUIDError';

export class StatsItemIDError extends RuntimeError {
  public readonly name: 'StatsItemIDError' = 'StatsItemIDError';

  public constructor(err: UUIDError) {
    super(err.message);
    this.stack = err.stack;
  }
}
