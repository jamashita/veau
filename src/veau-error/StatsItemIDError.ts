import { RuntimeError } from '../veau-general/RuntimeError';

export class StatsItemIDError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
