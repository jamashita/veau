import { RuntimeError } from '../veau-general/RuntimeError';

export class StatsValuesError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
