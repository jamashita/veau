import { RuntimeError } from '../veau-general/RuntimeError';

export class StatsValueError extends RuntimeError {
  public readonly name: 'StatsValueError' = 'StatsValueError';

  public constructor(message: string) {
    super(message);
  }
}
