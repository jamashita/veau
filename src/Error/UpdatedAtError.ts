import { RuntimeError } from '../General/RuntimeError';

export class UpdatedAtError extends RuntimeError {
  public readonly name: 'UpdatedAtError' = 'UpdatedAtError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
