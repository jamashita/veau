import { RuntimeError } from '../veau-general/RuntimeError';

export class NumericalValueError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
