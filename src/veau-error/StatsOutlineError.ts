import { RuntimeError } from '../veau-general/RuntimeError';

export class StatsOutlineError extends RuntimeError {
  public readonly name: 'StatsOutlineError' = 'StatsOutlineError';

  // TODO
  public constructor(message: string) {
    super(message);
  }
}
