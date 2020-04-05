import { RuntimeError } from '../veau-general/RuntimeError';

export class VeauAccountError extends RuntimeError {
  public readonly name: 'VeauAccountError' = 'VeauAccountError';

  public constructor(message: string) {
    super(message);
  }
}
