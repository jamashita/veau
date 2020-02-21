import { RuntimeError } from '../veau-general/RuntimeError';

export class StatsIDError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
