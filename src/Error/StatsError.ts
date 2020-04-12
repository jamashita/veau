import { RuntimeError } from '../General/RuntimeError';

export class StatsError extends RuntimeError {
  public readonly name: 'StatsError' = 'StatsError';

  // TODO
  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
