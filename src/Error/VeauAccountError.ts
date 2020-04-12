import { RuntimeError } from '../General/RuntimeError';

export class VeauAccountError extends RuntimeError {
  public readonly name: 'VeauAccountError' = 'VeauAccountError';

  public constructor(message: string) {
    super(message);
  }
}