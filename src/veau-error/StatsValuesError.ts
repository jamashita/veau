import { RuntimeError } from '../veau-general/RuntimeError';

export class StatsValuesError extends RuntimeError {
  public readonly name: 'StatsValuesError' = 'StatsValuesError';

  // todo contains error
  public constructor(message: string) {
    super(message);
  }
}
