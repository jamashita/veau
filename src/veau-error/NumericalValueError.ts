import { RuntimeError } from '../veau-general/RuntimeError';

export class NumericalValueError extends RuntimeError {
  public readonly name: 'NumericalValueError' = 'NumericalValueError';

  public constructor(message: string) {
    super(message);
  }
}
