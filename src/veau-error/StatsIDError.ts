import { RuntimeError } from '../veau-general/RuntimeError';

export class StatsIDError extends RuntimeError {
  public readonly name: 'StatsIDError' = 'StatsIDError';

  public constructor(message: string) {
    super(message);
  }
}
