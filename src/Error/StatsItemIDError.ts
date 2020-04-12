import { RuntimeError } from '../General/RuntimeError';

export class StatsItemIDError extends RuntimeError {
  public readonly name: 'StatsItemIDError' = 'StatsItemIDError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
