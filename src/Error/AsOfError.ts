import { RuntimeError } from 'publikum';

export class AsOfError extends RuntimeError {
  public readonly name: 'AsOfError' = 'AsOfError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
