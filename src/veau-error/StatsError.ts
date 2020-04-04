import { RuntimeError } from '../veau-general/RuntimeError';

export class StatsError extends RuntimeError {

  public constructor(message: string) {
    super(`NO SUCH KEY: ${message}`);
  }
}
