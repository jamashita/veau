import { RuntimeError } from '../../veau-general/RuntimeError';

export class NoInstanceError extends RuntimeError {
  public readonly name: 'NoInstanceError' = 'NoInstanceError';

  public constructor(message: string) {
    super(message);
  }
}
