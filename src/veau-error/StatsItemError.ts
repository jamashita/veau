import { RuntimeError } from '../veau-general/RuntimeError';

export class StatsItemError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
