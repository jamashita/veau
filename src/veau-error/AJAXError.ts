import { RuntimeError } from '../veau-general/RuntimeError';

export class AJAXError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
