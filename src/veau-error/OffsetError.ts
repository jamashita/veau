import { RuntimeError } from '../veau-general/RuntimeError';

export class OffsetError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
