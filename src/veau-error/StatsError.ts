import { RuntimeError } from '../veau-general/RuntimeError';

export class StatsError extends RuntimeError {
  public readonly name: 'StatsError' = 'StatsError';

  public constructor(message: string) {
    super(`NO SUCH KEY: ${message}`);
  }
}
