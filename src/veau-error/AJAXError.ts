import { RuntimeError } from './RuntimeError';

export class AJAXError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
