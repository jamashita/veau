import { RuntimeError } from '../veau-general/RuntimeError';

export class VeauAccountError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
