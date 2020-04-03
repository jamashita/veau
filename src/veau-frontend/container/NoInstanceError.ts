import { RuntimeError } from '../../veau-general/RuntimeError';

export class NoInstanceError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
