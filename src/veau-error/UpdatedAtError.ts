import { RuntimeError } from '../veau-general/RuntimeError';

export class UpdatedAtError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
