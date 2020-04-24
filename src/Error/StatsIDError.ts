import { RuntimeError } from 'publikum';

export class StatsIDError extends RuntimeError {
  public readonly name: 'StatsIDError' = 'StatsIDError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
