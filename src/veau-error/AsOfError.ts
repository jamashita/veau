import { RuntimeError } from '../veau-general/RuntimeError';

export class AsOfError extends RuntimeError {
  public readonly name: 'AsOfError' = 'AsOfError';

  public constructor(message: string) {
    super(message);
  }
}
