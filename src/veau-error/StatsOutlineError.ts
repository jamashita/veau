import { RuntimeError } from '../veau-general/RuntimeError';

export class StatsOutlineError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
