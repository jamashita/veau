import { RuntimeError } from '../veau-general/RuntimeError';
import { UUIDError } from '../veau-general/UUID/UUIDError';

export class VeauAccountIDError extends RuntimeError {
  public readonly name: 'VeauAccountIDError' = 'VeauAccountIDError';

  public constructor(err: UUIDError) {
    super(err.message);
    this.stack = err.stack;
  }
}
