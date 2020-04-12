import { RuntimeError } from '../RuntimeError';

export class UUIDError extends RuntimeError {
  public readonly name: 'UUIDError' = 'UUIDError';

  public constructor(message: string) {
    super(message);
  }
}
