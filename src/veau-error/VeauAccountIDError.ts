import { RuntimeError } from '../veau-general/RuntimeError';

export class VeauAccountIDError extends RuntimeError {
  public readonly name: 'VeauAccountIDError' = 'VeauAccountIDError';

  public constructor(message: string) {
    super(message);
  }
}
