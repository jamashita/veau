import { RuntimeError } from '../veau-general/RuntimeError';

export class VeauAccountIDError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
