import { RuntimeError } from '../General/RuntimeError';

export class AsOfError extends RuntimeError {
  public readonly name: 'AsOfError' = 'AsOfError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
