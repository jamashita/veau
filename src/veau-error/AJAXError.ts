import { RuntimeError } from '../veau-general/RuntimeError';

export class AJAXError extends RuntimeError {
  public readonly name: 'AJAXError' = 'AJAXError';

  public constructor(message: string) {
    super(message);
  }
}
