import { RuntimeError } from 'publikum';

export class VeauAccountIDError extends RuntimeError {
  public readonly name: 'VeauAccountIDError' = 'VeauAccountIDError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
