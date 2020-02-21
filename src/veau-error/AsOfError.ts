import { RuntimeError } from '../veau-general/RuntimeError';

export class AsOfError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
