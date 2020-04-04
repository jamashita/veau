import { RuntimeError } from '../veau-general/RuntimeError';

export class StatsOutlinesError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
