import { RuntimeError } from 'publikum';

export class UpdatedAtError extends RuntimeError {
  public readonly name: 'UpdatedAtError' = 'UpdatedAtError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
