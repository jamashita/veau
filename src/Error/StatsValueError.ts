import { RuntimeError } from '../General/RuntimeError';

export class StatsValueError extends RuntimeError {
  public readonly name: 'StatsValueError' = 'StatsValueError';

  // TODO
  public constructor(message: string) {
    super(message);
  }
}
