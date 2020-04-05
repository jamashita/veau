import { RuntimeError } from '../veau-general/RuntimeError';

export class StatsValuesError extends RuntimeError {
  public readonly name: 'StatsValuesError' = 'StatsValuesError';

  public constructor(message: string) {
    super(message);
  }
}
