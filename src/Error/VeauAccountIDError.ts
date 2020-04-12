import { RuntimeError } from '../General/RuntimeError';
import { UUIDError } from '../General/UUID/UUIDError';

export class VeauAccountIDError extends RuntimeError {
  public readonly name: 'VeauAccountIDError' = 'VeauAccountIDError';

  public constructor(err: UUIDError) {
    super(err.message);
    this.stack = err.stack;
  }
}
