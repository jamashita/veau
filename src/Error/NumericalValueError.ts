import { RuntimeError } from 'publikum';

export class NumericalValueError extends RuntimeError {
  public readonly name: 'NumericalValueError' = 'NumericalValueError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
