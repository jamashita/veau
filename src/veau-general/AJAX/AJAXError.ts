import { RuntimeError } from '../RuntimeError';

export class AJAXError extends RuntimeError {
  public readonly name: 'AJAXError' = 'AJAXError';

  public constructor(message: string) {
    super(message);
  }
}
