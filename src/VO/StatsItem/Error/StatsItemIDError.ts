import { RuntimeError } from '@jamashita/publikum-error';

export class StatsItemIDError extends RuntimeError<'StatsItemIDError'> {
  public readonly noun: 'StatsItemIDError' = 'StatsItemIDError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
