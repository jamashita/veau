import { RuntimeError } from '../veau-general/RuntimeError';

export class StatsValueError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
