import { RuntimeError } from '../General/RuntimeError';

export class NumericalValueError extends RuntimeError {
  public readonly name: 'NumericalValueError' = 'NumericalValueError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
