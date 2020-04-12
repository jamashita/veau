import { RuntimeError } from '../General/RuntimeError';

export class StatsValuesError extends RuntimeError {
  public readonly name: 'StatsValuesError' = 'StatsValuesError';

  // TODO
  public constructor(message: string) {
    super(message);
  }
}
