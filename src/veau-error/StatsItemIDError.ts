import { RuntimeError } from '../veau-general/RuntimeError';

export class StatsItemIDError extends RuntimeError {
  public readonly name: 'StatsItemIDError' = 'StatsItemIDError';

  public constructor(message: string) {
    super(message);
  }
}
