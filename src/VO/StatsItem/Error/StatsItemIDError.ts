import { RuntimeError } from '@jamashita/publikum-error';

export class StatsItemIDError extends RuntimeError {
  public readonly name: 'StatsItemIDError' = 'StatsItemIDError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
