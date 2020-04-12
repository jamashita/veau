import { RuntimeError } from '../General/RuntimeError';
import { UUIDError } from '../General/UUID/UUIDError';

export class StatsItemIDError extends RuntimeError {
  public readonly name: 'StatsItemIDError' = 'StatsItemIDError';

  public constructor(err: UUIDError) {
    super(err.message);
    this.stack = err.stack;
  }
}
