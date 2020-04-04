import { RuntimeError } from '../veau-general/RuntimeError';

export class StatsItemsError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}